# Backend API

Base URL: `https://jukebox.wohlbruck.dev`

All endpoints are public `GET` requests. The API returns JSON error objects in the form `{ "error": "message" }`, except where a stream has already begun. Query strings must be URL encoded.

## `GET /health`

Liveness endpoint used by Docker and deployment checks. It does not check Spotify, YouTube, or ffmpeg availability.

```http
GET /health
```

```json
{ "ok": true }
```

## `GET /v1/metadata`

Resolves a Spotify track ID to the metadata Jukebox uses for its search. This does not query YouTube or begin playback.

| Query parameter | Required | Rules |
| --- | --- | --- |
| `spotifyTrackId` | Yes | A 22-character Spotify track ID, not a URL or URI. |

```http
GET /v1/metadata?spotifyTrackId=4uLU6hMCjMI75M1A2tKUQC
```

```json
{
  "spotifyTrackId": "4uLU6hMCjMI75M1A2tKUQC",
  "artist": "Rick Astley",
  "track": "Never Gonna Give You Up",
  "album": "Whenever You Need Somebody",
  "artwork": "https://…",
  "durationMs": 213573
}
```

This endpoint requires `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.

## `GET /v1/stream`

Finds a matching YouTube result through `yt-dlp` and streams its audio as MP3. The response is produced live—there is no cached file and no `Content-Length`, so clients should treat it as a chunked stream.

Provide exactly one source form:

| Source form | Parameters | Credential requirement |
| --- | --- | --- |
| Artist/title | `artist`, `track` | None |
| Spotify | `spotifyTrackId` | Spotify client ID and client secret |

`artist` and `track` are each required for artist/title streaming, normalized for whitespace, and limited to 200 characters. `spotifyTrackId` must be a 22-character ID.

```http
GET /v1/stream?artist=Daft%20Punk&track=One%20More%20Time
```

```http
GET /v1/stream?spotifyTrackId=4uLU6hMCjMI75M1A2tKUQC
```

Successful responses have these important headers:

```http
Content-Type: audio/mpeg
Content-Disposition: inline; filename="Artist - Track.mp3"
Cache-Control: no-store
```

Use an `<audio>` element or a media-capable client. Range requests and seeking are not supported because transcoding happens as the source is read.

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Missing/invalid query parameter, including malformed Spotify IDs. |
| `404` | Spotify track was not found. |
| `502` | Spotify, yt-dlp, or ffmpeg could not prepare the requested result. |
| `503` | Spotify credentials are absent for a Spotify ID request. |

For `502` errors before a stream starts, the response includes a `detail` field suitable for server-side diagnosis. Do not present that implementation detail directly to end users.

## Browser access

Set `ALLOWED_ORIGINS` to a comma-separated list of browser origins that may request the API with CORS. Same-origin requests from the Jukebox homepage do not need it. The Vega deployment currently permits `https://alex.wohlbruck.dev` for the portfolio player.
