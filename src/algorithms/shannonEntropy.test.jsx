import { describe, it, expect } from 'vitest';
import shannonEntropy from './shannonEntropy';

describe('shannonEntropy()', () => {
  it('should return 0 for a single character string', () => {
    expect(shannonEntropy('a')).toBe(0);
  });

  it('should give lower entropy for repetitive characters than complex ones', () => {
    const lowEntropy = shannonEntropy('aaaaaa');
    const highEntropy = shannonEntropy('aB3!zX9#');
    
    expect(lowEntropy).toBeLessThan(highEntropy);
  });
});