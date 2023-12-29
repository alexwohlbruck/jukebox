const express = require("express");
const router = express.Router();
const Spotify = require.main.require("./app/services/spotify");

router.get("/:artistId", (req, res) => {
  Spotify.getArtist(req.params.artistId)
    .then((data) => {
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
    .link {
  text-decoration: underline;
  cursor: pointer;
}

.link:hover {
  text-decoration: none;
}
#popupContainer {
  display: none;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
}

#popupContent {
  color: white;
  font-size: 16px;
  display: none;
}

.popupVisible {
  opacity: 1;
  pointer-events: auto;
}

.popupHidden {
  opacity: 0;
  pointer-events: none;
}




                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>${data.body.name}</h1>
                            <img src="${
                              data.body.images[0].url
                            }" alt="Artist Image">
                            <ul>
                                <li><strong>Followers:</strong> ${
                                  data.body.followers.total
                                }</li>
                                <li><strong>Genres:</strong> ${data.body.genres.join(
                                  ", "
                                )}</li>
                                <li><strong><a href="${
                                  data.body.external_urls.spotify
                                }" target="_blank">Spotify Profile</a></strong></li>
                                <li><strong><a class="link" id="shareButton">Share</a></strong></li>
                                <br><br>
                                <li><strong><a href="#" onclick="window.history.back();">Go back</a></strong></li>
                            </ul>
                        </div>
                        <!-- Popup container -->
<div id="popupContainer">
  <div id="popupContent">
    <span id="popupText"></span>
  </div>
</div>
                        <script>
// Add an event listener to the share button
document.getElementById('shareButton').addEventListener('click', function() {
  // Get the current URL
  var currentUrl = window.location.href;

  // Create a temporary input element
  var tempInput = document.createElement('input');
  tempInput.setAttribute('type', 'text');
  tempInput.setAttribute('value', currentUrl);

  // Append the temporary input element to the document
  document.body.appendChild(tempInput);

  // Select the value of the temporary input element
  tempInput.select();

  // Copy the selected value to the clipboard
  document.execCommand('copy');

  // Remove the temporary input element from the document
  document.body.removeChild(tempInput);

  // Show the popup with the copied text
  var popupContainer = document.getElementById('popupContainer');
  var popupContent = document.getElementById('popupContent');
  popupContent.textContent = 'Copied';
  popupContainer.classList.add('popupVisible');
  popupContent.style.display = 'block';

  // Hide the popup after 2 seconds
  setTimeout(function() {
    popupContainer.classList.remove('popupVisible');
    popupContainer.classList.add('popupHidden');
    popupContent.style.display = 'none';
    setTimeout(function() {
      popupContainer.classList.remove('popupHidden');
    }, 300);
  }, 2000);
});

</script>
                    </body>
                </html>
            `;
      res.send(html);
    })
    .catch((err) => {
      res.status(err.statusCode).json(err);
    });
});

module.exports = router;
