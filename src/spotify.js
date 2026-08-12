const SPOTIFY_TRACK_ID = /^[A-Za-z0-9]{22}$/;

export class SpotifyClient {
  #token;
  #expiresAt = 0;

  constructor({ clientId, clientSecret, fetchImpl = fetch }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.fetch = fetchImpl;
  }

  async getTrack(trackId) {
    if (!SPOTIFY_TRACK_ID.test(trackId)) {
      throw new HttpError(400, 'spotifyTrackId must be a 22-character Spotify track ID.');
    }
    if (!this.clientId || !this.clientSecret) {
      throw new HttpError(503, 'Spotify lookup is not configured on this server.');
    }

    const token = await this.#getToken();
    const response = await this.fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (response.status === 404) throw new HttpError(404, 'Spotify track not found.');
    if (!response.ok) throw new HttpError(502, 'Spotify metadata lookup failed.');

    const track = await response.json();
    return {
      spotifyTrackId: track.id,
      artist: track.artists.map(({ name }) => name).join(', '),
      track: track.name,
      album: track.album?.name,
      artwork: track.album?.images?.[0]?.url,
      durationMs: track.duration_ms,
    };
  }

  async #getToken() {
    if (this.#token && Date.now() < this.#expiresAt) return this.#token;
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await this.fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        authorization: `Basic ${credentials}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!response.ok) throw new HttpError(502, 'Could not obtain a Spotify access token.');

    const { access_token: token, expires_in: expiresIn } = await response.json();
    this.#token = token;
    this.#expiresAt = Date.now() + Math.max(0, expiresIn - 60) * 1000;
    return token;
  }
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
