import assert from 'node:assert/strict';
import test from 'node:test';
import { HttpError, SpotifyClient } from '../src/spotify.js';

test('rejects malformed Spotify track IDs before making a request', async () => {
  const client = new SpotifyClient({ clientId: 'id', clientSecret: 'secret', fetchImpl: () => assert.fail('unexpected fetch') });
  await assert.rejects(() => client.getTrack('not-a-track'), (error) => error instanceof HttpError && error.status === 400);
});

test('normalizes Spotify track metadata', async () => {
  const requests = [];
  const client = new SpotifyClient({
    clientId: 'id',
    clientSecret: 'secret',
    fetchImpl: async (url) => {
      requests.push(url);
      if (url.includes('/api/token')) return new Response(JSON.stringify({ access_token: 'token', expires_in: 3600 }), { status: 200 });
      return new Response(JSON.stringify({
        id: '4uLU6hMCjMI75M1A2tKUQC', name: 'Never Gonna Give You Up', duration_ms: 213573,
        artists: [{ name: 'Rick Astley' }], album: { name: 'Whenever You Need Somebody', images: [{ url: 'https://example.test/art.jpg' }] },
      }), { status: 200 });
    },
  });
  const track = await client.getTrack('4uLU6hMCjMI75M1A2tKUQC');
  assert.deepEqual(track, {
    spotifyTrackId: '4uLU6hMCjMI75M1A2tKUQC', artist: 'Rick Astley', track: 'Never Gonna Give You Up',
    album: 'Whenever You Need Somebody', artwork: 'https://example.test/art.jpg', durationMs: 213573,
  });
  assert.equal(requests.length, 2);
});
