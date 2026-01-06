import { validateCardNumber, validateCardExpiry, validateCVC, validatePostal } from './validators.js';
import { createSecureToken } from './tokenService.js';
import './CardField.js'; 


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

  this.paymentHandler = null;

  }

  connectedCallback() {
    this.render();
    this.attachEvents();
  }

 setPaymentHandler(fn) {
  if (typeof fn === 'function') {
    this.paymentHandler = fn;
  }
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
        <card-field
          label="${this.labels.card}"
          placeholder="${this.placeholders.card}"
          input-id="cardNumber">
        </card-field>

        <card-field
          label="${this.labels.expiry}"
          placeholder="${this.placeholders.expiry}"
          input-id="expiry">
        </card-field>

        <card-field
          label="${this.labels.cvc}"
          placeholder="${this.placeholders.cvc}"
          input-id="cvc">
        </card-field>

        <card-field
          label="${this.labels.postal}"
          placeholder="${this.placeholders.postal}"
          input-id="postal">
        </card-field>

        <button type="submit" disabled>${this.buttonText}</button>
      </form>
    `;
  }

styles() {
  return `
    :host {
      --primary-color: #22c55e;       /* Button background */
      --font-family: 'Inter', sans-serif;
      --input-border: 1px solid #ccc;
      --input-padding: 8px;
      --input-border-radius: 4px;
      --button-radius: 4px;
      --button-color: #fff;           /* Button text color */
      --error-color: var(--error-color);
      
      display: block;
      max-width: 400px;
      font-family: var(--font-family);
    }

    label {
      display: block;
      margin-bottom: 12px;
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
    }

    button {
      margin-top: 12px;
      width: 100%;
      padding: 10px;
      background: var(--primary-color);
      color: var(--button-color);
      border: none;
      border-radius: var(--button-radius);
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
}



attachEvents() {
  // Get all card-field elements
  const fields = this.shadowRoot.querySelectorAll('card-field');

  // Map inputs and errors from each card-field's shadow DOM
  const inputs = {
    card: fields[0].shadowRoot.querySelector('input'),
    expiry: fields[1].shadowRoot.querySelector('input'),
    cvc: fields[2].shadowRoot.querySelector('input'),
    postal: fields[3].shadowRoot.querySelector('input')
  };

  console.log('inputs', inputs);
  const errors = {
    card: fields[0].shadowRoot.querySelector('span.error'),
    expiry: fields[1].shadowRoot.querySelector('span.error'),
    cvc: fields[2].shadowRoot.querySelector('span.error'),
    postal: fields[3].shadowRoot.querySelector('span.error')
  };

  const submitBtn = this.shadowRoot.querySelector('button[type="submit"]');

  // Validation function
  const checkValidity = () => {
    let valid = true;

    // Card Number
    if (!validateCardNumber(inputs.card.value)) {
      valid = false;
      errors.card.textContent = 'Invalid card number';
      inputs.card.classList.add('invalid');
      inputs.card.setAttribute('aria-invalid', 'true');
    } else {
      errors.card.textContent = '';
      inputs.card.classList.remove('invalid');
      inputs.card.setAttribute('aria-invalid', 'false');
    }

    // Expiry
    if (!validateCardExpiry(inputs.expiry.value)) {
      valid = false;
      errors.expiry.textContent = 'Invalid expiry';
      inputs.expiry.classList.add('invalid');
      inputs.expiry.setAttribute('aria-invalid', 'true');
    } else {
      errors.expiry.textContent = '';
      inputs.expiry.classList.remove('invalid');
      inputs.expiry.setAttribute('aria-invalid', 'false');
    }

    // CVC
    if (!validateCVC(inputs.cvc.value)) {
      valid = false;
      errors.cvc.textContent = 'Invalid CVC';
      inputs.cvc.classList.add('invalid');
      inputs.cvc.setAttribute('aria-invalid', 'true');
    } else {
      errors.cvc.textContent = '';
      inputs.cvc.classList.remove('invalid');
      inputs.cvc.setAttribute('aria-invalid', 'false');
    }

    // Postal Code
    if (!validatePostal(inputs.postal.value)) {
      valid = false;
      errors.postal.textContent = 'Invalid postal code';
      inputs.postal.classList.add('invalid');
      inputs.postal.setAttribute('aria-invalid', 'true');
    } else {
      errors.postal.textContent = '';
      inputs.postal.classList.remove('invalid');
      inputs.postal.setAttribute('aria-invalid', 'false');
    }

    submitBtn.disabled = !valid;

    // Emit validationChange event for host apps
    this.dispatchEvent(new CustomEvent('validationChange', {
      detail: { isValid: valid },
      bubbles: true
    }));

    return valid;
  };

  // Attach real-time input validation
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', checkValidity);
  });

  // Handle form submission
  const form = this.shadowRoot.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!checkValidity()) return;

    // Generate token (dummy)
    const token = await createSecureToken({
      cardNumber: inputs.card.value,
      expiry: inputs.expiry.value,
      cvc: inputs.cvc.value,
      postal: inputs.postal.value
    });

    // Emit tokenReady event
    this.dispatchEvent(new CustomEvent('tokenReady', { detail: token, bubbles: true }));

    // Call dummy payment API
    const result = await fakePaymentAPI(token);
    alert(`Payment status: ${result.status}`);
  });
}
}

customElements.define('card-checkout-element', CardCheckoutElement);