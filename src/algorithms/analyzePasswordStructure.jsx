import { getChunkTrigramSurprisal } from '../algorithms/markovEntropy';

// Shannon entropy helper 
const shannon = str => {
  if (!str || typeof str !== 'string') return 0;
  const len = str.length;
  const frequencies = str
    .split('')
    .reduce((freq, curr) => (freq[curr] = (freq[curr] || 0) + 1) && freq, {});

  return Object.values(frequencies).reduce((sum, f) => sum - (f / len) * Math.log2(f / len),0);
};

//Sliding window algorythm, analyzes and returns Markov trigram and entropy for 
// every chunk
export const analyzePasswordStructure = (pwd, windowSize = 4) => {
  let weakestSegment = null;
  let minWindowSurprisal = Infinity;
  const segments = [];

  if (pwd.length >= windowSize) {
    for (let i = 0; i <= pwd.length - windowSize; i++) {
      const chunk = pwd.substring(i, i + windowSize);
      const chunkSurprisal = getChunkTrigramSurprisal(chunk);
      const entropy = shannon(chunk);

      if (chunkSurprisal < minWindowSurprisal) {
        minWindowSurprisal = chunkSurprisal;

        let currentLength = windowSize;
        let currentChunk = chunk;
        let currentSurprisal = chunkSurprisal;

        while (i + currentLength < pwd.length) {
          const nextChar = pwd[i + currentLength];
          const prevChar = pwd[i + currentLength - 1];
          const nextChunk = pwd.substring(i, i + currentLength + 1);
          const nextSurprisal = getChunkTrigramSurprisal(nextChunk);

          if (nextChar === prevChar || nextSurprisal <= 21) {
            currentLength++;
            currentChunk = nextChunk;
            currentSurprisal = nextSurprisal;
          } else {
            break;
          }
        }

        weakestSegment = {
          index: i,
          length: currentLength,
          chunk: currentChunk,
          surprisal: currentSurprisal
        };
      }

      segments.push({
        id: i,
        chunk,
        surprisal: chunkSurprisal,
        entropy: entropy
      });
    }
  }
//Weakest chunks
  const structuralWeaknesses = segments.filter(x => x.surprisal <= 20 || x.entropy < 1.5);
  const structuralWeaknessesMild = segments.filter(x => x.surprisal < 25 && x.surprisal > 20 || x.entropy <= 1.8 && x.entropy>=1.5);
console.log(structuralWeaknessesMild);

  return {
    segments,
    weakestSegment,
    minWindowSurprisal,
    structuralWeaknesses,
    structuralWeaknessesMild
  };
};