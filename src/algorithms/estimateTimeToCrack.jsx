export const estimateTimeToCrack = password => {
  if (!password) return { text: 'Instantly', score: 0 }

  let poolSize = 0
  if (/[a-z]/g.test(password)) poolSize += 26
  if (/[A-Z]/g.test(password)) poolSize += 26
  if (/[0-9]/g.test(password)) poolSize += 10
  if (/[^a-zA-Z0-9]/g.test(password)) poolSize += 32

  if (poolSize === 0) return { text: 'Instantly', score: 0 }

  // Calculate combinations safely using log10: log10(poolSize^length) = length * log10(poolSize)
  const log10Combinations = password.length * Math.log10(poolSize)

  // Assume an aggressive modern GPU guessing speed: 10 billion (1e10) hashes/second
  const guessesPerSecond = 1e10
  const log10Speed = Math.log10(guessesPerSecond)

  // Estimated seconds in log10 scale
  const log10Seconds = log10Combinations - log10Speed

  if (log10Seconds < 0) return { text: 'Less than a second', score: 10 }

  const seconds = Math.pow(10, log10Seconds)

  return formatTimeText(seconds, log10Combinations)
}

const formatTimeText = (seconds, log10Combinations) => {
  // We can also calculate a visual progress score (0 to 100) based on log keyspace size
  // A log10 keyspace of ~15+ is considered secure against heavy GPU rigs.
  const score = Math.min(Math.max((log10Combinations / 18) * 100, 0), 100)

  if (seconds < 1) return { text: 'Instantly', score }
  if (seconds < 60) return { text: `${Math.round(seconds)} seconds`, score }
  if (seconds < 3600)
    return { text: `${Math.round(seconds / 60)} minutes`, score }
  if (seconds < 86400)
    return { text: `${Math.round(seconds / 3600)} hours`, score }
  if (seconds < 31536000)
    return { text: `${Math.round(seconds / 86400)} days`, score }
  if (seconds < 31536000 * 1000)
    return { text: `${Math.round(seconds / 31536000)} years`, score }

  return { text: 'Centuries+', score: 100 }
}

// export const estimateTimeToCrack = (password, shannonEntropy, markovEntropy, dictResult) => {
//   // 1. Critical Threat Override: Immediate breach check
//   if (dictResult && dictResult.status === 'Critical Alert') {
//     return { text: 'Instantly (Blacklisted in PWDB)', score: 0 };
//   }

//   if (!password || password.length === 0) {
//     return { text: 'Instantly', score: 0 };
//   }

//   // 2. Identify the True Effective Entropy Bound
//   // Taking the conservative lower bound ensures we analyze against smart, pattern-aware attackers.
//   let effectiveEntropy = Math.min(shannonEntropy, markovEntropy);

//   // 3. Apply Penalties for Structural Weaknesses
//   if (dictResult && dictResult.status === 'Weak Structure') {
//     // Shave off roughly 30% of effective entropy strength for lazy repeats or keyboard walks
//     effectiveEntropy *= 0.70;
//   }

//   if (effectiveEntropy <= 0) {
//     return { text: 'Instantly', score: 0 };
//   }

//   // 4. Calculate Total System Seconds using Log10 Conversion
//   // log10(2^entropy) = entropy * log10(2)
//   const log10Combinations = effectiveEntropy * Math.log10(2);

//   // Set aggressive modern hardware velocity: 100 Billion hashes/sec (e.g., dedicated Hashcat GPU cluster)
//   const guessesPerSecond = 1e11;
//   const log10Speed = Math.log10(guessesPerSecond);
//   const log10Seconds = log10Combinations - log10Speed;

//   if (log10Seconds < 0) {
//     return { text: 'Less than a second', score: 5 };
//   }

//   const seconds = Math.pow(10, log10Seconds);

//   return formatTimeText(seconds, effectiveEntropy);
// };

// const formatTimeText = (seconds, effectiveEntropy) => {
//   // We calculate a highly realistic visual score (0 to 100) bound to effective entropy.
//   // Cryptographically, hitting 100+ bits of entropy is considered completely uncrackable.
//   const score = Math.min(Math.max((effectiveEntropy / 100) * 100, 0), 100);

//   if (seconds < 1) return { text: 'Instantly', score: Math.round(score) };
//   if (seconds < 60) return { text: `${Math.round(seconds)} seconds`, score: Math.round(score) };

//   const minutes = seconds / 60;
//   if (minutes < 60) return { text: `${Math.round(minutes)} minutes`, score: Math.round(score) };

//   const hours = minutes / 60;
//   if (hours < 24) return { text: `${Math.round(hours)} hours`, score: Math.round(score) };

//   const days = hours / 24;
//   if (days < 365) return { text: `${Math.round(days)} days`, score: Math.round(score) };

//   const years = days / 365;
//   if (years < 1000) return { text: `${Math.round(years)} years`, score: Math.round(score) };

//   const centuries = years / 100;
//   if (centuries < 10000) return { text: `${Math.round(centuries)} centuries`, score: 100 };

//   return { text: 'Eons (Quantum Safe)', score: 100 };
// };
