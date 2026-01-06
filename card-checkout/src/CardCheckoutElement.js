import { validateCardNumber, validateCardExpiry, validateCVC, validatePostal } from './validators.js';
import { createSecureToken } from './tokenService.js';


class CardCheckoutElement extends HTMLElement {

  static get observedAttributes() {
    return ['label-card', 'label-expiry', 'label-cvc', 'label-postal', 'placeholder-card', 'placeholder-expiry', 'placeholder-cvc', 'placeholder-postal',
    'button-text'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Default labels
  this.labels = {
    card: 'Card Number',
    expiry: 'Expiry (MM/YY)',
    cvc: 'CVC',
    postal: 'Postal Code'
  };

   this.placeholders = {
    card: 'XXXX-XXXX-XXXX-XXXX',
    expiry: 'MM/YY',
    cvc: '123',
    postal: '12345'
  };

  this.buttonText = 'Pay';

  }

  connectedCallback() {
    this.render();
    this.attachEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
  if (!newValue) return;

  switch (name) {
    case 'label-card':
      this.labels.card = newValue;
      break;
    case 'label-expiry':
      this.labels.expiry = newValue;
      break;
    case 'label-cvc':
      this.labels.cvc = newValue;
      break;
    case 'label-postal':
      this.labels.postal = newValue;
      break;
    case 'placeholder-card': 
      this.placeholders.card = newValue; 
      break;
    case 'placeholder-expiry': 
      this.placeholders.expiry = newValue; 
      break;
    case 'placeholder-cvc': 
      this.placeholders.cvc = newValue; 
      break;
    case 'placeholder-postal': 
      this.placeholders.postal = newValue; 
      break;
    case 'button-text': 
      this.buttonText = newValue; 
      break;    
  }

  // Re-render to update labels
  this.render();
}


  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <form novalidate>
        <label>
          ${this.labels.card}
          <input id="cardNumber" placeholder="${this.placeholders.card}" autocomplete="cc-number" />
          <span class="error" id="cardNumberError"></span>
        </label>

        <label>
          ${this.labels.expiry}
          <input id="expiry" placeholder="${this.placeholders.expiry}" autocomplete="cc-exp" />
          <span class="error" id="expiryError"></span>
        </label>

        <label>
          ${this.labels.cvc}
          <input id="cvc" placeholder="${this.placeholders.cvc}" autocomplete="cc-csc" />
          <span class="error" id="cvcError"></span>
        </label>

        <label>
           ${this.labels.postal}
          <input id="postal" placeholder="${this.placeholders.postal}" autocomplete="postal-code" />
          <span class="error" id="postalError"></span>
        </label>

        <button type="submit" disabled>${this.buttonText}</button>
      </form>
    `;
  }

  styles() {
    return `
      :host { --primary-color: #22c55e; font-family: 'Inter', sans-serif; display: block; max-width: 400px; }
      label { display: block; margin-bottom: 12px; }
      input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
      input.invalid { border-color: red; }
      .error { color: red; font-size: 12px; }
      button { margin-top: 12px; width: 100%; padding: 10px; background: var(--primary-color); color: #fff; border: none; border-radius: 4px; cursor: pointer; }
      button:disabled { opacity: 0.5; cursor: not-allowed; }
    `;
  }


attachEvents() {
  const form = this.shadowRoot.querySelector('form');
  const inputs = {
    card: this.shadowRoot.querySelector('#cardNumber'),
    expiry: this.shadowRoot.querySelector('#expiry'),
    cvc: this.shadowRoot.querySelector('#cvc'),
    postal: this.shadowRoot.querySelector('#postal')
  };
  const errors = {
    card: this.shadowRoot.querySelector('#cardNumberError'),
    expiry: this.shadowRoot.querySelector('#expiryError'),
    cvc: this.shadowRoot.querySelector('#cvcError'),
    postal: this.shadowRoot.querySelector('#postalError')
  };
  const submitBtn = this.shadowRoot.querySelector('button');

  const checkValidity = () => {
    let valid = true;

    if (!validateCardNumber(inputs.card.value)) { valid = false; errors.card.textContent = 'Invalid card number'; inputs.card.classList.add('invalid'); } 
    else { errors.card.textContent = ''; inputs.card.classList.remove('invalid'); }

    if (!validateCardExpiry(inputs.expiry.value)) { valid = false; errors.expiry.textContent = 'Invalid expiry'; inputs.expiry.classList.add('invalid'); } 
    else { errors.expiry.textContent = ''; inputs.expiry.classList.remove('invalid'); }

    if (!validateCVC(inputs.cvc.value)) { valid = false; errors.cvc.textContent = 'Invalid CVC'; inputs.cvc.classList.add('invalid'); } 
    else { errors.cvc.textContent = ''; inputs.cvc.classList.remove('invalid'); }

    if (!validatePostal(inputs.postal.value)) { valid = false; errors.postal.textContent = 'Invalid postal code'; inputs.postal.classList.add('invalid'); } 
    else { errors.postal.textContent = ''; inputs.postal.classList.remove('invalid'); }

    submitBtn.disabled = !valid;
    return valid;
  };

  Object.values(inputs).forEach(input => input.addEventListener('input', checkValidity));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!checkValidity()) return;

    const token = createSecureToken({
      number: inputs.card.value,
      expiry: inputs.expiry.value,
      cvc: inputs.cvc.value,
      postal: inputs.postal.value
    });

    this.dispatchEvent(new CustomEvent('tokenReady', { detail: token, bubbles: true }));
  });
}
}

customElements.define('card-checkout-element', CardCheckoutElement);