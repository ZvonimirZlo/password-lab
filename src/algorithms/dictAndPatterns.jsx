// Vite imports the entire text contents synchronously as a string
import TOP_100K_BLACKLIST from '/Pwdb_top-100000.txt?raw';

export const isBlacklistLoaded = Boolean(
  TOP_100K_BLACKLIST && TOP_100K_BLACKLIST.trim().length > 0
);

// Process the set once when the module loads
const BLACKLIST_SET = new Set(TOP_100K_BLACKLIST.split(/\r?\n/).map(x => x.trim()));

// Safe audio initialization
const alertSound = typeof window !== 'undefined' 
  ? new Audio('/universfield-new-notification-051-494246.mp3') 
  : null;

export const checkDictionaryAndPatterns =  (password) => {
  if (!password) return { score: 0, status: 'Empty', warning: null };

  const data = password.trim()
  // const lowerPass = data.toLowerCase();

  if (BLACKLIST_SET.has(data)) {
    alertSound.play();
    return { 
      score: 0, 
      status: 'Critical Alert', 
      warning: '⚠️ This exact password was found on the global blacklist of most compromised credentials. Do not use this.' 
    };
  }

  // 2. Sequential Keyboard Pattern Warning
  const hasSequence = /(?:123|234|345|456|567|678|789|abc|bcd|cde|def|qwe|asd|zxc|dfg)/i.test(data);
  if (hasSequence && password.length < 10) {
    alertSound.play()
    return { 
      score: 10, 
      status: 'Weak Structure', 
      warning: '⚠️ Contains a highly predictable layout pattern (keyboard walk or sequence).'
      
    };
  }

  // 3. Repeating Characters Warning
  const hasRepeats = /(.)\1{3,}/.test(password);
  if (hasRepeats) {
    alertSound.play()
    return { 
      score: 5, 
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