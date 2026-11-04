import { analyzePasswordStructure } from '../algorithms/analyzePasswordStructure.jsx'
import { sequenceRegex } from '../data/keyboardWalks.js'

export const estimateTimeToCrack = (password, analysis) => {
  if (!password || typeof password !== 'string')
    return { text: 'Instantly', score: 0, weakestSegment: null, warning: null }

  const { isLeaked = {} } = analysis
  const length = [...password].length

// Critical Dealbreakers & Short Password Overrides
  if (length <= 2 || isLeaked.status === 'Critical Alert') {
    return { text: 'Instantly', score: 0 }
  }

  if (length <= 5) {
    return { text: 'Less Than A Second', score: 0 }
  }

  // Calculate pool size
  let pool = 0
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/[0-9]/.test(password)) pool += 10
  if (/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(password)) pool += 33
  if (/\p{Script=Cyrillic}/u.test(password)) pool += 33
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(password)) pool += 80
  if (/\p{Script=Han}/u.test(password)) pool += 2500

  const effectivePoolSize = Math.max(pool, 1)
  const guessesPerSecond = 60e10

  const getSecondsForLength = len => {
    if (len === 0) return 0
    const log10Secs = len * Math.log10(effectivePoolSize) - Math.log10(guessesPerSecond)
    return Math.pow(10, Math.max(0, log10Secs))
  }

  // call the imported function analyzePasswordStructure
  const { segments, weakestSegment, minWindowSurprisal, structuralWeaknesses } = analyzePasswordStructure(password);

  let effectivePassword = password

  //Leaked passwords and other weak structures penalizer
  if (isLeaked.status === 'Weak Structure') {
    const { start, end } = isLeaked.position
    effectivePassword = password.slice(0, start) + password.slice(end)
  } 
   
  //Markov chain weak point penalizer
  if (weakestSegment?.surprisal <= 21 && isLeaked.status === 'Clear') {
    effectivePassword =
      password.slice(0, weakestSegment.index) +
      password.slice(weakestSegment.index + weakestSegment.length)
  }

  //Repeated chars, patterns and keyboard walks penalizer
  effectivePassword = effectivePassword
    .replace(/(.)\1{2,}/gi, '')
    .replace(/(.{2,8})\1+/gi, '')
    .replace(sequenceRegex, '')

    
   //Structural weaknesses of effective password 
  const finalWeak = analyzePasswordStructure(effectivePassword).structuralWeaknesses

  
    
 //Calculates effective lengths of weak spots   
const calculateWeakSpanLength = (weakSegments) => {
  if (!weakSegments || weakSegments.length === 0) return 0;

  // Map using 'id' for the start index, and 'chunk.length' for the size
  const intervals = weakSegments.map(seg => [seg.id, seg.id + seg.chunk.length]);
  
  // Sort intervals by their starting index
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];

    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }

  return merged.reduce((total, [start, end]) => total + (end - start), 0);
};


const finalLength = calculateWeakSpanLength(finalWeak);

console.log(effectivePassword,finalLength, finalWeak);

  
//Final seconds calculated from length reduced by weak spots length
let seconds = getSecondsForLength(effectivePassword.length - finalLength)
  let warning = null



  // Derive score exclusively from Final Time (aligned with floored units)
  const getScoreFromSeconds = sec => {
    if (sec <= 1) return 0
    if (sec <= 60) return 5 // Up to 1 minute -> Barely anything
    if (sec <= 3600) return 10 // Up to 1 hour
    if (sec <= 86400) return 20 // Up to 1 day -> Still highly vulnerable
    if (sec <= 604800) return 30 // Up to 1 week
    if (sec <= 2592000) return 40 // Up to 1 month (30 days)
    if (sec <= 31536000) return 50 // Up to 1 year -> Mid tier
    if (sec <= 157680000) return 65 // Up to 5 years
    if (sec <= 315360000) return 75 // Up to 10 years -> Solid defense
    if (sec <= 3153600000) return 90 // Up to 100 years -> Excellent

    return 100 // 100+ years -> Virtually unbreakable
  }

  const score = getScoreFromSeconds(seconds)

  const formatTimeText = (sec, finalScore) => {
    if (sec < 1)
      return {
        text: 'Instantly',
        score: finalScore,
        weakestSegment: null,
        warning: null
      }

    // Less than a second
    if (sec < 60) {
      return {
        text: `${Math.floor(sec)} Seconds`,
        score: finalScore,
        weakestSegment: null,
        warning: null
      }
    }

    //Minutes and seconds
    if (sec < 3600) {
      const min = Math.floor(sec / 60)
      const remainder = Math.floor(sec % 60)
      const text =
        remainder > 0
          ? `${min} Minutes, ${remainder} Seconds`
          : `${min} Minutes`
      return { text, score: finalScore }
    }

    //Hours and minutes
    if (sec < 86400) {
      const hrs = Math.floor(sec / 3600)
      const min = Math.floor((sec % 3600) / 60)
      const text = min > 0 ? `${hrs} Hours, ${min} Minutes` : `${hrs} Hours`
      return { text, score: finalScore }
    }

    //Days and hours
    const SEC_PER_DAY = 86400
    if (sec < SEC_PER_DAY * 365) {
      const days = Math.floor(sec / SEC_PER_DAY)
      const hrs = Math.floor((sec % SEC_PER_DAY) / 3600)
      const text = hrs > 0 ? `${days} Days, ${hrs} Hours` : `${days} Days`
      return { text, score: finalScore }
    }

    //Years
    const SEC_PER_YEAR = 31536000
    const years = sec / SEC_PER_YEAR

    if (years < 100) {
      return { text: `${Math.floor(years)} Years`, score: finalScore }
    }
    if (years < 1000) {
      return { text: `${Math.floor(years / 100)} Centuries`, score: finalScore }
    }
    if (years < 1e6) {
      return {
        text: `${Math.floor(years / 1000)} Millennia`,
        score: finalScore
      }
    }
    if (years < 1e9) {
      return {
        text: `${Math.floor(years / 1e6)} Million Years`,
        score: finalScore
      }
    }
    if (years < 1e12) {
      return {
        text: `${Math.floor(years / 1e9)} Billion Years`,
        score: finalScore
      }
    }

    //Scientific formatter
    const formatScientific = (value, precision = 2) => {
      if (value === 0n) return '0'

      const str = value.toString()
      const exponent = str.length - 1

      if (exponent === 0) return str

      const decimals = str.slice(1, precision + 1).padEnd(precision, '0')

      return `${str[0]}${decimals} × 10${toSuperscript(exponent)}`
    }

    const toSuperscript = num => {
      const superscriptDigits = {
        0: '⁰',
        1: '¹',
        2: '²',
        3: '³',
        4: '⁴',
        5: '⁵',
        6: '⁶',
        7: '⁷',
        8: '⁸',
        9: '⁹',
        '-': '⁻'
      }

      return String(num)
        .split('')
        .map(char => superscriptDigits[char] || char)
        .join('')
    }
    //Above trillion
    return {
      text: `${formatScientific(years)} Years`,
      score: finalScore
    }
  }

  // return formatTimeText(seconds, score)
  return {
    ...formatTimeText(seconds, score),
    weakestSegment,
    warning,
    segments
  }
}
