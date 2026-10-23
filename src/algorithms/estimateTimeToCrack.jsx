export const estimateTimeToCrack = (password, data = {}) => {
  if (!password || typeof password !== 'string')
    return { text: 'Instantly', score: 0 }
  const length = password.length

  const {
    bigramEntropy: bigram = 0,
    trigramEntropy: trigram = 0,
    shannonEntropy: shannon = 0,
    isLeaked = {}
  } = data

  // Baseline time calculation
  const averagePoolSize = 162
  let log10Combinations = Math.round(length * Math.log10(averagePoolSize))

  // Estimated brute-force attempt rate: 10 billion guesses per second
  const guessesPerSecond = 1e10
  const log10Speed = Math.log10(guessesPerSecond)
  let log10Seconds = log10Combinations - log10Speed

  const penaltyFactor = Math.min((60 - Math.min(bigram, trigram)) / 60, 1)
  //   Softer bigram/trigram penalty (e.g., sliding penalty instead of a harsh flat drop)
  // Check from strictest (lowest entropy) to loosest
  if (bigram < 30 || trigram < 30) {
    log10Seconds -= penaltyFactor * 1.5
  } else if (bigram < 35 || trigram < 35) {
    log10Seconds -= penaltyFactor * 1.1
  } else if (bigram < 45 || trigram < 45) {
    log10Seconds -= penaltyFactor * 1
  } else if (bigram < 60 || trigram < 60) {
    log10Seconds -= penaltyFactor * 0.5
  }

  let seconds = log10Seconds < 0 ? 0 : Math.pow(10, log10Seconds)


  //Critical Dealbreakers & Short Password Overrides
  if (length <= 2 || isLeaked.status === 'Critical Alert') {
    return { text: 'Instantly', score: 0 }
  }
  if (isLeaked.status === 'Weak Structure') {
    return { text: '10 Seconds or Less', score: 5 }
  }
  if (length <= 3) return { text: 'Less Than a Second', score: 1 }
  if (length <= 4) return { text: '1 Second', score: 2 }
   if (length <= 5 && trigram < 30)return { text: '5 Seconds', score: 5 }
  if (length <= 5 && trigram > 30)return { text: '10 Seconds', score: 5 }

  //Shannon filter tested on randomized strong passwords
  if (shannon >= 1 && shannon < 17) {
    seconds = seconds/10
  } else if (shannon >= 17 && shannon <= 19.7) {
    seconds = Math.min(seconds / 100, 10800) //time cap max 3 hrs
  } else if (shannon >= 19.8 && shannon <= 24) {
    seconds = seconds / 10000
  } else if (shannon > 24 && shannon <= 29) {
    seconds = Math.min(seconds / 100000, 86400)
  } else if (shannon > 29 && shannon < 34) {
    seconds = Math.min(seconds / 1000000, 14601600)
  } else if (shannon >= 34 && shannon < 39) {
    seconds = Math.min(seconds / 10000000, 10518984)
  } else if (shannon >= 39 && shannon <= 44) {
    seconds = Math.min(seconds / 1000000000, 1104493320)
  } else if (shannon > 44 && shannon <= 49) {
    seconds = Math.min(1104493320, seconds / 10000000000)
  }

if (trigram < length * 5) seconds = Math.min(240, trigram * 4)

// Derive score exclusively from Final Time (aligned with floored units)
const getScoreFromSeconds = sec => {
    if (sec <= 1) return 0
    if (sec <= 10) return 5
    if (sec <= 60) return 10 // 1 minute
    if (sec <= 300) return 15 // 5 minutes
    if (sec < 7200) return 20 // 1 hour
    if (sec <= 10800) return 28 // 3 hours
    if (sec <= 86400) return 35 // 1 day
    if (sec <= 604800) return 42 // 1 week
    if (sec <= 2592000) return 48 // 30 days (1 month)
    if (sec <= 31536000) return 60 // 1 year
    if (sec <= 94608000) return 65 // 3 years
    if (sec <= 157680000) return 67 // 5 years 
    if (sec <= 315360000) return 70 // 10 years
    if (sec <= 3153600000) return 80 // 100 years
    return 100 // 1000+ years
  }

  const score = getScoreFromSeconds(seconds)

  // Output formatter using Math.floor
  const formatTimeText = (sec, finalScore) => {
    if (sec < 1) return { text: 'Instantly', score: finalScore }
    if (sec < 60) return { text: `${Math.floor(sec)} Seconds`, score: finalScore }
    if (sec < 3600) return { text: `${Math.floor(sec / 60)} Minutes`, score: finalScore }
    if (sec < 86400) return { text: `${Math.floor(sec / 3600)} Hours`, score: finalScore }
    if (sec < 31536000) return { text: `${Math.floor(sec / 86400)} Days`, score: finalScore }
    if (sec < 31536000 * 1000) return { text: `${Math.floor(sec / 31536000)} Years`, score: finalScore }

    return { text: 'Centuries+', score: finalScore }
  }
console.log(seconds);

  return formatTimeText(seconds, score)

  
}
