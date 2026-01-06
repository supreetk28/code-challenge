export function createSecureToken(cardData) {
  if (!cardData || typeof cardData.cardNumber !== 'string') {
    throw new Error('Invalid card data: cardNumber must be a string');
  }

  return {
    token: 'tok_' + crypto.randomUUID(),
    lastFour: cardData.cardNumber.slice(-4),
    brand: 'Visa',
    expiresAt: Date.now() + 5 * 60 * 1000
  };
}
