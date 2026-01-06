# Card Checkout Web Component

A reusable, accessible, and customizable **credit card checkout web component** built with **Vanilla JavaScript** and **Web Components (Custom Elements)**. Designed to handle secure card entry, validation, and tokenization, while being easily embeddable in any web project.

---

## Features

1. **Credit Card Form Fields**
   - Card Number, Expiry, CVC, and Postal Code
   - Real-time validation with visual feedback

2. **Accessibility (a11y)**
   - Fully keyboard navigable
   - Screen reader support via ARIA attributes
   - High contrast styling for better readability

3. **Customizable Styles**
   - Supports CSS variables for theming
   - Default styling included for quick integration

4. **Secure Tokenization**
   - Generates dummy secure tokens for testing
   - Supports host-provided payment API handlers
   - Emits events (`validationChange`, `tokenReady`) for programmatic access

5. **Error Handling**
   - Invalid inputs are highlighted immediately
   - Errors exposed both visually and via events for host apps

---

## Requirements

- Modern browser with support for **Web Components** and **ES6 modules**
- Optional host-provided payment API function

---

### Implementation Details

The Card Checkout Web Component is built using **Vanilla JavaScript** and **Web Components (Custom Elements)**. It is structured into multiple files for modularity and maintainability:

### Components

1. **CardCheckoutElement.js**
   - Main checkout component that renders the full form.
   - Manages the following:
     - Form rendering and re-rendering on attribute changes.
     - Real-time input validation for card number, expiry, CVC, and postal code.
     - Emits events for host applications:
       - `validationChange` → indicates form validity.
       - `tokenReady` → returns a token object after successful submission.
     - Handles form submission:
       - Generates a secure token using `tokenService.js`.
       - Calls a host-provided payment handler if supplied, otherwise falls back to a dummy API (`fakePaymentAPI`).
     - Applies accessibility standards:
       - Inputs use `aria-invalid` attributes.
       - Error messages displayed in `<span class="error">`.
       - Fully keyboard navigable.
     - Styling is customizable via CSS variables (colors, fonts, borders, button styling).

2. **CardField.js**
   - Reusable input field component for card number, expiry, CVC, and postal code.
   - Attributes:
     - `label` → Field label text.
     - `placeholder` → Input placeholder text.
     - `input-id` → Unique ID for the input.
   - Displays validation errors inside a `<span class="error">`.
   - Supports CSS variables for theming.

3. **tokenService.js**
   - Provides a function `createSecureToken(cardData)` that generates a dummy secure token:
     - Includes `token`, last 4 digits (`lastFour`), card brand (`Visa`), and expiration timestamp.
   - Simple fallback logic to handle undefined card data.

4. **validators.js**
   - Contains input validation logic:
     - `validateCardNumber()` → Luhn algorithm check for card number.
     - `validateCardExpiry()` → Checks MM/YY format.
     - `validateCVC()` → Checks length and numeric format.
     - `validatePostal()` → Checks 5-digit postal code format.
   - **Note:** Multiple card types support has been removed; currently all cards default to Visa.

### Event Handling
- **validationChange**: emitted whenever input validation status changes, providing `{ isValid: true/false }`.
- **tokenReady**: emitted after token generation, providing the token object.

### Accessibility (a11y)
- All inputs include `aria-invalid` attributes to indicate errors to screen readers.
- Error messages are associated with the relevant input.
- Component is fully navigable via keyboard.
- Sufficient color contrast is applied via CSS variables.

### Styling & Customization
- All fields and buttons are styled with default CSS.
- Host applications can customize:
  - Button background (`--primary-color`)
  - Button text color (`--button-color`)
  - Input borders (`--input-border`)
  - Error color (`--error-color`)
  - Font family (`--font-family`)

### Error Handling
- Invalid fields are visually highlighted with red borders.
- Validation messages are shown inline.
- Host apps can access validation status programmatically via events.

### Payment Handling
- Component supports an optional host-provided payment API handler.
- If no handler is provided, a dummy token is used to simulate a payment flow.
- Submission errors are caught and logged in `console.error`.


### Supported Card Types & Test Values

This component validates card numbers using the Luhn algorithm and supports major card types. For demo and testing purposes, you can use the following test card numbers:

| Card Type      | Example Number      | Notes / Expected Input                        |
| -------------- | ------------------- | --------------------------------------------- |
| **Visa**       | 4111 1111 1111 1111 | 16 digits, any future expiry, any 3-digit CVC |
| **Mastercard** | 5555 5555 5555 4444 | 16 digits, any future expiry, any 3-digit CVC |
| **Amex**       | 3782 822463 10005   | 15 digits, any future expiry, any 4-digit CVC |
| **Discover**   | 6011 1111 1111 1117 | 16 digits, any future expiry, any 3-digit CVC |


Other Input Rules:

Expiry: MM/YY format (month: 01–12, future year only)

CVC: 3 or 4 digits depending on card type (Amex = 4 digits)

Postal / ZIP: 5-digit US ZIP code (optionally 5+4 format, e.g., 12345-6789)

---

## Usage

### HTML

```html
<card-checkout-element
  label-card="Card Number"
  label-expiry="Expiry"
  label-cvc="CVC"
  label-postal="ZIP"
  placeholder-card="XXXX-XXXX-XXXX-XXXX"
  placeholder-expiry="MM/YY"
  placeholder-cvc="123"
  placeholder-postal="12345"
  button-text="Pay Now">
</card-checkout-element>

<script type="module" src="./CardCheckoutElement.js"></script>

```` ``` ````

This implementation ensures a **lightweight, modular, accessible, and reusable credit card checkout component** suitable for modern web applications.


