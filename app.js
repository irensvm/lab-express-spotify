require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get('/', (req, res) => {
    res.render("index", {
        data: "ready"
    })
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artistName)
        .then(data => {
            console.log('data from api: ', data.body.artists.items)
            res.render('artist-search-results', {
                artists: data.body.artists.items
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    console.log('data', req.query)

})


app.get('/albums', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.query.albumName)
        .then(data => {
            console.log('data from api: ', data.body.albums.items)
            res.render('albums', {
                albums: data.body.albums.items
            })
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
    console.log('data', req.query)


});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));