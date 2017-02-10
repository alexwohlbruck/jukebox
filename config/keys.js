module.exports = {
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: '/api/auth/callback'
    },
    google: {
        apiKey: process.env.GOOGLE_SERVER_KEY
    }
};