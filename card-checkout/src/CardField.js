export class CardField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Defaults
    this._label = this.getAttribute('label') || '';
    this._placeholder = this.getAttribute('placeholder') || '';
    this._inputId = this.getAttribute('input-id') || '';
  }

  static get observedAttributes() {
    return ['label', 'placeholder', 'input-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!newValue) return;
    switch (name) {
      case 'label': this._label = newValue; break;
      case 'placeholder': this._placeholder = newValue; break;
      case 'input-id': this._inputId = newValue; break;
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        label { display: block; margin-bottom: 12px; font-family: inherit; }
        input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        input.invalid { border-color: red; }
        .error { color: red; font-size: 12px; }
      </style>
      <label>
        ${this._label}
        <input id="${this._inputId}" placeholder="${this._placeholder}" />
        <span class="error" id="${this._inputId}Error"></span>
      </label>
    `;
  }
}

customElements.define('card-field', CardField);