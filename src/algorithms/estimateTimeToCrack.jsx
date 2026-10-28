import { getChunkTrigramSurprisal } from '../algorithms/markovEntropy'

export const estimateTimeToCrack = (password, data = {}) => {
  if (!password || typeof password !== 'string')
    return { text: 'Instantly', score: 0, weakestSegment: null, warning: null }

  const {
    // bigramEntropy: bigram = 0,
    // trigramEntropy: trigram = 0,
    // shannonEntropy: shannon = 0,
    isLeaked = {}
  } = data

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

  const log10Seconds =
    length * Math.log10(effectivePoolSize) - Math.log10(guessesPerSecond)

  let seconds = length === 0 ? 0 : Math.pow(10, Math.max(0, log10Seconds))

  // Critical Dealbreakers & Short Password Overrides
  if (length <= 2 || isLeaked.status === 'Critical Alert') {
    return { text: 'Instantly', score: 0}
  }
  if (isLeaked.status === 'Weak Structure') {
    return { text: '10 Seconds or Less', score: 5 }
  }

  if (length <= 5) return { text: 'Less Than A Second', score: 0 }



  let weakestSegment = null;
  const windowSize = 4
  let minWindowSurprisal = Infinity

  if (password.length >= windowSize) {
    for (let i = 0; i <= password.length - windowSize; i++) {
      const chunk = password.substring(i, i + windowSize)
      const chunkSurprisal = getChunkTrigramSurprisal(chunk)
console.log(chunkSurprisal, chunk);

      if (chunkSurprisal < minWindowSurprisal) {
        minWindowSurprisal = chunkSurprisal
        // Capture position and chunk content
        weakestSegment = {
          index: i,
          length: windowSize,
          chunk: chunk,
          surprisal: chunkSurprisal
        }
      }
    }

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
    if (sec < 1) return { text: 'Instantly', score: finalScore, weakestSegment: null, warning: null }

    // Less than a second
    if (sec < 60) {
      return { text: `${Math.floor(sec)} Seconds`, score: finalScore, weakestSegment: null, warning: null }
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

    //Above trillion
    return {
      text: `${years.toExponential(1).replace('e+', 'x10^')} Years`,
      score: finalScore
    }
  }

  let warning = null

  if (minWindowSurprisal < 20) {
    seconds = seconds * 0.00000000000000001
    warning = `Weak pattern detected: 
    "${weakestSegment.chunk}",
     Markov Chain 2nd Order: ${weakestSegment.surprisal}, start:${weakestSegment.index}, end${weakestSegment.index+4}
     `
  }

  // return formatTimeText(seconds, score)
  return {
    ...formatTimeText(seconds, score),
    weakestSegment,
    warning
  }
}
