class DataPanel extends HTMLElement {

    static get observedAttributes() {
        return ['url'];
    }

    constructor() {
        super();
        let templateContent = '<div></div>';
        this.datapath = "";
        this.index = 1;
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/datapanel.html')
        // let res = await fetch( 'https://mcconville.github.io/lyrics/components/datablock.html' )
        this.shadowRoot.innerHTML = await res.text()
        this.readLyricsData();
        console.log('ADDING DATAPANEL : ');
        document.addEventListener('ERACHANGE', e => {
            this.index = e.detail.eventData.era + 1;
            this.updateBars();
        })
    }

    updateBars() {
        var sr = this.shadowRoot;
        this.lyricsdata[this.index-1].analysis.personality.forEach(function (datapoint) {
            var point = sr.getElementById(datapoint.name);
            var value = Math.round(datapoint.percentile * 100);
            point.setAttribute('value', value);
        })
    }

    async readLyricsData() {
        let analysis = await fetch(this.datapath);
        this.lyricsdata = await analysis.text();
        this.lyricsdata = JSON.parse(this.lyricsdata);
        this.updateBars();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "url") {
            console.log(newValue);
            this.datapath = newValue;
        }
    }
}

try {
    customElements.define('datapanel-element', DataPanel);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}