class Banner extends HTMLElement {
    static get observedAttributes() {
        return ['trait', 'value', '', ''];
    }

    constructor() {
        super();

        let templateContent = '<div></div>';
        this.dompath = './components/banner.html';
        const shadow = this.attachShadow({
                mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch(this.dompath)
        this.shadowRoot.innerHTML = await res.text()
    }
}

try {
    customElements.define('banner-element', Banner);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}