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

describe('shannonEntropy() performance', () => {
  it('should execute almost instantly even at the maximum character limit', () => {  
    const maxInput = '6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie2'
    const startTime = performance.now()

    // Run the function
    const score = shannonEntropy(maxInput)

    const endTime = performance.now()
    const duration = endTime - startTime

    // Assert that it produced a valid score and finished in under 5 milliseconds
    expect(typeof score).toBe('number')
    expect(duration).toBeLessThan(5) // 5ms threshold 
  })
})