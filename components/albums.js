class Albums extends LyricsElement {

    update() {
        console.log('NEW UPDATE ALBUMS');

        var sr = this.shadowRoot;

        var tracklist = sr.getElementById('tracklist');
        tracklist.innerHTML = "";

        this.lyricsdata[this.index-1].albums.forEach(function (album) {

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
}


try {
    customElements.define('albums-element', Albums);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}