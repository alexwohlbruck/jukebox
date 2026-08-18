import 'dotenv/config';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { HttpError, SpotifyClient } from './spotify.js';

const PORT = Number(process.env.PORT || 8080);
const YTDLP_BIN = process.env.YTDLP_BIN || 'yt-dlp';
const MAX_START_MS = 6 * 60 * 60 * 1000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean) || [];
const spotify = new SpotifyClient({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));
app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));

app.get('/health', (_request, response) => response.json({ ok: true }));

app.get('/v1/metadata', async (request, response, next) => {
  try {
    response.json(await spotify.getTrack(request.query.spotifyTrackId));
  } catch (error) {
    next(error);
  }
});

app.get('/v1/stream', async (request, response, next) => {
  try {
    const source = await getSource(request.query);
    streamAsMp3(source, response, requestStartedAt(request.query));
  } catch (error) {
    next(error);
  }
});

/** Shows the exact YouTube match the stream route would transcode. */
app.get('/v1/debug/resolve', async (request, response, next) => {
  try {
    const source = await getSource(request.query);
    response.set('Cache-Control', 'no-store').json({
      search: searchQuery(source),
      url: await resolveYouTubeUrl(source),
    });
  } catch (error) {
    next(error);
  }
});

function cleanText(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new HttpError(400, `${field} is required.`);
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length > 200) throw new HttpError(400, `${field} must be at most 200 characters.`);
  return normalized;
}

async function getSource(query) {
  const startMs = cleanStartMs(query.startMs);
  if (query.spotifyTrackId) return { ...(await spotify.getTrack(cleanText(query.spotifyTrackId, 'spotifyTrackId'))), startMs };
  return {
    artist: cleanText(query.artist, 'artist'),
    track: cleanText(query.track, 'track'),
    startMs,
  };
}

function cleanStartMs(value) {
  if (value === undefined) return 0;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) throw new HttpError(400, 'startMs must be a non-negative integer.');
  const startMs = Number(value);
  if (!Number.isSafeInteger(startMs) || startMs > MAX_START_MS) {
    throw new HttpError(400, `startMs must be at most ${MAX_START_MS}.`);
  }
  return startMs;
}

/**
 * A companion player records when it asked to join the track. Resolution and
 * decoder startup can take a few seconds, so advance its requested source
 * offset by that elapsed time immediately before spawning yt-dlp. This keeps
 * the first audible packet close to the live Spotify position without adding
 * another seek or buffering round-trip.
 */
function requestStartedAt(query) {
  if (query.requestedAtMs === undefined) return undefined;
  if (typeof query.requestedAtMs !== 'string' || !/^\d{13}$/.test(query.requestedAtMs)) {
    throw new HttpError(400, 'requestedAtMs must be a Unix timestamp in milliseconds.');
  }
  const requestedAtMs = Number(query.requestedAtMs);
  if (!Number.isSafeInteger(requestedAtMs)) {
    throw new HttpError(400, 'requestedAtMs must be a Unix timestamp in milliseconds.');
  }
  return requestedAtMs;
}

function searchQuery({ artist, track }) {
  // The search text is an argument, never a shell command; users cannot inject flags or commands.
  return `ytsearch1:${artist} - ${track}`;
}

function resolveYouTubeUrl(source) {
  return new Promise((resolve, reject) => {
    const resolver = spawn(YTDLP_BIN, ['--no-playlist', '--no-warnings', '--skip-download', '--print', '%(webpage_url)s', searchQuery(source)], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    let errorOutput = '';
    resolver.stdout.on('data', (chunk) => { output += chunk; });
    resolver.stderr.on('data', (chunk) => { errorOutput = `${errorOutput}${chunk}`.slice(-2000); });
    resolver.on('error', (error) => reject(new HttpError(502, `Could not resolve YouTube source: ${error.message}`)));
    resolver.on('close', (code) => {
      const url = output.trim().split(/\s+/)[0];
      if (code === 0 && url?.startsWith('https://')) return resolve(url);
      reject(new HttpError(502, `Could not resolve YouTube source: ${errorOutput || `yt-dlp exited with code ${code}.`}`));
    });
  });
}

function streamAsMp3({ artist, track, startMs = 0 }, response, requestedAtMs) {
  const search = searchQuery({ artist, track });
  const elapsedMs = requestedAtMs === undefined ? 0 : Math.max(0, Date.now() - requestedAtMs);
  const liveStartMs = Math.min(MAX_START_MS, startMs + elapsedMs);
  const offset = liveStartMs ? ['--download-sections', `*${(liveStartMs / 1000).toFixed(3)}-inf`] : [];
  const downloader = spawn(YTDLP_BIN, ['--no-playlist', '--no-warnings', '--format', 'bestaudio/best', ...offset, '--output', '-', search], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  // This is a live player rather than an archival encoder: start decoding as
  // soon as the first audio packets arrive and flush each MP3 packet onward.
  const encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-analyzeduration', '0', '-probesize', '32k', '-i', 'pipe:0', '-vn', '-map', 'a:0', '-codec:a', 'libmp3lame', '-q:a', '2', '-flush_packets', '1', '-f', 'mp3', 'pipe:1'], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  downloader.stdout.pipe(encoder.stdin);

  let errorOutput = '';
  const collectError = (chunk) => { errorOutput = `${errorOutput}${chunk}`.slice(-2000); };
  downloader.stderr.on('data', collectError);
  encoder.stderr.on('data', collectError);
  let stopped = false;
  const stop = () => {
    stopped = true;
    downloader.kill('SIGTERM');
    encoder.kill('SIGTERM');
  };
  // A listener hanging up is routine: response 'close' kills ffmpeg, but yt-dlp
  // is still writing into encoder.stdin. Each stdio pipe is a socket of its own,
  // and `downloader.on('error')` covers only spawn failures -- so that write
  // lands on a closed pipe and the unhandled EPIPE takes the process down.
  const onStreamError = (error) => {
    if (stopped || error.code === 'EPIPE' || error.code === 'ERR_STREAM_PREMATURE_CLOSE') return;
    fail(error.message);
  };
  downloader.stdout.on('error', onStreamError);
  encoder.stdin.on('error', onStreamError);
  encoder.stdout.on('error', onStreamError);
  response.on('error', stop);
  response.on('close', stop);
  downloader.on('error', (error) => fail(error.message));
  encoder.on('error', (error) => fail(error.message));
  downloader.on('close', (code) => {
    if (code !== 0 && !response.headersSent) fail(errorOutput || `yt-dlp exited with code ${code}.`);
  });
  encoder.on('close', (code) => {
    if (code !== 0 && !response.headersSent) fail(errorOutput || `ffmpeg exited with code ${code}.`);
  });

  function fail(message) {
    stop();
    if (!response.headersSent) response.status(502).json({ error: 'Unable to prepare the requested audio stream.', detail: message });
  }

  response.status(200).set({
    'Content-Type': 'audio/mpeg',
    'Cache-Control': 'no-store',
    'Content-Disposition': `inline; filename="${safeFilename(`${artist} - ${track}`)}.mp3"`,
  });
  encoder.stdout.pipe(response);
}

function safeFilename(value) {
  return value.replace(/[^a-zA-Z0-9._ -]/g, '').slice(0, 180) || 'jukebox-stream';
}

app.use((error, _request, response, _next) => {
  const status = error instanceof HttpError ? error.status : 500;
  if (status === 500) console.error(error);
  response.status(status).json({ error: error.message || 'Unexpected server error.' });
});

app.listen(PORT, () => console.log(`Jukebox listening on port ${PORT}`));
