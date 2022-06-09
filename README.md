# Setup process:

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

Make an [issue](https://github.com/alexwohlbruck/jukebox/issues) if you have problems with anything.


This is a README.md file made by LaganYT for the self hosting of the Jukebox Redux project.
