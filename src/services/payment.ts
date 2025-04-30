interface CardData {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
}

interface PaymentData {
  amount: number;
  currency: string;
  cardData: CardData;
}

// Simple encryption function for demo purposes
async function encryptData(data: any): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function processPayment(paymentData: PaymentData) {
  try {
    const encryptedData = await encryptData(paymentData.cardData);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `demo-${Date.now()}`,
          amount: paymentData.amount,
          currency: paymentData.currency,
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
}

export async function validateCard(cardData: CardData) {
  try {
    const encryptedData = await encryptData(cardData);

    // Simulate validation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          valid: true,
          token: encryptedData,
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Card validation error:', error);
    throw error;
  }
}