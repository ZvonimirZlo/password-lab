import PROD_MARKOV_DATA_TRIGRAM from '../data/trigram.json'
import PROD_MARKOV_DATA_BIGRAM from '../data/bigram.json'


// Extract both trained models from JSON asset files
const { trigramModel } = PROD_MARKOV_DATA_TRIGRAM
const { bigramModel } = PROD_MARKOV_DATA_BIGRAM

// 1. Derive UNIGRAM Frequencies from the Bigram Model
const unigramModel = {}
let totalTransitions = 0

for (const nextObj of Object.values(bigramModel)) {
  for (const [next, count] of Object.entries(nextObj)) {
    unigramModel[next] = (unigramModel[next] || 0) + count
    totalTransitions += count
  }
}

// Convert absolute counts into normalized probabilities
for (const [char, count] of Object.entries(unigramModel)) {
  unigramModel[char] = count / totalTransitions
}

// Compute a dynamic global fallback based on unique training alphabet
const allTrainedChars = new Set([
  ...Object.keys(bigramModel),
  ...Object.values(bigramModel).flatMap(obj => Object.keys(obj))
])
const globalKeyspaceSize = allTrainedChars.size || 95 // Default fallback to standard printable ASCII size
const dynamicFallback = 1 / globalKeyspaceSize

//measures how surprising a password is to trained model
export default function compareMarkovEntropy (password) {
  if (!password || password.length === 0 || typeof password !== 'string') {
    return { bigramEntropy: 0, trigramEntropy: 0 }
  }

  // ----------------------------------------------------
  // METHOD 1: 1st-Order Bigram Entropy Calculation
  // ----------------------------------------------------

  let bigramEntropy = -Math.log2(dynamicFallback) // Initial state entry cost

  for (let i = 0; i < password.length - 1; i++) {
    const current = password[i]
    const next = password[i + 1]

    let prob = dynamicFallback

    if (bigramModel[current]?.[next] !== undefined) {
      // 1. Try Bigram transition
      prob = bigramModel[current][next]
    } else if (unigramModel[next] !== undefined) {
      // 2. Fall back to Unigram frequency
      const unigramProb = unigramModel[next]
      prob = unigramProb >= dynamicFallback ? unigramProb : dynamicFallback
    }

    // SAFETY GUARD: Prevent Math.log2 from receiving 0 or negative numbers
    if (!prob || prob <= 0) {
      prob = dynamicFallback
    }

    bigramEntropy += -Math.log2(prob)
  }

  // ----------------------------------------------------
  // METHOD 2: 2nd-Order Trigram Entropy Calculation
  // ----------------------------------------------------
  let trigramEntropy = 0

  if (password.length === 1) {
    trigramEntropy = -Math.log2(dynamicFallback)
  } else if (password.length >= 2) {
    // Initial cost: Entropy of the first character + first bigram transition
    const firstChar = password[0]
    const secondChar = password[1]
    let firstTransitionProb = dynamicFallback

    if (bigramModel[firstChar] && bigramModel[firstChar][secondChar] !== undefined) {
      firstTransitionProb = bigramModel[firstChar][secondChar] || dynamicFallback;
    }
    trigramEntropy = -Math.log2(dynamicFallback) + -Math.log2(firstTransitionProb);

    // Accumulate Trigram Transitions
    for (let i = 0; i < password.length - 2; i++) {
      const historyState = password[i] + password[i + 1] // 2-char context (e.g., "th")
      const targetChar = password[i + 2] // Next char (e.g., "e")

      let prob = dynamicFallback

      if (trigramModel[historyState] && trigramModel[historyState][targetChar] !== undefined) {
        // High-precision Trigram match found
        prob = trigramModel[historyState][targetChar] || dynamicFallback
      } else if (bigramModel[password[i + 1]] && bigramModel[password[i + 1]][targetChar] !== undefined) {
        // Fallback option: Drop context back down to Bigram if Trigram was pruned or missing
        prob = bigramModel[password[i + 1]][targetChar] || dynamicFallback
      } else if (unigramModel[targetChar] !== undefined) {
        // 3. Fall back to Unigram overall frequency
        prob = unigramModel[targetChar]
      }

      // SAFETY GUARD: Prevent Math.log2 from receiving 0 or negative numbers
      if (!prob || prob <= 0) {
        prob = dynamicFallback
      }

      trigramEntropy += -Math.log2(prob)
    }
  }

  const absoluteCeiling = 1400

  const finalize = val => {
    if (val > absoluteCeiling || !isFinite(val)) return absoluteCeiling
    return +val.toFixed(1)
  }

  return {
    bigramEntropy: finalize(bigramEntropy),
    trigramEntropy: finalize(trigramEntropy)
  }
}
