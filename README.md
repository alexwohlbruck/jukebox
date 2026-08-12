# Jukebox

Jukebox is a self-hosted music streaming service. Its backend resolves optional Spotify track IDs into artist/title metadata, finds a matching YouTube audio source with `yt-dlp`, then transcodes and streams MP3 with `ffmpeg`. Audio is never stored on disk.

The original AngularJS application is served at `/`. The current backend API is versioned under `/v1`; the legacy Angular client still refers to retired `/api` routes and is retained unchanged for historical reference.

## Backend API

The complete endpoint, validation, response, and error reference is in [docs/API.md](docs/API.md). In short:

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Container health check. |
| `GET /v1/metadata?spotifyTrackId=…` | Resolve a Spotify track ID without starting playback. |
| `GET /v1/stream?artist=…&track=…` | Find and stream a matching MP3. |
| `GET /v1/stream?spotifyTrackId=…` | Resolve Spotify metadata, then stream a matching MP3. |

Example:

```sh
curl -L 'https://jukebox.wohlbruck.dev/v1/stream?artist=Daft%20Punk&track=Harder%20Better%20Faster%20Stronger' \
  --output track.mp3
```

## Run locally

```sh
cp .env.example .env
npm install
npm start
curl -I 'http://localhost:8080/v1/stream?artist=Daft%20Punk&track=Harder%20Better%20Faster%20Stronger'
```

The production Docker image includes `yt-dlp` and `ffmpeg`. See [deploy/README.md](deploy/README.md) for Vega-specific deployment, configuration, verification, and troubleshooting.

## Vega deployment

Follow [deploy/README.md](deploy/README.md). The service joins the existing `opt_caddy` network and has no exposed host port.
