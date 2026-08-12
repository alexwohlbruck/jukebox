# Vega deployment

The service lives at `/opt/jukebox` on Vega and runs as the `jukebox` Compose service. It connects only to the external `opt_caddy` network; Caddy is the public entry point.

## Configuration

Create `/opt/jukebox/.env` with mode `600`:

```dotenv
# Required only for /v1/metadata and Spotify-ID streaming.
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# Browser origins allowed to call the API across origins.
ALLOWED_ORIGINS=https://alex.wohlbruck.dev
```

The checked-in [.env.example](../.env.example) is a safe template. Never commit the real `.env` file.

## Automatic updates

Pushing to `master` runs [the image-publishing workflow](../.github/workflows/publish-image.yml), which publishes `ghcr.io/alexwohlbruck/jukebox:latest`. Vega's Watchtower checks labeled containers hourly and recreates Jukebox when that tag changes.

The compose service is explicitly labeled `com.centurylinklabs.watchtower.enable=true`. No host port is exposed; the recreated container rejoins `opt_caddy` and Caddy continues to proxy it by name.

## Initial deploy or manual update

```sh
cd /opt/jukebox
docker compose pull
docker compose up -d
docker compose ps
```

Run this once after the GitHub Actions image has been published, or to pull a newly published image without waiting for Watchtower. The image contains Node.js, `yt-dlp`, and `ffmpeg`, so no host-level media tooling is required.

## Caddy

Add the contents of [Caddyfile.snippet](Caddyfile.snippet) to `/opt/caddy/Caddyfile`, validate, and reload:

```sh
docker exec caddy caddy validate --config /etc/caddy/Caddyfile
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

`jukebox.wohlbruck.dev` must have a public DNS record pointing to Vega before Caddy can obtain its TLS certificate. The current deployment uses a CNAME to `wohlbruck.duckdns.org`.

## Verify

```sh
curl -fsS https://jukebox.wohlbruck.dev/health
curl -fsSI 'https://jukebox.wohlbruck.dev/v1/stream?artist=Daft%20Punk&track=One%20More%20Time'
docker compose logs --tail=100 jukebox
```

For an end-to-end stream test, download a small sample and inspect it:

```sh
curl -fsS --max-time 30 \
  'https://jukebox.wohlbruck.dev/v1/stream?artist=Daft%20Punk&track=One%20More%20Time' \
  -o /tmp/jukebox-test.mp3
file /tmp/jukebox-test.mp3
```

The expected media type is `audio/mpeg`; `file` should identify MPEG Layer III audio.

## Troubleshooting

- `503 Spotify lookup is not configured`: add both Spotify credentials, then recreate the container with `docker compose up -d --force-recreate`.
- `502 Unable to prepare the requested audio stream`: inspect `docker compose logs jukebox`; YouTube availability and yt-dlp extraction can change independently of the API.
- TLS errors: verify DNS with `dig +short jukebox.wohlbruck.dev`, then inspect `docker logs caddy` for ACME messages. Caddy's TLS-ALPN validation needs inbound port 443.
- A stale Docker health status after an update: wait for the healthcheck interval, then run `docker inspect -f '{{.State.Health.Status}}' jukebox`.
- No automatic update after an hour: check `docker logs watchtower` and confirm `docker inspect jukebox --format '{{index .Config.Labels "com.centurylinklabs.watchtower.enable"}}'` returns `true`.
