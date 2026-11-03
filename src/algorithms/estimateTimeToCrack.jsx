import { getChunkTrigramSurprisal } from '../algorithms/markovEntropy'
import { sequenceRegex } from '../data/keyboardWalks.js';

export const estimateTimeToCrack = (password, analysis) => {
  if (!password || typeof password !== 'string')
    return { text: 'Instantly', score: 0, weakestSegment: null, warning: null }

  const { isLeaked = {} } = analysis

  const length = [...password].length
  let pool = 0

  //Standard Latin keyboards
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/[0-9]/.test(password)) pool += 10
  if (/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(password)) pool += 33

  //Non-Latin
  if (/\p{Script=Cyrillic}/u.test(password)) pool += 33
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(password)) pool += 80
  if (/\p{Script=Han}/u.test(password)) pool += 2500

  const effectivePoolSize = Math.max(pool, 1)
  const guessesPerSecond = 60e10

  // Helper to calculate seconds given a specific length
  const getSecondsForLength = len => {
    if (len === 0) return 0
    const log10Secs =
      len * Math.log10(effectivePoolSize) - Math.log10(guessesPerSecond)
    return Math.pow(10, Math.max(0, log10Secs))
  }

  // Critical Dealbreakers & Short Password Overrides
  if (length <= 2 || isLeaked.status === 'Critical Alert') {
    return { text: 'Instantly', score: 0 }
  }

  //Shannon entropy helper function, calculates entropy per char
  const shannon = str => {
    if (!str || typeof str !== 'string') {
      return 0
    }
    const len = str.length

    // Build a frequency map from the string.
    const frequencies = str
      .split('')
      .reduce((freq, curr) => (freq[curr] = (freq[curr] || 0) + 1) && freq, {})

    // Sum the frequency of each character.
    return Object.values(frequencies).reduce(
      (sum, f) => sum - (f / len) * Math.log2(f / len),
      0
    )
  }

  if (length <= 5) return { text: 'Less Than A Second', score: 0 }

  let weakestSegment = null
  const windowSize = 4
  let minWindowSurprisal = Infinity
  const segments = []

  //Sliding window algorithm, checks for structural weaknesses - chunks below trigram 20, and pushes all chunks
  //and stats to segments array
  if (password.length >= windowSize) {
    for (let i = 0; i <= password.length - windowSize; i++) {
      const chunk = password.substring(i, i + windowSize)
      const chunkSurprisal = getChunkTrigramSurprisal(chunk)
      const entropy = shannon(chunk)

      if (chunkSurprisal < minWindowSurprisal) {
        minWindowSurprisal = chunkSurprisal

        // Dynamically expand the weakest segment if the pattern continues
        let currentLength = windowSize
        let currentChunk = chunk
        let currentSurprisal = chunkSurprisal

       //Expands the window if weak parts are longer than 4, (example: aaaaaaa)
        while (i + currentLength < password.length) {
          const nextChar = password[i + currentLength]
          const prevChar = password[i + currentLength - 1]
          const nextChunk = password.substring(i, i + currentLength + 1)
          const nextSurprisal = getChunkTrigramSurprisal(nextChunk)

          // If it's a repeating character streak OR low surprisal, grow the segment
          if (nextChar === prevChar || nextSurprisal <= 21) {
            currentLength++
            currentChunk = nextChunk
            currentSurprisal = nextSurprisal
          } else {
            break
          }
        }

        // Capture position and expanded chunk content
        weakestSegment = {
          index: i,
          length: currentLength,
          chunk: currentChunk,
          surprisal: currentSurprisal
        }
      }

      segments.push({
        id: i,
        chunk,
        surprisal: chunkSurprisal,
        entropy: entropy
      })
    }
  }

  // Determine the effective password string by removing weak/leaked parts
  let effectivePassword = password

  //Weak structure penalizer, slices out the weak part and calculates time
  //on rest of the password
  if (isLeaked.status === 'Weak Structure') {
    const { start, end } = isLeaked.position
    // Safely slice out the weak part
    const first = password.slice(0, start)
    const second = password.slice(end)
    effectivePassword = first + second
  }

  //Weakest segment penalizer
  if (weakestSegment?.surprisal <= 21 && isLeaked.status === 'Clear') {
    // Safely slice out the weak part
    const first = password.slice(0, weakestSegment.index)
    const second = password.slice(weakestSegment.index + weakestSegment.length)
    effectivePassword = first + second
  }



//Final cleanup of the effective password
 effectivePassword = effectivePassword
 .replace(/(.)\1{2,}/gi,'')
 .replace(/(.{2,8})\1+/gi,'')
 .replace(sequenceRegex, ''); 

  console.log(effectivePassword);
 
  // Calculate seconds using the length of the *remaining* strong parts
  let seconds = getSecondsForLength(effectivePassword.length)

  // More structural weakness
  const structuralWeakness = segments.filter(x => x.surprisal < 25)
  console.log(structuralWeakness);
  

  // if(structuralWeakness > 1 && isLeaked.status === 'Clear') seconds = seconds / structuralWeakness
  let warning = null

  if (minWindowSurprisal < 21 && weakestSegment) {
    warning = `Weak pattern detected: "${weakestSegment.chunk}"`
  }

  if(structuralWeakness.length > 3 && isLeaked.status === 'Clear') {
    warning = `Multiple Structural Weaknesses detected: "${structuralWeakness.map(x => x.chunk)}"`
    seconds = seconds * 0.5
  }

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
