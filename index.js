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



routes.route('/:id').get(async(req, res) => {
    try {
        const playlists = await getPlaylists(req.params.id);
    }
    catch (error) {
        console.log(error);
    }
});


app.listen(port, () => {console.log(`App is listening on port ${port}`);});
