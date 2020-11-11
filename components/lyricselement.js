class LyricsElement extends HTMLElement {
    static get observedAttributes() {
        return ['dom','url'];
    }

    constructor() {
        super();
        let templateContent = '<div></div>';
        this.datapath = "";
        this.dompath = "";
        this.index = 1;
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch(this.dompath)
        this.shadowRoot.innerHTML = await res.text()
        this.readLyricsData();
        document.addEventListener('ERACHANGE', e => {
            this.index = e.detail.eventData.era + 1;
            this.update();
        })
    }

    update() {
    }

    async readLyricsData() {
        let analysis = await fetch(this.datapath);
        this.lyricsdata = await analysis.text();
        this.lyricsdata = JSON.parse(this.lyricsdata);
        this.update();
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (name == "url") {
            this.datapath = newValue;
        }

        if (name == "dom") {
            this.dompath = newValue;
        }
    }
}