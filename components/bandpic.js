class Bandpic extends HTMLElement {

    static get observedAttributes() {
        return ['url'];
    }

    constructor() {
        super();
        // let template = document.getElementById('bandpic');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })

    }

    async connectedCallback() {
        let res = await fetch('https://mcconville.github.io/lyrics/components/bandpic.html')
        // let res = await fetch('./components/bandpic.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        this.readLyricsData();
    }

    async readLyricsData() {
        let analysis = await fetch(this.datapath);
        this.lyricsdata = await analysis.text();
        console.log('ADDING BANDPIC');

        var picset = [];
        var labels = [];

        var sr = this.shadowRoot;
        var anchor = sr.getElementById('siema');
        var buttons = sr.getElementById('buttons');

        timelinedata = JSON.parse(this.lyricsdata);

        timelinedata.forEach(function (item) {
            picset.push('./images/SVG/' + item.image);
            var string = item.era + ' : ' + item.start + ' - ' + item.end;
            labels.push(string);
            var d = document.createElement('div');
            var i = document.createElement('img');
            i.src = './images/SVG/' + item.image;
            d.appendChild(i);
            anchor.appendChild(d);
        })

        this.siema = new Siema({
            selector: anchor,
            loop: true,
            startIndex: 0,
            onChange: this.reselect
        });

        Siema.prototype.component = this;

        Siema.prototype.addPagination = function () {
            for (let i = 0; i < this.innerElements.length; i++) {
                const btn = document.createElement('button');
                // btn.textContent = i;
                btn.addEventListener('click', () => this.goTo(i));
                if (i == 0) {
                    btn.className = "selectedDot";
                } else {
                    btn.className = "dot";
                }
                btn.id = "button" + i;
                buttons.appendChild(btn);
            }
        }

        this.siema.addPagination();
    }

    reselect() {
        var sr = this.component.shadowRoot;
        var eralabel = sr.getElementById('eralabel');
        eralabel.innerHTML = this.component.labels[this.currentSlide];

        var buttons = sr.getElementById('buttons');

        var selectedSlide = this.currentSlide;

        buttons.childNodes.forEach(function (node) {
            if (node.id == 'button' + selectedSlide) {
                node.className = 'selectedDot';
            } else {
                node.className = 'dot';
            }
        })

        var customEvent = new CustomEvent('ERACHANGE', {
            detail: {
                eventData: {
                    "era": this.currentSlide
                }
            },
            bubbles: true
        });
        document.dispatchEvent(customEvent);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if( name=="url" ){
            console.log( newValue );
            this.datapath = newValue;
        }
    }
}

try {
    customElements.define('bandpic-element', Bandpic);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}