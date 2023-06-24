const express = require('express');
const router = express.Router();
const Spotify = require.main.require('./app/services/spotify');

router.get('/:artistId', (req, res) => {
    Spotify.getArtist(req.params.artistId)
        .then(data => {
            const html = `
                <html>
                    <head>
                        <title>Artist Profile</title>
                        <style>
                            body {
                                background-color: #121212;
                                color: #FFFFFF;
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                            }
                            
                            .container {
                                background-color: #1E1E1E;
                                border-radius: 10px;
                                padding: 20px;
                                text-align: center;
                            }
                            
                            h1 {
                                font-size: 32px;
                                margin-bottom: 10px;
                            }
                            
                            img {
                                max-width: 200px;
                                border-radius: 10px;
                                margin-bottom: 20px;
                            }
                            
                            p {
                                margin-bottom: 5px;
                            }
                            
                            ul {
                                list-style-type: none;
                                padding: 0;
                            }
                            
                            li {
                                margin-bottom: 5px;
                            }
                            
                            a {
                                color: #FFFFFF;
                                
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>${data.body.name}</h1>
                            <img src="${data.body.images[0].url}" alt="Artist Image">
                            <ul>
                                <li><strong>Followers:</strong> ${data.body.followers.total}</li>
                                <li><strong>Genres:</strong> ${data.body.genres.join(', ')}</li>
                                <li><strong><a href="${data.body.external_urls.spotify}" target="_blank">Spotify Profile</a></strong></li>
                                <br><br>
                                <li><strong><a href="#" onclick="window.history.back();">Go back</a></strong></li>
                            </ul>
                        </div>
                    </body>
                </html>
            `;
            res.send(html);
        })
        .catch(err => {
            res.status(err.statusCode).json(err);
        });
});

module.exports = router;
