const express = require(`express`);
const SpotifyWebAPI = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require("body-parser");
const {client_id, redirect_uri, client_secret} = require("./tokens");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refresh_token;
    const SpotifyAPI = new SpotifyWebAPI({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uri,
        refreshToken
    });

    SpotifyAPI.refreshAccessToken().then(data => {
        res.json({
            access_token: data.body.access_token,
        })
    }).catch(err => {
        res.sendStatus(400);
    })
})

app.post('/login', (req, res) => {
    
    const code = req.body.code;
    const SpotifyAPI = new SpotifyWebAPI({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uri
    });

    SpotifyAPI.authorizationCodeGrant(code).then(data => {
        res.json({
            access_token: data.body.access_token,
            refresh_token: data.body.refresh_token,
            expires_in: data.body.expires_in
        })
    }
    ).catch(err => {
        res.sendStatus(400);
    });
});

app.listen(3001);