const express = require(`express`);
const SpotifyWebAPI = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    console.log("Test!")
    const client_id = "a846973a55a04786886e44060900d84b";   
    const redirect_uri = "http://localhost:3000"
    const client_secret = "fcba9fbe8e4a420a9a7a40434a0e7299";
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