export const estimateTimeToCrack = (password, data = {}) => {
  if (!password) return { text: 'Instantly', score: 0 }
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

  // if (bigram < 60 || trigram < 60) {
  //   log10Seconds = Math.max(0, log10Seconds - 1) // drops it by 1 order of magnitude (50x faster to crack)
  // }

  // Softer bigram/trigram penalty (e.g., sliding penalty instead of a harsh flat drop)
  if (bigram < 50 || trigram < 60) {
    const penaltyFactor = Math.min((60 - Math.min(bigram, trigram)) / 60, 1)
    log10Seconds -= penaltyFactor * 0.5
  }  if (bigram < 30 || trigram < 35) {
    const penaltyFactor = Math.min((60 - Math.min(bigram, trigram)) / 60, 1)
    log10Seconds -= penaltyFactor * 3.5
  }

  let seconds = log10Seconds < 0 ? 0 : Math.pow(10, log10Seconds)
  console.log(seconds)

  // 1. Critical Dealbreakers & Short Password Overrides
  if (shannon === 0 || isLeaked.status === 'Critical Alert') {
    return { text: 'Instantly', score: 0 }
  }
  if (isLeaked.status === 'Weak Structure') {
    return { text: '10 Seconds or Less', score: 5 }
  }
  if (length <= 3) return { text: 'Less Than a Second', score: 0 }
  if (length <= 4) return { text: '1 Second', score: 1 }
  if (length <= 5 && isLeaked.status === 'Clear')
    return { text: '10 Seconds', score: 5 }

  //Shannon filter
  if (shannon >= 15 && shannon < 17) {
    seconds = seconds / 10
  } else if (shannon >= 17 && shannon <= 19.7) {
    seconds = seconds / 100
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

  //Derive score exclusively from Final Time
  const getScoreFromSeconds = sec => {
    if (sec <= 1) return 0
    if (sec <= 10) return 5
    if (sec <= 60) return 20
    if (sec <= 3600) return 40
    if (sec <= 86400) return 60
    if (sec <= 31536000) return 80
    return 100
  }

  const score = getScoreFromSeconds(seconds)

  //Output formatter
  const formatTimeText = (sec, finalScore) => {
    if (sec < 1) return { text: 'Instantly', score: finalScore }
    if (sec < 60)
      return { text: `${Math.round(sec)} seconds`, score: finalScore }
    if (sec < 3600)
      return { text: `${Math.round(sec / 60)} minutes`, score: finalScore }
    if (sec < 86400)
      return { text: `${Math.round(sec / 3600)} hours`, score: finalScore }
    if (sec < 31536000)
      return { text: `${Math.round(sec / 86400)} days`, score: finalScore }
    if (sec < 31536000 * 1000)
      return { text: `${Math.round(sec / 31536000)} years`, score: finalScore }

    return { text: 'Centuries+', score: finalScore }
  }

  return formatTimeText(seconds, score)
}

// ------------------------------------------------------------------------------

// const SHANNON_BRACKETS = [
//   { min: 15,   max: 17.6, divisor: 10 },
//   { min: 17.7, max: 19.7, divisor: 100 },
//   { min: 19.8, max: 24,   divisor: 10000 },
//   { min: 24,   max: 29,   divisor: 100000,    maxCap: 86400 },
//   { min: 29,   max: 34,   divisor: 1000000,   maxCap: 14601600 },
//   { min: 34,   max: 39,   divisor: 10000000,  maxCap: 10518984 },
//   { min: 39,   max: 44,   divisor: 100000000, maxCap: 1104493320 },
//   { min: 44,   max: 49,   divisor: 10000000000, maxCap: 1104493320 }
// ]

// export const estimateTimeToCrack = (password, data = {}) => {
//   if (!password) return { text: 'Instantly', score: 0 }
//   const length = password.length

//   const {
//     bigramEntropy: bigram = 0,
//     trigramEntropy: trigram = 0,
//     shannonEntropy: shannon = 0,
//     isLeaked = {}
//   } = data

//   // 1. Critical Dealbreakers & Short Password Overrides
//   if (shannon === 0 || isLeaked.status === 'Critical Alert') {
//     return { text: 'Instantly', score: 0 }
//   }
//   if (isLeaked.status === 'Weak Structure') {
//     return { text: '10 Seconds or Less', score: 5 }
//   }
//   if (length <= 3) return { text: 'Less Than a Second', score: 0 }
//   if (length <= 4) return { text: '1 Second', score: 1 }
//   if (length <= 5 && isLeaked.status === 'Clear') {
//     return { text: '10 Seconds', score: 5 }
//   }

//   // 2. Baseline Calculation & Penalties
//   const averagePoolSize = 162
//   let log10Combinations = length * Math.log10(averagePoolSize)

//   if (bigram < 50 || trigram < 60) {
//     const penaltyFactor = Math.min((60 - Math.min(bigram, trigram)) / 60, 1)
//     log10Combinations -= penaltyFactor * 0.5
//   }

//   const guessesPerSecond = 1e10
//   let log10Seconds = log10Combinations - Math.log10(guessesPerSecond)
//   let seconds = log10Seconds < 0 ? 0 : Math.pow(10, log10Seconds)

//   // 3. Apply your precise Shannon brackets cleanly
//   const bracket = SHANNON_BRACKETS.find(b => shannon >= b.min && shannon <= b.max)
//   if (bracket) {
//     seconds = seconds / bracket.divisor
//     if (bracket.maxCap !== undefined) {
//       seconds = Math.min(seconds, bracket.maxCap)
//     }
//   }

//   // 4. Scoring & Formatting
//   const getScoreFromSeconds = sec => {
//     if (sec <= 1) return 0
//     if (sec <= 10) return 5
//     if (sec <= 60) return 20
//     if (sec <= 3600) return 40
//     if (sec <= 86400) return 60
//     if (sec <= 31536000) return 80
//     return 100
//   }

//   const score = getScoreFromSeconds(seconds)

//   const formatTimeText = (sec, finalScore) => {
//     if (sec < 1) return { text: 'Instantly', score: finalScore }
//     if (sec < 60) return { text: `${Math.round(sec)} seconds`, score: finalScore }
//     if (sec < 3600) return { text: `${Math.round(sec / 60)} minutes`, score: finalScore }
//     if (sec < 86400) return { text: `${Math.round(sec / 3600)} hours`, score: finalScore }
//     if (sec < 31536000) return { text: `${Math.round(sec / 86400)} days`, score: finalScore }
//     if (sec < 31536000 * 1000) return { text: `${Math.round(sec / 31536000)} years`, score: finalScore }

//     return { text: 'Centuries+', score: finalScore }
//   }

//   return formatTimeText(seconds, score)
// }



