var timelinedata;
var lyricsdata;

var beatles = new Array();

function initialize() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            timelinedata = JSON.parse(xhttp.response);

            timelinedata.forEach(function (item) {
                beatles[item.order] = item;
            })

            document.addEventListener('ERACHANGE', e => {
                console.log(e.detail.eventData.era);
                var index = e.detail.eventData.era;
                // updateAlbums(index + 1);
            })

            // updateAlbums(1);
        }

    };
    xhttp.open("GET", "./data/mac.json", true);
    xhttp.send();
}

function updateAlbums(index) {
    console.log('UPDATE ALBUMS');

    console.log(beatles[index].albums);

    var tracklist = document.getElementById('tracklist');
    tracklist.innerHTML = "";

    beatles[index].albums.forEach(function (album) {

        var section = document.createElement("section");
        section.className = "album";

        var sleeve = document.createElement("div");
        sleeve.className = "sleeve";

        var cover = document.createElement("img");
        cover.className = "albumcover";
        cover.src = album.cover;

        console.log(cover.src);
        sleeve.appendChild(cover);

        var title = document.createElement("label");
        title.className = "albumtitle";
        title.innerHTML = album.title;

        var tracks = document.createElement("ul");
        tracks.className = "tracks";

        album.songs.forEach(function (track) {
            var song = document.createElement("li");
            song.className = "track";
            song.innerHTML = track;
            tracks.appendChild(song);
        });

        section.appendChild(sleeve);
        section.appendChild(title);
        console.log("ADDING ALBUM INFO FOR: " + album.title);
        section.appendChild(tracks);

        tracklist.appendChild(section);
    })
}