export const generateSecurePassword = (options = {}) => {
// const getCrypto = () => {
//   if (typeof globalThis !== 'undefined' && globalThis.crypto) {
//     return globalThis.crypto;
//   }
//   if (typeof window !== 'undefined' && window.crypto) {
//     return window.crypto;
//   }
//   throw new Error('Web Crypto API is not available. Ensure you are running in a secure context (HTTPS).');
// };

  const {
    length = 16,
    useLower = true,
    useUpper = true,
    useNumbers = true,
    useSymbols = true,
  } = options;

  const sets = [];
  if (useLower) sets.push('abcdefghijklmnopqrstuvwxyz');
  if (useUpper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (useNumbers) sets.push('0123456789');
  if (useSymbols) sets.push('!@#$%^&*()_+-=[]{}|;:,.<>?');

  // if (sets.length === 0) return '';
  // if (length < sets.length) {
  //   throw new Error(`Password length must be at least ${sets.length} to include all selected character types.`);
  // }

  const allChars = sets.join('');
  const passwordArray = [];

  // 1. Guarantee at least one character from each enabled set
  for (let i = 0; i < sets.length; i++) {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    passwordArray.push(sets[i][randomBuffer[0] % sets[i].length]);
  }

  // 2. Fill the remaining length from the combined character pool
  const remainingLength = length - passwordArray.length;
  if (remainingLength > 0) {
    const randomBuffer = new Uint32Array(remainingLength);
   crypto.getRandomValues(randomBuffer);
    for (let i = 0; i < remainingLength; i++) {
      passwordArray.push(allChars[randomBuffer[i] % allChars.length]);
    }
  }

  // 3.Fisher-Yates algorithm cryptographically shuffle the result so the guaranteed positions aren't predictable
  const shuffleBuffer = new Uint32Array(passwordArray.length);
  crypto.getRandomValues(shuffleBuffer);
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = shuffleBuffer[i] % (i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join('');
};