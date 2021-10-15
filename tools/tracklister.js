var lineReader = require('line-reader');
var fs = require('fs');

const { resolve } = require('path');

var newTimeLine = [];

var music = require('musicmatch')({ apikey: "f60b2304a36e48405d63786419aed830" });

var albumIds = new Map();

function findAlbumId(artist, artistId, title) {
    console.log("Finding '" + title + "' by " + artist)
    return new Promise((resolve, reject) => {

        music.artistAlbums({ artist_id: artistId, page_size: 100 })
            .then(function (data) {

                var albums = data.message.body.album_list;

                var found = null;

                albums.forEach(function (item) {
                    var name = item.album.album_name;
                    if (name == title) {
                        found = { "title": item.album.album_name, "id": item.album.album_id }
                        console.log("Matched '" + title + "' by " + artist)
                    }
                })

                if (found != null) {
                    albumIds.set(found.title, found.id);
                    resolve(found);
                } else {
                    reject;
                }

            }).catch(function (err) {
                console.log(err);
            })
    })
}

var albumData = [];

function getTracksForAlbums() {
    return new Promise((resolve, reject) => {

        var count = 0;

        for (const [key, value] of albumIds.entries()) {

            music.albumTracks({ album_id: value, page: 1, page_size: 100 })
                .then(function (data) {
                    count++;
                    var record = { 'title': key, 'id': value, 'tracks': [] }
                    var list = data.message.body.track_list;

                    for (var i = 0; i < list.length; i++) {
                        record.tracks.push(list[i].track.track_name)
                        albumData[key] = record;
                    }

                    if (count == albumIds.size) {
                        resolve(albumData)
                    }

                }).catch(function (err) {
                    console.log(err);
                })
        }
    })
}

function findAlbumIds(artist, artistId) {
    return new Promise((resolve, reject) => {

        console.log('Searching for the album ids of ' + artist);

        var count = 0;

        var titles = [];

        for (era of timeline) {
            var albums = era.albums;
            for (album of albums) {
                titles.push(album.title);
            }
        }

        var count = 0;

        Promise.all(
            titles.map(title => findAlbumId(artist, artistId, title).then(function (response) {
                // albumIds.set(response.title, response.id);
                count++;

                if (count == titles.length) {
                    resolve(albumIds);
                }
            }))
        );
    })
}

function scanCandidates(artist, result) {
    return new Promise((resolve, reject) => {

        var id = null;

        console.log('Searching for the artist id of ' + artist)

        var list = result.message.body.artist_list;

        list.forEach(function (candidate) {
            if (candidate.artist.artist_name == artist) {
                id = candidate.artist.artist_id;
            }
        })

        if (id != null) {
            console.log('Found artist id of ' + artist + ': ' + id)
            resolve(id);
        } else {
            reject('no artist match')
        }
    })
}

function updateTimelineWithLyrics(data){

    // for(var i=0;i<timeline.length;i++){

    //     timeline[i].albums

    // }

    for (era of timeline) {
        var albums = era.albums;
        for (album of era.albums) {
           album.songs = [];
           album.songs = data[album.title].tracks;
        }
    }

    console.log(timeline);

    var path = "./data/lyrics/anton.json";

    fs.writeFile(path, JSON.stringify(timeline), function (err) {
        if (err) {
            return console.log(err);
        }
    })
}

var artist = 'The Beatles';
var timeline = require('./data/timeline.json');
const { time } = require('console');

music.artistSearch({ q_artist: artist, page_size: 1000 })
    .then(result => scanCandidates(artist, result)
        .then(artistId => findAlbumIds(artist, artistId))
        .then(albumIds => getTracksForAlbums(albumIds))
        .then(function(data){
            console.log(data);
            updateTimelineWithLyrics(data);
        })
    ).catch(function (err) {
        console.log(err);
    })
