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

  it('should handle emojis correctly without NaN or errors', () => {
    const result = compareMarkovEntropy('😀🚀🔥😀🚀🔥')
    expect(result.bigramEntropy).toBeGreaterThan(0)
    expect(result.trigramEntropy).toBeGreaterThan(0)
  })

  it('should calculate entropy for accented or diacritic characters', () => {
    const asciiResult = compareMarkovEntropy('cafe')
    const unicodeResult = compareMarkovEntropy('café')

    // They should both return valid numbers
    expect(asciiResult.bigramEntropy).toBeGreaterThan(0)
    expect(unicodeResult.bigramEntropy).toBeGreaterThan(0)
  })

  it('should handle non-Latin character sets', () => {
    const result = compareMarkovEntropy('пивт你好123マラワガ')
    expect(result.bigramEntropy).toBeGreaterThan(0)
    expect(result.trigramEntropy).toBeGreaterThan(0)
  })

  // ====================
  //1st order chain tests
  // ====================
  it('should return lower output value for simple passwords than complex ones', () => {
    const resultBigramLow = compareMarkovEntropy('password123').bigramEntropy
    const resultBigramHigh = compareMarkovEntropy('J4KlZ,_m7;{').bigramEntropy
    expect(resultBigramLow).toBeLessThan(resultBigramHigh)
  })

  it('should return lower output value for short passwords than long ones', () => {
    const resultBigramLow = compareMarkovEntropy('123').bigramEntropy
    const resultBigramHigh = compareMarkovEntropy('1234567890').bigramEntropy
    expect(resultBigramLow).toBeLessThan(resultBigramHigh)
  })

  it('should not return same result for any sequence of repeated lowercase letters', () => {
    const resultBigramOne = compareMarkovEntropy('aaaaaaaaaa').bigramEntropy
    const resultBigramTwo = compareMarkovEntropy('kkkkkkkkkk').bigramEntropy
    expect(resultBigramOne).not.toEqual(resultBigramTwo)
  })

  it('should not return same result for any sequence of repeated uppercase letters', () => {
    const resultBigramOne = compareMarkovEntropy('XXXXXXXXXX').bigramEntropy
    const resultBigramTwo = compareMarkovEntropy('LLLLLLLLLL').bigramEntropy
    expect(resultBigramOne).not.toEqual(resultBigramTwo)
  })

  it('should not return same result for any sequence of repeated numbers', () => {
    const resultBigramOne = compareMarkovEntropy('111111111').bigramEntropy
    const resultBigramTwo = compareMarkovEntropy('555555555').bigramEntropy
    expect(resultBigramOne).not.toEqual(resultBigramTwo)
  })

  it('should not return same result for any sequence of repeated symbols', () => {
    const resultBigramOne = compareMarkovEntropy('..........').bigramEntropy
    const resultBigramTwo = compareMarkovEntropy('^^^^^^^^^^').bigramEntropy
    expect(resultBigramOne).not.toEqual(resultBigramTwo)
  })

  // ====================
  //2nd order chain tests
  // ====================
  it('should return lower output value for simple passwords than complex ones', () => {
    const resultTrigramLow = compareMarkovEntropy('password123').trigramEntropy
    const resultTrigramHigh = compareMarkovEntropy('J4KlZ,_m7;{').trigramEntropy
    expect(resultTrigramLow).toBeLessThan(resultTrigramHigh)
  })

  it('should return lower output value for short passwords than long ones', () => {
    const resultTrigramLow = compareMarkovEntropy('123').trigramEntropy
    const resultTrigramHigh = compareMarkovEntropy('1234567890').trigramEntropy
    expect(resultTrigramLow).toBeLessThan(resultTrigramHigh)
  })

  it('should not return same result for any sequence of repeated lowercase letters', () => {
    const resultTrigramOne = compareMarkovEntropy('aaaaaaaaaa').trigramEntropy
    const resultTrigramTwo = compareMarkovEntropy('kkkkkkkkkk').trigramEntropy
    expect(resultTrigramOne).not.toEqual(resultTrigramTwo)
  })

  it('should not return same result for any sequence of repeated uppercase letters', () => {
    const resultTrigramOne = compareMarkovEntropy('XXXXXXXXXX').trigramEntropy
    const resultTrigramTwo = compareMarkovEntropy('LLLLLLLLLL').trigramEntropy
    expect(resultTrigramOne).not.toEqual(resultTrigramTwo)
  })

  it('should not return same result for any sequence of repeated numbers', () => {
    const resultTrigramOne = compareMarkovEntropy('111111111').trigramEntropy
    const resultTrigramTwo = compareMarkovEntropy('555555555').trigramEntropy
    expect(resultTrigramOne).not.toEqual(resultTrigramTwo)
  })

  it('should not return same result for any sequence of repeated symbols', () => {
    const resultTrigramOne = compareMarkovEntropy('..........').trigramEntropy
    const resultTrigramTwo = compareMarkovEntropy('^^^^^^^^^^').trigramEntropy
    expect(resultTrigramOne).not.toEqual(resultTrigramTwo)
  })

  it('should return result less than 10 bits for sequence of repeated symbols', () => {
    const result = compareMarkovEntropy(
      '???????????????????????????????????????'
    ).trigramEntropy
    expect(result).toBeLessThan(10)
  })

  // ==============================
  //  Bigram and trigram compared
  // ==============================

  it('should return lower output for 2nd order chain than 1st order chain for repeated chars', () => {
    const resultBigram = compareMarkovEntropy('1'.repeat(100)).bigramEntropy
    const resultTrigram = compareMarkovEntropy('1'.repeat(100)).trigramEntropy
    expect(resultTrigram).toBeLessThan(resultBigram)
  })

  it('should return lower output for 2nd order chain than 1st order chain for repeated patterns', () => {
    const resultBigram = compareMarkovEntropy(
      'password123password123password123'
    ).bigramEntropy
    const resultTrigram = compareMarkovEntropy(
      'password123password123password123'
    ).trigramEntropy
    expect(resultTrigram).toBeLessThan(resultBigram)
  })

  it('should return lower output for 2nd order chain than 1st order chain for simple password', () => {
    const resultBigram = compareMarkovEntropy('password123').bigramEntropy
    const resultTrigram = compareMarkovEntropy('password123').trigramEntropy
    expect(resultTrigram).toBeLessThan(resultBigram)
  })

  it('should return higher output for 2nd order chain than 1st order chain for complex password', () => {
    const resultBigram = compareMarkovEntropy(
      '}%T>SB[4v+zVZju%H5HJ8M;A_C8pJ*+RYz!OB.I=mV'
    ).bigramEntropy
    const resultTrigram = compareMarkovEntropy(
      '}%T>SB[4v+zVZju%H5HJ8M;A_C8pJ*+RYz!OB.I=mV'
    ).trigramEntropy
    expect(resultBigram).toBeLessThan(resultTrigram)
  })
})


//Performance tests
describe('compareMarkovEntropy() bigramEntropy performance', () => {
  it('should execute almost instantly even at the maximum character limit', () => {  
    const maxInput = '6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie2'
    const startTime = performance.now()

    const score = compareMarkovEntropy(maxInput).bigramEntropy

    const endTime = performance.now()
    const duration = endTime - startTime

    expect(typeof score).toBe('number')
    expect(duration).toBeLessThan(5) // 5ms threshold 
  })
})

describe('compareMarkovEntropy() trigramEntropy performance', () => {
  it('should execute almost instantly even at the maximum character limit', () => {  
    const maxInput = '6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie2'
    const startTime = performance.now()

    const score = compareMarkovEntropy(maxInput).trigramEntropy

    const endTime = performance.now()
    const duration = endTime - startTime

    expect(typeof score).toBe('number')
    expect(duration).toBeLessThan(5) // 5ms threshold 
  })
})
