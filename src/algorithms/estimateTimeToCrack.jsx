export const estimateTimeToCrack = (password, data = {}) => {
  if (!password) return { text: 'Instantly', score: 0 }

  let poolSize = 0
  if (/[a-z]/g.test(password)) poolSize += 26
  if (/[A-Z]/g.test(password)) poolSize += 26
  if (/[0-9]/g.test(password)) poolSize += 10
  if (/[^a-zA-Z0-9]/g.test(password)) poolSize += 32

  if (poolSize === 0) return { text: 'Instantly', score: 0 }

  let log10Combinations = Math.round(password.length * Math.log10(poolSize))

  const bigram = data.bigramEntropy
  const trigram = data.trigramEntropy
  const isLeaked = data.isLeaked
  const shannon = data.shannonEntropy
  const length = password.length

  // console.log(isLeaked);
  

  // Calculate base math time
  const guessesPerSecond = 1e10
  const log10Speed = Math.log10(guessesPerSecond)
  const log10Seconds = log10Combinations - log10Speed

  let seconds = log10Seconds < 0 ? 0 : Math.pow(10, log10Seconds)
  let score = Math.round(Math.min(Math.max((log10Combinations / 18) * 100, 0), 100))
console.log(score);

  // -----------------------------------------------------------------
  // MANIPULATE / OVERRIDE FINAL RESULTS BASED ON VULNERABILITIES
  // -----------------------------------------------------------------
  if (isLeaked.status === 'Critical Alert') {
    return { text: 'Instantly', score: isLeaked.score }
  }

    if (isLeaked.status === 'Weak Structure') {
    return { text: 'Less than 10 seconds', score: isLeaked.score}
  }

  if (length <= 6) {
    seconds = Math.min(seconds, 2);          // Instantly / 2 seconds
    score = Math.min(score, 10);
  } else if (length <= 9) {
    seconds = Math.min(seconds, 3600);       // Max 1 hour
    score = Math.min(score, 35);
  } else if (length <= 11) {
    // Tightened for modern GPU cracking speeds
    seconds = Math.min(seconds, 86400 * 2);  // Max 2 days instead of 30 days
    score = Math.min(score, 50);             // Cap at 50% (Mediocre/Warning)
  }

  // if (shannon <= 25 || (trigram && trigram < 50)) {
  //   return { text: `${isLeaked.warning}`, score: Math.min(score, 15) }
  // }

  // if (bigram && bigram < 60) {
  //   // Force a penalty cap on both time and score if bigrams are weak
  //   seconds = Math.min(seconds, 60) // Cap max time to 1 minute
  //   score = Math.min(score, 40)
  // }
  // -----------------------------------------------------------------

  const formatTimeText = (seconds, score) => {
    if (seconds < 1) return { text: 'Instantly', score }
    if (seconds < 60) return { text: `${Math.round(seconds)} seconds`, score }
    if (seconds < 3600) return { text: `${Math.round(seconds / 60)} minutes`, score }
    if (seconds < 86400) return { text: `${Math.round(seconds / 3600)} hours`, score }
    if (seconds < 31536000) return { text: `${Math.round(seconds / 86400)} days`, score }
    if (seconds < 31536000 * 1000) return { text: `${Math.round(seconds / 31536000)} years`, score }

    return { text: 'Centuries+', score: 100 }
  }

  return formatTimeText(seconds, score)
}
