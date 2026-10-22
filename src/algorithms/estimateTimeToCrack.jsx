export const estimateTimeToCrack = (password, data = {}) => {
  if (!password || typeof password !== 'string') return { text: 'Instantly', score: 0 }
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
const penaltyFactor = Math.min((60 - Math.min(bigram, trigram)) / 60, 1)
//   Softer bigram/trigram penalty (e.g., sliding penalty instead of a harsh flat drop)
// Check from strictest (lowest entropy) to loosest
  if (bigram < 30 || trigram < 30) {
    log10Seconds -= penaltyFactor * 3.5
  } else if (bigram < 35 || trigram < 35) {
    log10Seconds -= penaltyFactor * 2.5
  } else if (bigram < 45 || trigram < 45) {
    log10Seconds -= penaltyFactor * 1.5
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
  if (length <= 5 && isLeaked.status === 'Clear')
    return { text: '10 Seconds', score: 5 }



  //Shannon filter tested on randomized strong passwords
  if (shannon >= 1 && shannon < 17) {
    seconds = seconds / 10
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

  //Markov filter to make sure that simple words get less seconds (time cap 2 min) then complex
  if(length === 6 && bigram < 30){
    seconds = Math.min(seconds / 4, 120)
  } else if(length === 7 && bigram < 30){
    seconds = Math.min(seconds / 10, 120)
  } else if(length === 8 && bigram <= 38){
    seconds = Math.min(seconds / 100, 120)
  } else if(length === 9 && trigram <= 39){
    seconds = Math.min(seconds / 1000, 120)
  }else if(length === 10 && trigram <= 48){
    seconds = Math.min(seconds / 10000, 120)
  }else if(length === 11 && trigram <= 55){
    seconds = Math.min(seconds / 100000, 120)
  }else if(length === 12 && trigram <= 55){
    seconds = Math.min(seconds / 1000000, 120)
  }else if(length === 13 && trigram <= 55){
    seconds = Math.min(seconds / 10000000, 240)
  }else if(length === 14 && trigram <= 55){
    seconds = Math.min(seconds / 100000000, 240)
  } else if(length === 15 && trigram <= 65){
    seconds = Math.min(seconds / 10000000000, 240)
  } else if(length === 16 && trigram <= 70){
    seconds = Math.min(seconds / 100000000000, 240)
  } else if(length === 17 && trigram <= 70){
    seconds = Math.min(seconds / 1000000000000, 240)
  }else if(length === 18 && trigram <= 70){
    seconds = Math.min(seconds / 10000000000000, 240)
  }else if(length === 19 && trigram <= 70){
    seconds = Math.min(seconds / 100000000000000, 240)
  }else if(length === 20 && trigram <= 70){
    seconds = Math.min(seconds / 1000000000000000, 240)
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





