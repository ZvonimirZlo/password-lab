export const estimateTimeToCrack = (password, data = {}) => {
  if (!password) return { text: 'Instantly', score: 0 }
  const length = password.length

    // Baseline time calculation
  const averagePoolSize = 162 
  let log10Combinations = Math.round(length * Math.log10(averagePoolSize))

  // Estimated brute-force attempt rate: 10 billion guesses per second
  const guessesPerSecond = 1e10
  const log10Speed = Math.log10(guessesPerSecond)
  const log10Seconds = log10Combinations - log10Speed

  let seconds = log10Seconds < 0 ? 0 : Math.pow(10, log10Seconds)
  console.log(seconds);
  

  const {
    bigramEntropy: bigram = 0,
    trigramEntropy: trigram = 0,
    shannonEntropy: shannon = 0,
    isLeaked = {}
  } = data

  // 1. Critical Dealbreakers & Short Password Overrides
  if (shannon === 0 || isLeaked.status === 'Critical Alert') {
    return { text: 'Instantly', score: 0 }
  }
  if (isLeaked.status === 'Weak Structure') {
    return { text: '10 Seconds or Less', score: 5 }
  }
  if (length <= 3) return { text: 'Less Than a Second', score: 0 }
  if (length <= 4) return { text: '1 Second', score: 1 }
  if (length <= 5 && isLeaked.status === 'Clear') return { text: '10 Seconds', score: 5 }

 
 
  //Penalties
  if(shannon <= 17.6 && shannon >= 15){
    seconds = seconds / 10
  }else if (shannon <= 19.7 && shannon >= 17.6) {
    seconds = seconds / 100
  }else if (shannon < 17.6) {
    seconds = seconds / 1000
  }else if(shannon >= 20 && shannon <= 24) {
    seconds = seconds / 10000
  }else if(shannon >= 24 && shannon <= 29) {
    seconds = seconds / 100000
  }else if(shannon > 29 && shannon < 33) {
    seconds = seconds / 1000000
  }else if(shannon >= 33 && shannon < 39) {
    seconds = Math.min(seconds, seconds / 10000000,)
  }else if(shannon >= 39 && shannon <= 44) {
    seconds = Math.min(seconds, seconds / 1000000000)
  }else if(shannon > 44 && shannon <= 49) {
    seconds = Math.min(seconds, seconds / 10000000000)
  }




  //Derive score exclusively from Final Time
  const getScoreFromSeconds = (sec) => {
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
    if (sec < 60) return { text: `${Math.round(sec)} seconds`, score: finalScore }
    if (sec < 3600) return { text: `${Math.round(sec / 60)} minutes`, score: finalScore }
    if (sec < 86400) return { text: `${Math.round(sec / 3600)} hours`, score: finalScore }
    if (sec < 31536000) return { text: `${Math.round(sec / 86400)} days`, score: finalScore }
    if (sec < 31536000 * 1000) return { text: `${Math.round(sec / 31536000)} years`, score: finalScore }

    return { text: 'Centuries+', score: finalScore }
  }


  return formatTimeText(seconds, score)

}





