var fs = require('fs');
var gl = require('genius-lyrics-api');

var options = {
    apiKey: 'wgHONmgLgldAS-D9ln4lgQKCqLBP5rkrJ9fT4v3lQ6JiiTs-_sefWtIwCrGXXWmw',
    title: 'English Lane',
    artist: 'Mac Miller',
    optimizeQuery: true
};

function buildLyrics(songtitle, songdata, albumlyrics, albumdata ) {

    albumlyrics = albumlyrics + "\n\n\n" + songtitle + "\n\n" + songdata.lyrics;

    // console.log(albumdata.title);
    // console.log(songdata.albumArt);

    var path = "./data/lyrics/" + albumdata.filename;

    fs.writeFile(path, albumlyrics, function (err) {
        if (err) {
            return console.log(err);
        }
    })

    return albumlyrics;
}

var timeline = require('./data/timeline.json');

timeline.forEach(function (era) {

    console.log(era.era);

    era.albums.forEach(function (album) {

        var eralyrics = "";

        var albumdata = album;

        var songcount = album.songs.length;

        album.songs.forEach(function (song) {
           
            options.title = song;

            gl.getSong(options).then((songdata) =>
                eralyrics = buildLyrics(song, songdata, eralyrics, albumdata)
            ).catch(err => alert(err));
        })
    })
});


// gl.getLyrics(options).then((lyrics) => console.log(lyrics));

// gl.getSong(options).then((song) =>
//     console.log(`
//     ${song.id}
//     ${song.url}
//     ${song.albumArt}
//     ${song.lyrics}`)
// );

console.log('ran genius');