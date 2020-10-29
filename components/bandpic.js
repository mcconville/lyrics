class Bandpic extends HTMLElement {

    static get observedAttributes() {
        return ['bandpics', 'labels', '', ''];
    }

    constructor() {
        super();

        // let template = document.getElementById('bandpic');
        let templateContent = '<div></div>';

        const shadow = this.attachShadow({
            mode: 'open'
        })
        // .appendChild(templateContent.cloneNode(true));
    }

    async connectedCallback() {

        // let res = await fetch( 'https://mcconville.github.io/lyrics/components/bandpic.html' )
        let res = await fetch('./components/bandpic.html')

        var sr = this.shadowRoot;

        sr.innerHTML = await res.text()

        console.log(this.shadowRoot.innerHTML);

        var anchor = sr.getElementById('siema');

        this.siema = new Siema({
            selector: anchor,
            loop: true
        });

        // Siema.prototype.addPagination = function () {
        //     for (let i = 0; i < this.innerElements.length; i++) {
        //         const btn = document.createElement('button');
        //         btn.textContent = i;
        //         btn.addEventListener('click', () => this.goTo(i));
        //         this.selector.appendChild(btn);
        //     }
        // }

        // this.siema.addPagination();

        console.log('ADDING BANDPIC');
    }

    reselect() {
        console.log(this);
        console.log('reselect: ' + this.currentSlide);

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
        console.log('IMAGES CHANGED');

        if (name == 'bandpics') {

            var sr = this.shadowRoot;
            var anchor = sr.getElementById('siema');
            anchor.innerHTML = "";

            var picarray = newValue.split(",");

            var component = this;

            picarray.forEach(function (item) {
                var d = document.createElement('div');
                var i = document.createElement('img');
                i.src = item;
                d.appendChild(i);
                anchor.appendChild(d);
            })

            this.siema = new Siema({
                selector: anchor,
                loop: true,
                startIndex: 0,
                onChange: this.reselect
            });

            Siema.prototype.addPagination = function () {
                for (let i = 0; i < this.innerElements.length; i++) {
                    const btn = document.createElement('button');
                    btn.textContent = i;
                    btn.addEventListener('click', () => this.goTo(i));
                    this.selector.appendChild(btn);
                }
            }

            this.siema.addPagination();
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