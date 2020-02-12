const { clientID, clientSecret, port } = require('./config');
const express = require('express');
const request = require('request');
const rp = require('request-promise');
const cors = require('corse');
const bodyParser = require('body-parser');
const routes = express.Router();
const PORT = 4000;
const port = port || PORT;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/users', routes);

var token;

const clientID = clientID;
const clientSecret = clientSecret;

var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + Buffer.from(clientID+':'+clientSecret).toString('base64')
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      token = body.access_token;
      }
    else
      console.log(error);
});

/**
 * Get playlist IDs of the user denoted by paramater.
 * 
 * Goes through public playlists only. If a user has more than 50 playlists, then the 
 * function will make another request to retrieve the other ids.
 * 
 * @param {String} id User id that is inputted into the url for the API call.
 * 
 * @return {Array} Returns an array of playlists id.
 */
async function getPlaylists(id) {
    // Set up the options for the initial API call
    let options = {
      url: `https://api.spotify.com/v1/users/${id}/playlists`,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true,
      qs: {
        'limit': '20',
      }
    };
  
    try {
      let response = await rp.get(options);
    
      let playlists = new Map();
      response.items.forEach(item => {
        playlists.set(item.id, new Playlist(item.name, item.external_urls.spotify,item.tracks.href,item.owner.id));
      });
      while(response.next) {
        options.url = response.next; // We need to change the url end point to have the proper offset
        response = await rp.get(options);
        // Merge the arrays
        response.items.forEach(item => {
          playlists.set(item.id, new Playlist(item.name, item.external_urls.spotify,item.tracks.href,item.owner.id));
        });
      }
      return playlists;
    }
    catch (error) {
      console.log(error);
    }
  }

routes.route('/:id').get(async(req, res) => {
    try {
        const playlists = await getPlaylists(req.params.id);
    }
    catch (error) {
        console.log(error);
    }
});


app.listen(port, () => {console.log(`App is listening on port ${port}`);});
