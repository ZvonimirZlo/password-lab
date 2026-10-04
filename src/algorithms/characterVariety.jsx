export const characterVariety = (str) => {
  if (!str) return 0;

  let classesFound = 0;
  
  // Check the 4 standard character pools
  if (/[a-z]/.test(str)) classesFound++;
  if (/[A-Z]/.test(str)) classesFound++;
  if (/[0-9]/.test(str)) classesFound++;
  if (/[^a-zA-Z0-9]/.test(str)) classesFound++;

  // 1. Base score from class diversity (0%, 25%, 50%, 75%, 100%)
  const diversityScore = (classesFound / 4) * 100;

  // 2. Length factor: prevents short strings from getting inflated scores
  const lengthFactor = Math.min(str.length / 4, 1);

  // 3. Uniqueness factor: penalizes repeating patterns (e.g., "abcabcabc")
  const uniqueChars = new Set(str).size;
  const uniquenessFactor = uniqueChars / str.length;

  // Combine all three factors
  const finalScore = diversityScore * lengthFactor * uniquenessFactor;

  return Math.round(finalScore);
};