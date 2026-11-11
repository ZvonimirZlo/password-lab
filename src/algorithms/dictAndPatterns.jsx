import TOP_100K_BLACKLIST from '../data/passwords.json'
import { sequenceRegex } from '../data/keyboardWalks.js'
export const isBlacklistLoaded = Boolean(TOP_100K_BLACKLIST.length > 0)

// Process the set once when the module loads for O(1) lookups
const BLACKLIST_SET = new Set(TOP_100K_BLACKLIST)

// ==============================
// Leetspeak normalizing logic
// ==============================

// // Helper to normalize strings for leetspeak
const leetMap = {
  a: ['4', '@'],
  b: ['|3', '8'],
  d: ['|)', 'o|'],
  e: ['3'],
  f: ['|='],
  g: ['9', '6'],
  h: ['|-|', ']-[', '}-{', '(-)', ')-(', '#'],
  i: ['1', '!', ']['],
  j: ['_|'],
  k: ['|<', '|{'],
  l: ['|_'],
  n: ['|\\|'],
  o: ['0'],
  p: ['|2', '|D'],
  q: ['(,)'],
  r: ['|Z', '|?'],
  s: ['5', '$'],
  t: ['+', '7'],
  v: ['|/', '\\/'],
  w: ['\\^/', '//'],
  x: ['><', '}{'],
  y: ['`/'],
  z: ['(\\)']
}

function escapeRegex (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Pre-build lookup and regex
const lookup = {};
for (const [letter, symbols] of Object.entries(leetMap)) {
  symbols.forEach(symbol => {
    lookup[symbol] = letter;
  });
}

const leetPattern = new RegExp(
  Object.keys(lookup)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex)
    .join('|'),'g'
);

function normalizePassword(text) {
  if (typeof text !== 'string') return '';
  return text.trim().toLowerCase().replace(leetPattern, match => lookup[match]);
}

// function normalizePassword (input) {
//   return input
//     .trim()
//     .toLowerCase()
//     .replace(/4|@/g, 'a')
//     .replace(/3/g, 'e')
//     .replace(/1|!|\|/g, 'i')
//     .replace(/0/g, 'o')
//     .replace(/5|\$/g, 's')
//     .replace(/7/g, 't')
//     .replace(/8/g, 'b')
// }

// ==============================
// Blacklist substring logic
// ==============================

function findBlacklistMatch (data) {
  const len = data.length

  // Check substrings from longest to shortest, or check all sliding windows.
  // For performance, check contiguous substrings of length 3 or more.
  for (let length = len; length >= 3; length--) {
    for (let i = 0; i <= len - length; i++) {
      const subData = data.substr(i, length)
      // const subNorm = normalized.substr(i, length)

      if (BLACKLIST_SET.has(subData)) {
        return {
          start: i,
          end: i + length,
          matchedText: subData,
          matchType: 'blacklist-substring'
        }
      }
    }
  }
  return null
}

export const checkDictionaryAndPatterns = password => {
  if (!password || typeof password !== 'string') {
    return { score: 0, status: 'Empty', warning: null, position: null }
  }

  // Warning in case black list is not loaded
  if (!isBlacklistLoaded) {
    return {
      score: 0,
      status: 'Error',
      warning: '⚠️ No list loaded! Blacklist verification is offline.',
      position: null
    }
  }

  const data = password.trim()
  const normalized = normalizePassword(data)

  // 1. Check Dictionary Blacklists
  if (BLACKLIST_SET.has(data)) {
    return {
      score: 0,
      status: 'Critical Alert',
      warning:
        '⚠️ This password was found on the global blacklist of compromised credentials.',
      position: { start: 0, end: data.length, matchType: 'exact' }
    }
  }
  //Check leetspeak version of blacklisted password
  if (BLACKLIST_SET.has(normalized)) {
    return {
      score: 0,
      status: 'Critical Alert',
      warning:
        '⚠️ A leetspeak variation of this password was found on the global blacklist.',
      position: { start: 0, end: data.length, matchType: 'normalized' }
    }
  }

  // Check Dictionary & Substring Blacklists
  const dictionaryMatch = findBlacklistMatch(data, normalized)
  if (dictionaryMatch) {
    const { matchedText } = dictionaryMatch
    if (matchedText.length >= 4)
      return {
        status: 'Weak Structure',
        position: dictionaryMatch,
        warning: `⚠️ Detected: "${matchedText}" This password or a portion of it was found on the global blacklist of compromised credentials.`
      }
  }

  // Chechs for highly predictable layout pattern (keyboard walk or sequence)
  const sequenceMatch = sequenceRegex.exec(data)

  if (sequenceMatch) {
    return {
      status: 'Weak Structure',
      warning: `⚠️ "${sequenceMatch[0]}" Contains a highly predictable layout pattern (keyboard walk or sequence).`,
      position: {
        start: sequenceMatch.index,
        end: sequenceMatch.index + sequenceMatch[0].length,
        matchedText: sequenceMatch[0],
        matchType: 'sequence'
      }
    }
  }

  // Repeating Characters Warning
  const repeatRegex = /(.)\1{2,}/
  const repeatMatch = repeatRegex.exec(password)

  if (repeatMatch) {
    return {
      status: 'Weak Structure',
      warning: `⚠️ "${repeatMatch[0]}" Contains too many consecutive repeating characters.`,
      position: {
        start: repeatMatch.index,
        end: repeatMatch.index + repeatMatch[0].length,
        matchedText: repeatMatch[0],
        matchType: 'repeating-chars'
      }
    }
  }

  // Repeated Patterns Warning (e.g., "abcabc")
  const patternRegex = /(.{2,8})\1+/
  const patternMatch = patternRegex.exec(password)

  if (patternMatch) {
    return {
      status: 'Weak Structure',
      warning: `⚠️ Avoid repeating short patterns consecutively (e.g., "abcabc"). Detected: "${patternMatch[0]}"`,
      position: {
        start: patternMatch.index,
        end: patternMatch.index + patternMatch[0].length,
        matchedText: patternMatch,
        matchType: 'repeated-pattern'
      }
    }
  }

  // Safe Pass
  return {
    score: 100,
    status: 'Clear',
    warning: null,
    position: null
  }
}
