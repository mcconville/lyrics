var timelinedata;
var lyricsdata;

var beatles = new Array();

function initialize() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var carousel = document.getElementById('bandpics');

            var picset = [];

            timelinedata = JSON.parse(xhttp.response);

            timelinedata.forEach(function (item) {
                beatles[item.order] = item;
                picset.push('./images/SVG/' + item.image);
            })

            carousel.setAttribute('bandpics', picset);

            document.addEventListener('ERACHANGE', e => {

                console.log(e.detail.eventData.era);
                var index = e.detail.eventData.era;

                updateBars(index + 1);
                updateAlbums(index + 1);
                updateBlurb(index + 1);

            })

            updateBlurb(1);
            updateBars(1);
            updateAlbums(1);
        }

    };
    xhttp.open("GET", "./data/mac.json", true);
    xhttp.send();
}

function updateBlurb(index) {

    var item = beatles[index];
    var string = item.era + ' : ' + item.start + ' - ' + item.end;
    // var eralabel = document.getElementById('eralabel');
    // eralabel.innerHTML = string;

    var moodlabel = document.getElementById('moodlabel');
    moodlabel.innerHTML = item.mood;

    var blurb = document.getElementById('blurb');
    blurb.innerHTML = "";

    item.albums.forEach(function (album) {
        album.background.forEach(function (info) {
            var paragraph = document.createElement('div');
            paragraph.className = 'snippet';
            paragraph.innerHTML = info;
            blurb.appendChild(paragraph);
        })
    })

    var container = document.getElementById('blurb');
    container.className = 'blurb';
    container.className = container.className + ' ' + item.className;

    console.log(string)
}

function updateBars(index) {

    console.log('UPDATE BARS');

    console.log(beatles[index].era);
    beatles[index].analysis.personality.forEach(function (datapoint) {
        var point = document.getElementById(datapoint.name);
        var value = Math.round(datapoint.percentile * 100);
        point.setAttribute('value', value);
    })
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


function updateClasses(instance) {
    var slide = instance.details().relativeSlide;
    var dots = document.querySelectorAll(".dot");
    dots.forEach(function (dot, idx) {
        idx === slide ?
            dot.classList.add("dot--active") :
            dot.classList.remove("dot--active");
    });
}