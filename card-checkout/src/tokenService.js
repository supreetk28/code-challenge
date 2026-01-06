export function createSecureToken(cardData) {
  const cardNumber = cardData.cardNumber || ''; // fallback if undefined
  return {
    token: 'tok_' + crypto.randomUUID(),
    lastFour: cardNumber.slice(-4),
    brand: 'Visa',
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  };
}