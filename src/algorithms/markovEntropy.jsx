import PROD_MARKOV_DATA from '../data/matrix.json';



// Extract both trained models from the single shared JSON asset
const { bigramModel, trigramModel } = PROD_MARKOV_DATA;

// Compute a dynamic global fallback based on unique training alphabet
const allTrainedChars = new Set([
  ...Object.keys(bigramModel),
  ...Object.values(bigramModel).flatMap(obj => Object.keys(obj))
]);
const globalKeyspaceSize = allTrainedChars.size || 95; // Default fallback to standard printable ASCII size
const dynamicFallback = 1 / globalKeyspaceSize;

//measures how surprising a password is to trained model
export default function compareMarkovEntropy(password) {
  if (!password || password.length === 0) {
    return { bigramEntropy: 0, trigramEntropy: 0 };
  }
// // Helper to detect excessive repetition or simple patterns
//   const hasExcessiveRepeats = (str) => {
//     // Check for single character dominance (e.g., "aaaaa")
//     if (new Set(str).size === 1) return true;
    
//     // Check for repeating 2-char or 3-char chunks (e.g., "abcabcabc" or "121212")
//     // or long runs of identical characters (e.g., 3+ same chars in a row)
//     const consecutiveRegex = /(.)\1{2,}/;
//     return consecutiveRegex.test(str);
//   };

//   // If the password relies heavily on repetitive patterns, cap its entropy score low
//   if (hasExcessiveRepeats(password)) {
//     return { bigramEntropy: 4.0, trigramEntropy: 4.0 };
//   }



  // ----------------------------------------------------
  // METHOD 1: 1st-Order Bigram Entropy Calculation
  // ----------------------------------------------------
  let bigramEntropy = -Math.log2(dynamicFallback); // Initial state entry cost

  for (let i = 0; i < password.length - 1; i++) {
    const current = password[i];
    const next = password[i + 1];
    
    let prob = dynamicFallback;
    if (bigramModel[current] && bigramModel[current][next] !== undefined) {
      prob = bigramModel[current][next] || dynamicFallback;
    }
    bigramEntropy += -Math.log2(prob);
  }

  // ----------------------------------------------------
  // METHOD 2: 2nd-Order Trigram Entropy Calculation
  // ----------------------------------------------------
  let trigramEntropy = 0;

  if (password.length === 1) {
    trigramEntropy = -Math.log2(dynamicFallback);
  } else if (password.length >= 2) {
    // Initial cost: Entropy of the first character + first bigram transition
    const firstChar = password[0];
    const secondChar = password[1];
    let firstTransitionProb = dynamicFallback;
    
    if (bigramModel[firstChar] && bigramModel[firstChar][secondChar] !== undefined) {
      firstTransitionProb = bigramModel[firstChar][secondChar] || dynamicFallback;
    }
    trigramEntropy = -Math.log2(dynamicFallback) + -Math.log2(firstTransitionProb);

    // Accumulate Trigram Transitions
    for (let i = 0; i < password.length - 2; i++) {
      const historyState = password[i] + password[i + 1]; // 2-char context (e.g., "th")
      const targetChar = password[i + 2];                 // Next char (e.g., "e")

      let prob = dynamicFallback;
      
      if (trigramModel[historyState] && trigramModel[historyState][targetChar] !== undefined) {
        // High-precision Trigram match found
        prob = trigramModel[historyState][targetChar] || dynamicFallback;
      } else if (bigramModel[password[i + 1]] && bigramModel[password[i + 1]][targetChar] !== undefined) {
        // Fallback option: Drop context back down to Bigram if Trigram was pruned or missing
        prob = bigramModel[password[i + 1]][targetChar] || dynamicFallback;
      }

      trigramEntropy += -Math.log2(prob);
    }
  }

  const absoluteCeiling = 1400;
  
  const finalize = (val) => {
    if (val > absoluteCeiling || !isFinite(val)) return absoluteCeiling;
    return +val.toFixed(1);
  };

  return {
    bigramEntropy: finalize(bigramEntropy),
    trigramEntropy: finalize(trigramEntropy)
  };
}

