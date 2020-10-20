// import { getLyrics } from 'genius-lyrics-api';

var gl = require('genius-lyrics-api');

const options = {
    apiKey: 'wgHONmgLgldAS-D9ln4lgQKCqLBP5rkrJ9fT4v3lQ6JiiTs-_sefWtIwCrGXXWmw',
    title: 'English Lane',
    artist: 'Mac Miller',
    optimizeQuery: true
};
 
// gl.getLyrics(options).then((lyrics) => console.log(lyrics));
 
gl.getSong(options).then((song) =>
    console.log(`
    ${song.id}
    ${song.url}
    ${song.albumArt}
    ${song.lyrics}`)
);

console.log('ran genius');
