export const generateSecurePassword = (options = {}) => {
  const {
    length = 16,
    useLower = true,
    useUpper = true,
    useNumbers = true,
    useSymbols = true,
  } = options;

  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';


  let validChars = '';
  if (useLower) validChars += lowerChars;
  if (useUpper) validChars += upperChars;
  if (useNumbers) validChars += numberChars;
  if (useSymbols) validChars += symbolChars;

  if (!validChars) return ''; // Fallback if all options are unchecked

  let password = '';
  const array = new Uint32Array(length);
  // Use crypto.getRandomValues for cryptographically secure randomness
  window.crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += validChars[array[i] % validChars.length];
  }

  return password;
};