export function validateCardNumber(number) {
  const digits = number.replace(/\D/g, '');
  let sum = 0, doubleDigit = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

export function validateCardExpiry(expiry) {
  const [mm, yy] = expiry.split('/');
  if (!mm || !yy) return false;
  const month = Number(mm);
  const year = Number('20' + yy);
  const now = new Date();
  return month >= 1 && month <= 12 && new Date(year, month) > now;
}

export function validateCVC(cvc) {
  return /^\d{3,4}$/.test(cvc);
}

export function validatePostal(postal) {
  return /^\d{5}(-\d{4})?$/.test(postal); // US ZIP
}
