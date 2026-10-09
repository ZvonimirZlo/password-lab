import PROD_MARKOV_DATA from '../data/trained_matrix_mill23opt.json';

// Extract both trained models from the single shared JSON asset
const { bigramModel, trigramModel } = PROD_MARKOV_DATA;

// Compute a dynamic global fallback based on your unique training alphabet
const allTrainedChars = new Set([
  ...Object.keys(bigramModel),
  ...Object.values(bigramModel).flatMap(obj => Object.keys(obj))
]);
const globalKeyspaceSize = allTrainedChars.size || 95; // Default fallback to standard printable ASCII size
const dynamicFallback = 1 / globalKeyspaceSize;

// /**
//  * Calculates both Bigram and Trigram entropy side-by-side using a shared dataset.
//  * @param {string} password 
//  * @returns {{ bigramEntropy: number, trigramEntropy: number }}
//  */
export default function compareMarkovEntropy(password) {
  if (!password || password.length === 0) {
    return { bigramEntropy: 0, trigramEntropy: 0 };
  }

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

  // ----------------------------------------------------
  // Defense & Safety Adjustments (Applied symmetrically)
  // ----------------------------------------------------
  // if (password.length < 12) {
  //   bigramEntropy *= 0.75;
  //   trigramEntropy *= 0.75;
  // }

  const absoluteCeiling = 400;
  
  const finalize = (val) => {
    if (val > absoluteCeiling || !isFinite(val)) return absoluteCeiling;
    return +val.toFixed(1);
  };

  return {
    bigramEntropy: finalize(bigramEntropy),
    trigramEntropy: finalize(trigramEntropy)
  };
}






// import PROD_MARKOV_MATRIX from '../data/trained_matrix_mill.json';


// // Calculate the absolute global pool size ONCE at file runtime
// const allTrainedChars = new Set([
//   ...Object.keys(PROD_MARKOV_MATRIX),
//   ...Object.values(PROD_MARKOV_MATRIX).flatMap(obj => Object.keys(obj))
// ]);

// // This dynamically captures the actual size of your global alphabet!
// const globalKeyspaceSize = allTrainedChars.size; 
// const dynamicFallback = 1 / globalKeyspaceSize;

// export default function markovEntropy(password) {
//   const matrix = PROD_MARKOV_MATRIX;
//   if (!password || password.length === 0) return 0;
//   if (!matrix) {
//     console.warn("Markov Matrix missing. Returning flat character estimation.");
//     return 0;
//   }

//   let totalEntropy = 0;
  
//   // DYNAMIC BASELINE: Adjusts automatically to your true global pool size
//   totalEntropy -= Math.log2(dynamicFallback);

//   // Loop through character transitions
//   for (let i = 0; i < password.length - 1; i++) {
//     const currentChar = password[i];
//     const nextChar = password[i + 1];
    
//     if (currentChar === nextChar) continue; // Skip repeated characters
    
//     let transitionProbability = dynamicFallback; 

//     // Look up transition in our trained dataset
//     if (matrix[currentChar] && matrix[currentChar][nextChar] !== undefined) {
//       // Use the actual probability, or default to fallback if it evaluated to 0
//       transitionProbability = matrix[currentChar][nextChar] || dynamicFallback;
//     }
    
//     totalEntropy += -Math.log2(transitionProbability);
//   }

//   if (password.length < 12) totalEntropy *= 0.75; // Length penalty defense

//   const absoluteCeiling = 128;
//   if (totalEntropy > absoluteCeiling) return absoluteCeiling;
//   if (!isFinite(totalEntropy)) return absoluteCeiling;

//   return +totalEntropy.toFixed(1);
// }



// Training corpus stability The first-order transition model was trained against progressively larger 
// leaked-password corpora. A 100k-password corpus produced noticeably more optimistic surprise estimates. 
// Increasing the corpus to 1M produced substantially more stable and realistic results. Further expansion to 10M and 100M 
// passwords produced effectively identical application-level results. Based on this empirical comparison, the 1M corpus was 
// selected as the operational training dataset.