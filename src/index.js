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
    streamAsMp3(source, response);
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

function streamAsMp3({ artist, track, startMs = 0 }, response) {
  // The search text is an argument, never a shell command; users cannot inject flags or commands.
  const search = `ytsearch1:${artist} - ${track} official audio`;
  const offset = startMs ? ['--download-sections', `*${(startMs / 1000).toFixed(3)}-inf`] : [];
  const downloader = spawn(YTDLP_BIN, ['--no-playlist', '--no-warnings', '--format', 'bestaudio/best', ...offset, '--output', '-', search], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', 'pipe:0', '-vn', '-map', 'a:0', '-codec:a', 'libmp3lame', '-q:a', '2', '-f', 'mp3', 'pipe:1'], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  downloader.stdout.pipe(encoder.stdin);

  let errorOutput = '';
  const collectError = (chunk) => { errorOutput = `${errorOutput}${chunk}`.slice(-2000); };
  downloader.stderr.on('data', collectError);
  encoder.stderr.on('data', collectError);
  const stop = () => {
    downloader.kill('SIGTERM');
    encoder.kill('SIGTERM');
  };
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
