import TOP_10K_BLACKLIST from '../data/blacklist_10k.json';

const BLACKLIST_SET = new Set(TOP_10K_BLACKLIST.map(password => password.toLowerCase().trim()));

// Changed from ({ password, dictResult }) to a normal (password) parameter
export const checkDictionaryAndPatterns = (password) => {
  if (!password) return { score: 0, status: 'Empty', warning: null };

  const lowerPass = password.toLowerCase().trim();

  // 1. Exact Match Warning
  if (BLACKLIST_SET.has(lowerPass)) {
    return { 
      score: 0, 
      status: 'Critical Alert', 
      warning: '⚠️ This exact password was found on the global blacklist of most compromised credentials. Do not use this.' 
    };
  }

  // 2. Sequential Keyboard Pattern Warning
  const hasSequence = /(?:123|234|345|456|567|678|789|abc|bcd|cde|def|qwe|asd|zxc)/i.test(lowerPass);
  if (hasSequence && password.length < 10) {
    return { 
      score: 40, 
      status: 'Weak Structure', 
      warning: '⚠️ Contains a highly predictable layout pattern (keyboard walk or sequence).' 
    };
  }

  // 3. Repeating Characters Warning
  const hasRepeats = /(.)\1{3,}/.test(password);
  if (hasRepeats) {
    return { 
      score: 30, 
      status: 'Weak Structure', 
      warning: '⚠️ Contains too many consecutive repeating characters.' 
    };
  }

  // Safe Pass
  return { 
    score: 100, 
    status: 'Clear', 
    warning: null 
  };
};