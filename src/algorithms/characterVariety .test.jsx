import { describe, it, expect } from 'vitest';
import { characterVariety } from './characterVariety';

describe('characterVariety()', () => {
  it('should return 0 for a single character string', () => {
    expect(characterVariety('a')).toBe(6);
  });

  it('should give lower score for repetitive characters than complex ones', () => {
    const lowScore = characterVariety('aaaaaa');
    const highScore= characterVariety('aB3!zX9#');
    
    expect(lowScore).toBeLessThan(highScore);
  });
});