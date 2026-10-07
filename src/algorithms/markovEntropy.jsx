
import PROD_MARKOV_MATRIX from '../data/trained_matrix_mill.json';


// Calculate the absolute global pool size ONCE at file runtime
const allTrainedChars = new Set([
  ...Object.keys(PROD_MARKOV_MATRIX),
  ...Object.values(PROD_MARKOV_MATRIX).flatMap(obj => Object.keys(obj))
]);

// This dynamically captures the actual size of your global alphabet!
const globalKeyspaceSize = allTrainedChars.size; 
const dynamicFallback = 1 / globalKeyspaceSize;

export default function markovEntropy(password) {
  const matrix = PROD_MARKOV_MATRIX;
  if (!password || password.length === 0) return 0;
  if (!matrix) {
    console.warn("Markov Matrix missing. Returning flat character estimation.");
    return 0;
  }

  let totalEntropy = 0;
  
  // DYNAMIC BASELINE: Adjusts automatically to your true global pool size
  totalEntropy -= Math.log2(dynamicFallback);

  // Loop through character transitions
  for (let i = 0; i < password.length - 1; i++) {
    const currentChar = password[i];
    const nextChar = password[i + 1];
    
    if (currentChar === nextChar) continue; // Skip repeated characters
    
    let transitionProbability = dynamicFallback; 

    // Look up transition in our trained dataset
    if (matrix[currentChar] && matrix[currentChar][nextChar] !== undefined) {
      // Use the actual probability, or default to fallback if it evaluated to 0
      transitionProbability = matrix[currentChar][nextChar] || dynamicFallback;
    }
    
    totalEntropy += -Math.log2(transitionProbability);
  }

  if (password.length < 12) totalEntropy *= 0.75; // Length penalty defense

  const absoluteCeiling = 128;
  if (totalEntropy > absoluteCeiling) return absoluteCeiling;
  if (!isFinite(totalEntropy)) return absoluteCeiling;

  return +totalEntropy.toFixed(1);
}