export const getCharacterDistribution = (password) => {
  if (!password) return { lower: 0, upper: 0, numbers: 0, symbols: 0, counts: { lower: 0, upper: 0, numbers: 0, symbols: 0 } };
  
  const total = password.length;
  const lower = (password.match(/[a-z]/g) || []).length;
  const upper = (password.match(/[A-Z]/g) || []).length;
  const numbers = (password.match(/[0-9]/g) || []).length;
  const symbols = total - (lower + upper + numbers); // Everything else

  return {
    lower: (lower / total) * 100,
    upper: (upper / total) * 100,
    numbers: (numbers / total) * 100,
    symbols: (symbols / total) * 100,
    counts: { lower, upper, numbers, symbols }
  };
};