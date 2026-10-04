export const estimateTimeToCrack = (password) => {
  if (!password) return { text: 'Instantly', score: 0 };

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  if (poolSize === 0) return { text: 'Instantly', score: 0 };

  // Calculate combinations safely using log10: log10(poolSize^length) = length * log10(poolSize)
  const log10Combinations = password.length * Math.log10(poolSize);

  // Assume an aggressive modern GPU guessing speed: 10 billion (1e10) hashes/second
  const guessesPerSecond = 1e10;
  const log10Speed = Math.log10(guessesPerSecond);

  // Estimated seconds in log10 scale
  const log10Seconds = log10Combinations - log10Speed;

  if (log10Seconds < 0) return { text: 'Less than a second', score: 10 };

  const seconds = Math.pow(10, log10Seconds);

  return formatTimeText(seconds, log10Combinations);
};

const formatTimeText = (seconds, log10Combinations) => {
  // We can also calculate a visual progress score (0 to 100) based on log keyspace size
  // A log10 keyspace of ~15+ is considered secure against heavy GPU rigs.
  const score = Math.min(Math.max((log10Combinations / 18) * 100, 0), 100);

  if (seconds < 1) return { text: 'Instantly', score };
  if (seconds < 60) return { text: `${Math.round(seconds)} seconds`, score };
  if (seconds < 3600) return { text: `${Math.round(seconds / 60)} minutes`, score };
  if (seconds < 86400) return { text: `${Math.round(seconds / 3600)} hours`, score };
  if (seconds < 31536000) return { text: `${Math.round(seconds / 86400)} days`, score };
  if (seconds < 31536000 * 1000) return { text: `${Math.round(seconds / 31536000)} years`, score };
  
  return { text: 'Centuries+', score: 100 };
};