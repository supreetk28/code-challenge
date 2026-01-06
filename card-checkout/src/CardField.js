export class CardField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._label = this.getAttribute('label') || '';
    this._placeholder = this.getAttribute('placeholder') || '';
    this._inputId = this.getAttribute('input-id') || '';
  }

  static get observedAttributes() {
    return ['label', 'placeholder', 'input-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!newValue) return;
    if (name === 'label') this._label = newValue;
    if (name === 'placeholder') this._placeholder = newValue;
    if (name === 'input-id') this._inputId = newValue;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --input-padding: 8px;
          --input-border: 1px solid #ccc;
          --input-border-radius: 4px;
          --error-color: #b91c1c; /* WCAG AA compliant red */
          --font-family: inherit;
          display: block;
        }

        label {
          display: block;
          margin-bottom: 4px;
          font-family: var(--font-family);
        }

        input {
          width: 100%;
          padding: var(--input-padding);
          border: var(--input-border);
          border-radius: var(--input-border-radius);
          box-sizing: border-box;
        }

        input.invalid {
          border-color: var(--error-color);
        }

        .error {
          color: var(--error-color);
          font-size: 12px;
          min-height: 14px;
        }
      </style>

      <label for="${this._inputId}">
        ${this._label}
      </label>

      <input
        id="${this._inputId}"
        placeholder="${this._placeholder}"
        required
        aria-required="true"
        aria-describedby="${this._inputId}Error"
      />

      <span
        class="error"
        id="${this._inputId}Error"
        role="alert"
        aria-live="assertive">
      </span>
    `;
  }
}

customElements.define('card-field', CardField);
