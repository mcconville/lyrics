class Blurb extends LyricsElement {

    update() {
        var sr = this.shadowRoot;
        var item =this.lyricsdata[this.index-1];
        var string = item.era + ' : ' + item.start + ' - ' + item.end;
    
        var moodlabel = sr.getElementById('moodlabel');
        moodlabel.innerHTML = item.mood;
    
        var blurb = sr.getElementById('blurb');
        blurb.innerHTML = "";
    
        item.albums.forEach(function (album) {
            album.background.forEach(function (info) {
                var paragraph = document.createElement('div');
                paragraph.className = 'snippet';
                paragraph.innerHTML = info;
                blurb.appendChild(paragraph);
            })
        })
    
        var container = sr.getElementById('blurb');
        container.className = 'blurb';
        container.className = container.className + ' ' + item.className;
    }
}

try {
    customElements.define('blurb-element', Blurb);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}