const { clientID, clientSecret, port } = require('./config');
const Track = require('./objects/track.js');
const Playlist = require('./objects/playlist.js');
const express = require('express');
const request = require('request');
const rp = require('request-promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = express.Router();


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/users', routes);

var token;

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

const trackLoop = async (response, tracks)=> {
    for(let trackIndex = 0; trackIndex < response.items.length; trackIndex++) {
      let artists = new Map();
      let item = response.items[trackIndex];
      for (let trackArtistIndex = 0; trackArtistIndex < item.track.artists.length; trackArtistIndex++) {
        let artist = item.track.artists[trackArtistIndex];
        artists.set(artist.id, artist.name);
      }
      let artistIDs = artists.keys();
      let artistString = '';
      for(let artistID of artistIDs) {
        artistString += artistID;
        artistString += ','
      }
      artistString = artistString.slice(0, -1);
      let genres;
      try {
        genres = await getArtistsGenres(artistString);
        let track = new Track(item.track.name, artists, {'id': item.track.album.id, 'name':item.track.album.name}, genres);
        tracks.set(item.track.id, track);
        console.log(tracks);
      }
      catch (error) {
        console.log(error);
      }
    }
}

async function getPlaylistTracks(id) {
    let options = {
      url: `https://api.spotify.com/v1/playlists/${id}/tracks`,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true,
      qs: {
        'limit': '2'
      }
    };
  
    try {
      let response = await rp.get(options);
      let tracks = new Map();
      trackLoop(response,tracks);
      while(response.next) {
        options.url = response.next;
        response = await rp.get(options);
        trackLoop(response,tracks);
  
      }
      return tracks;
    }
    catch (error) {
      console.log(error);
    }
}

async function getArtistsGenres(artistString) {
    const options = {
      url: `https://api.spotify.com/v1/artists`,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true,
      qs: {
        'ids': artistString
      }
    };
  
    try {
      const response = await rp.get(options);
      let genres = new Set();
      response.artists.forEach(artist => {
        artist.genres.forEach(genre => {
          genres.add(genre);
        });
      });
      return genres;
    }
    catch (error) {
      console.log(error);
    }
}

routes.route('/:id').get(async(req, res) => {
    try {
        const playlists = await getPlaylists(req.params.id);

        const playlistTracks = await getPlaylistTracks(playlists.keys().next().value);
        console.log(playlistTracks);
    }
    catch (error) {
        console.log(error);
    }
});


app.listen(port || 4000, () => {console.log(`App is listening on port ${port|| 4000}`);});
