export default function markovEntropy(password, matrix) {
  if (!password || password.length === 0) return 0;
  if (!matrix) {
    console.warn("Markov Matrix missing. Returning flat character estimation.");
    return 0;
  }

  let totalEntropy = 0;
  
  // Base entropy for the first character assuming 95 printable ASCII characters
  const flatBaseProbability = 1 / 95; 
  totalEntropy -= Math.log2(flatBaseProbability);

  // Loop through character transitions
  for (let i = 0; i < password.length - 1; i++) {
    const currentChar = password[i];
    const nextChar = password[i + 1];
    if(currentChar === nextChar) continue; //doesn't add entropy for repeated chars
    let transitionProbability = 0.00001; // Fallback penalty for completely random strings

    // Look up transition in our trained dataset
    if (matrix[currentChar] && matrix[currentChar][nextChar] !== undefined) {
      transitionProbability = matrix[currentChar][nextChar] || 0.00001;
    }
    
    totalEntropy += -Math.log2(transitionProbability);
  }

  if(password.length < 12) totalEntropy *= 0.75; //reduces entropy if pass is too short

  const absoluteCeiling = 128;
  
  if(totalEntropy > absoluteCeiling) return absoluteCeiling;

  if(!isFinite(totalEntropy)) return absoluteCeiling;

  return +totalEntropy.toFixed(1);
}