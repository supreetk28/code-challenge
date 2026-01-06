export function createSecureToken(cardData) {
  return {
    token: 'tok_' + crypto.randomUUID(),
    lastFour: cardData.number.slice(-4),
    brand: 'Visa',
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  };
}
