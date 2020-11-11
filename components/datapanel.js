class DataPanel extends LyricsElement {

    update() {
        var sr = this.shadowRoot;
        this.lyricsdata[this.index-1].analysis.personality.forEach(function (datapoint) {
            var point = sr.getElementById(datapoint.name);
            var value = Math.round(datapoint.percentile * 100);
            point.setAttribute('value', value);
        })
    }
}

try {
    customElements.define('datapanel-element', DataPanel);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}