import TOP_100K_BLACKLIST from '../data/passwords.json'

export const isBlacklistLoaded = Boolean(TOP_100K_BLACKLIST.length > 0)

// Process the set once when the module loads for O(1) lookups
const BLACKLIST_SET = new Set(TOP_100K_BLACKLIST)

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
    .replace(/8/g, 'b')
}

function findBlacklistMatch(data, normalized) {
  const len = data.length

  // Check substrings from longest to shortest, or check all sliding windows.
  // For performance, we check contiguous substrings of length 3 or more.
  for (let length = len; length >= 3; length--) {
    for (let i = 0; i <= len - length; i++) {
      const subData = data.substr(i, length)
      const subNorm = normalized.substr(i, length)

      if (BLACKLIST_SET.has(subData)) {
        return { start: i, end: i + length, matchedText: subData, matchType: 'blacklist-substring' }
      }
      if (BLACKLIST_SET.has(subNorm)) {
        return { start: i, end: i + length, matchedText: subNorm, matchType: 'blacklist-normalized' }
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
  // Since the whole password matches the dictionary, the index is usually 0 to data.length
  if (BLACKLIST_SET.has(data)) {
    return {
      score: 0,
      status: 'Critical Alert',
      warning: '⚠️ This password was found on the global blacklist of compromised credentials.',
      position: { start: 0, end: data.length, matchType: 'exact' }
    }
  }

  // 1. Check Dictionary & Substring Blacklists efficiently
  const dictionaryMatch = findBlacklistMatch(data,normalized)
  if (dictionaryMatch) {
    const { start, end, matchedText } = dictionaryMatch
    return {
      score: 0,
      status: 'Critical Alert',
      position: dictionaryMatch,
      warning: `"${matchedText}" ⚠️ This password or a portion of it was found on the global blacklist of compromised credentials.`,
    }
  }
  
  if (BLACKLIST_SET.has(normalized)) {
    return {
      score: 0,
      status: 'Critical Alert',
      warning: '⚠️ A leetspeak variation of this password was found on the global blacklist.',
      position: { start: 0, end: data.length, matchType: 'normalized' }
    }
  }

  // 2. Sequential Keyboard Pattern Warning (using .exec() to get index)
  const sequenceRegex = /(?:123|234|345|456|567|678|789|012|abc|bcd|cde|def|qwe|asd|zxc|dfg|čćž|ćžš|šžć|đžć|rtz|rty)/i
  const sequenceMatch = sequenceRegex.exec(data)
  
  if (sequenceMatch) {
    return {
      status: 'Weak Structure',
      warning: '⚠️ Contains a highly predictable layout pattern (keyboard walk or sequence).',
      position: {
        start: sequenceMatch.index,
        end: sequenceMatch.index + sequenceMatch[0].length,
        matchedText: sequenceMatch[0],
        matchType: 'sequence'
      }
    }
  }

  // 3. Repeating Characters Warning
  const repeatRegex = /(.)\1{2,}/
  const repeatMatch = repeatRegex.exec(password)
  
  if (repeatMatch) {
    return {
      status: 'Weak Structure',
      warning: '⚠️ Contains too many consecutive repeating characters.',
      position: {
        start: repeatMatch.index,
        end: repeatMatch.index + repeatMatch[0].length,
        matchedText: repeatMatch[0],
        matchType: 'repeating-chars'
      }
    }
  }

  // 4. Repeated Patterns Warning (e.g., "abcabc")
  const patternRegex =/(.{2,8})\1+/
  const patternMatch = patternRegex.exec(password)
  
  if (patternMatch) {
    return {
      status: 'Weak Structure',
      warning: '⚠️ Avoid repeating short patterns consecutively (e.g., "abcabc").',
      position: {
        start: patternMatch.index,
        end: patternMatch.index + patternMatch[0].length,
        matchedText: patternMatch[0],
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
