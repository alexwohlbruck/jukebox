
# Jukebox Redux
#### By Alex Wohlbruck
##### Maintained by: LaganYT

### Desctiption:

Jukebox: Elevate Your Music Experience with Seamless Listening and Downloading

Welcome to Jukebox, the ultimate destination for music lovers. Discover, stream, and download your favorite tunes effortlessly. Our intuitive interface immerses you in a world of melodious bliss, whether you're a casual listener or an audiophile.

Discover: Explore a vast music library, curated playlists, and hidden gems. Our passionate curators bring you the best of the best.

Listen: Enjoy crystal-clear audio quality with uninterrupted playback. Create playlists, save favorites, and rediscover beloved tracks.

Download: Take your music offline hassle-free. Enjoy your tunes wherever you go.

User-Friendly Experience: Find what you want easily with our streamlined design and intuitive navigation.

Join Jukebox today and unlock a world of musical wonders. Discover, rediscover, and build the perfect playlist. Let the melodies resonate, the rhythm flow, and the beats transport you to new heights of musical euphoria. Get ready for a unique musical journey with Jukebox.

*Jukebox is made for desktop devices, not supported by mobile.

# Paid Setup process:

Step 1: Go to [heroku](https://dashboard.heroku.com/apps) and create a new app.

Step 2: Link your github fork of this project to the app (In the setup page or deployment menu) - Use `main` branch for auto updates

Step 3: Go to the settings and fill out the following enviromental variables/config vars

```
SPOTIFY_CLIENT_ID = xxxxxxxxxxxxxxxxxxxxx
SPOTIFY_CLIENT_SECRET = xxxxxxxxxxxxxxxxxxxxx
GOOGLE_SERVER_KEY = xxxxxxxxxxxxxxxxxxxxx
```
To get the Google server key, head to the [Google Cloud Platform website](https://console.cloud.google.com/), create a project and go to the APIs and Services page. Then Enable the `Youtube Data API V3`. You should be able to generate a server API key, which will be the value to put in your .env file.

Then, log in to the [Spotify Developer Console](https://developer.spotify.com/dashboard), and create a new app. Once created, you should get Client ID and Client Secret keys, which are the other two values for your `.env` file.

Step 4: Go back to the settings and install the nodejs buildpack.

Step 5: Deploy the webapp.

# Free Setup process:

Step 1: Go to [Glitch]([https://dashboard.heroku.com/apps](https://glitch.com/dashboard)) and click 'import from github'

Step 2: There should be a popup asking what github repo to import from, insert this: `https://github.com/alexwohlbruck/jukebox`

Step 3: Go to the .env file, and fill out the following variables.

```
SPOTIFY_CLIENT_ID = xxxxxxxxxxxxxxxxxxxxx
SPOTIFY_CLIENT_SECRET = xxxxxxxxxxxxxxxxxxxxx
GOOGLE_SERVER_KEY = xxxxxxxxxxxxxxxxxxxxx
```
To get the Google server key, head to the [Google Cloud Platform website](https://console.cloud.google.com/), create a project and go to the APIs and Services page. Then Enable the `Youtube Data API V3`. You should be able to generate a server API key, which will be the value to put in your .env file.

Then, log in to the [Spotify Developer Console](https://developer.spotify.com/dashboard), and create a new app. Once created, you should get Client ID and Client Secret keys, which are the other two values for your `.env` file.

Step 4: Make sure everything installs and you should have a working version of the site.

Make an [issue](https://github.com/alexwohlbruck/jukebox/issues) if you have problems with anything.


This is a README.md file made by LaganYT for the self hosting of the Jukebox project.

## Authors

- [@LaganYT](https://www.github.com/laganyt)
- [@alexwohlbruck](https://www.github.com/alexwohlbruck)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Used By

This project is used by/maintained the following companies:

- [LTunes](https://ltunes.gq/)
