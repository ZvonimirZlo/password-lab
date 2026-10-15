import compareMarkovEntropy from './markovEntropy'
import { describe, it, expect } from 'vitest'

describe('compareMarkovEntropy()', () => {
  it('should return 0 for empty input', () => {
    const result = compareMarkovEntropy('')
    expect(result.bigramEntropy).toBe(0)
    expect(result.trigramEntropy).toBe(0)
  })

  it('should return baseline entropy for a single character', () => {
    const result = compareMarkovEntropy('a')
    expect(result.bigramEntropy).toBe(7.3)
    expect(result.trigramEntropy).toBe(7.3)
  })

  //1st order chain tests
    it('should return lower output value for simple passwords than complex ones', () => {
    const resultBigramLow = compareMarkovEntropy('password123').bigramEntropy;
    const resultBigramHigh = compareMarkovEntropy('J4KlZ,_m7;{').bigramEntropy;
    expect(resultBigramLow).toBeLessThan(resultBigramHigh);
  })

    it('should return lower output value for short passwords than long ones', () => {
    const resultBigramLow = compareMarkovEntropy('123').bigramEntropy;
    const resultBigramHigh = compareMarkovEntropy('1234567890').bigramEntropy;
    expect(resultBigramLow).toBeLessThan(resultBigramHigh);
  })


  it('should return lower output for 2nd order chain than 1st order chain for repeated chars', () => {
    const resultBigram = compareMarkovEntropy(
      '111111111111111111111111111111'
    ).bigramEntropy
    const resultTrigram = compareMarkovEntropy(
      '111111111111111111111111111111'
    ).trigramEntropy
    expect(resultTrigram).toBeLessThan(resultBigram)
  })
})
