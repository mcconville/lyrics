class Artist extends HTMLElement {

    static get observedAttributes() {
        return ['trait', 'value', '', ''];
    }

    constructor() {
        super();

        let templateContent = '<div></div>';

        const shadow = this.attachShadow({
                mode: 'open'
        })
    }

    async connectedCallback(){
        let res = await fetch( 'https://mcconville.github.io/lyrics/components/artist.html' )
        this.shadowRoot.innerHTML = await res.text()

        var customElement = this;
        var sr = this.shadowRoot;
        console.log('ADDING ARTIST' );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('BIG FIVE ATTRIBUTE CHANGED');

        var sr = this.shadowRoot;

        if (name == 'value') {
            this.percentage = sr.getElementById('percentage');
            this.percentage.innerHTML = newValue + '%';

            this.score = sr.getElementById('score');
            this.score.style.width = newValue + '%';

            this.gap = sr.getElementById('gap');
            this.gap.style.width = (100-newValue) + '%';
        }        
    }
}

try {
    customElements.define('artist-element', Artist);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}