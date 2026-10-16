import TOP_100K_BLACKLIST from '../data/passwords.json'

export const isBlacklistLoaded = Boolean(TOP_100K_BLACKLIST.length > 0)
// console.log(isBlacklistLoaded)

// Process the set once when the module loads
const BLACKLIST_SET = new Set(TOP_100K_BLACKLIST)

export const checkDictionaryAndPatterns = password => {
  if (password.length <= 1) return 0

  //Warning in case black list is not loaded
  if (!isBlacklistLoaded) {
    return {
      score: 0,
      status: 'Error', // Matches the pattern of other returns
      warning: '⚠️ No list loaded! Blacklist verification is offline.'
    }
  }
  if (!password) return { score: 0, status: 'Empty', warning: null }

  
  
// Helper to normalize strings for leetspeak
function normalizePassword(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/4|@/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1|!|\|/g, 'i')
    .replace(/0/g, 'o')
    .replace(/5|\$/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b'); // Added another common substitution
}

const data = password.trim();
const normalized = normalizePassword(data);

// Check data and normalized blacklists
if (BLACKLIST_SET.has(data) || BLACKLIST_SET.has(normalized)) {
  return {
    score: 0,
    status: 'Critical Alert',
    warning: '⚠️ This password or a common variation of it was found on the global blacklist of compromised credentials. Do not use this.'
  };
}


  // 2. Sequential Keyboard Pattern Warning
  const hasSequence =
    /(?:123|234|345|456|567|678|789|012|abc|bcd|cde|def|qwe|asd|zxc|dfg|čćž|ćžš|šžć|đžć|rtz|rty)/i.test(
      data
    )
  if (hasSequence && password.length < 10) {
    return {
      score: 5,
      status: 'Weak Structure',
      warning:
        '⚠️ Contains a highly predictable layout pattern (keyboard walk or sequence).'
    }
  }

  // 3. Repeating Characters Warning
  const hasRepeats = /(.)\1{3,}/.test(password)
  if (hasRepeats) {
    return {
      score: 5,
      status: 'Weak Structure',
      warning: '⚠️ Contains too many consecutive repeating characters.'
    }
  }
  // Repeated patterns warning
  if (/(.{2,4})\1+/.test(password)) {
    return {
      score: 5,
      status: 'Weak Structure',
      warning: '⚠️ Avoid repeating short patterns consecutively (e.g., "abcabc").'
    }
  }

  // Safe Pass
  return {
    score: 100,
    status: 'Clear',
    warning: null
  }
}
