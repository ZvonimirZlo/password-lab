import { describe, it, expect } from 'vitest'
import { estimateTimeToCrack } from './estimateTimeToCrack'
import { checkDictionaryAndPatterns } from './dictAndPatterns'
import shannonEntropy from './shannonEntropy'
import markovEntropy from './markovEntropy'

// Helper function to run the full analysis pipeline for any password
function analyzePassword (password) {
  const dictResult = checkDictionaryAndPatterns(password)
  const shannon = shannonEntropy(password)
  const markov = markovEntropy(password)

  const result = estimateTimeToCrack(password, {
    isLeaked: dictResult,
    shannonEntropy: shannon,
    bigramEntropy: markov.bigramEntropy,
    trigramEntropy: markov.trigramEntropy
  })

  return { dictResult, result }
}

describe('estimateTimeToCrack', () => {
  it('should return 0 for empty input', () => {
    expect(estimateTimeToCrack('')).toStrictEqual({
      text: 'Instantly',
      score: 0,
      warning: null,
      weakestSegment: null
    })
  })

  it('should handle null or undefined input', () => {
    expect(estimateTimeToCrack(null)).toStrictEqual({
      text: 'Instantly',
      score: 0,
      warning: null,
      weakestSegment: null
    })
    expect(estimateTimeToCrack(undefined)).toStrictEqual({
      text: 'Instantly',
      score: 0,
      warning: null,
      weakestSegment: null
    })
  })

  it('should handle non-string types', () => {
    expect(estimateTimeToCrack(12345)).toStrictEqual({
      text: 'Instantly',
      score: 0,
      warning: null,
      weakestSegment: null
    })
    expect(estimateTimeToCrack({})).toStrictEqual({
      text: 'Instantly',
      score: 0,
      warning: null,
      weakestSegment: null
    })
  })

  it('should estimate crack times for emoji-heavy passwords', () => {
    const emojiOnly = analyzePassword('🔑🔒🚀🔥🌟💻🎯🎨')

    expect(emojiOnly.result.score).toBeGreaterThan(0)
  })

  it('should calculate time for accented or diacritic characters', () => {
    const asciiResult = analyzePassword('cafe')
    const unicodeResult = analyzePassword('café')

    // They should both return valid numbers
    expect(asciiResult.result.score).toBe(0)
    expect(unicodeResult.result.score).toBe(1)
  })

  it('should handle non-Latin character sets', () => {
    const out = analyzePassword('пивт你好マラワガ')

    expect(out.result.score).toBeGreaterThan(0)
  })

  it('estimates cracking time for a weak/leaked password', () => {
    const { result } = analyzePassword('password123')
    expect(result).toEqual({ text: 'Instantly', score: 0 })
  })

  it('ensures a complex password takes longer to crack than a simple one', () => {
    const weak = analyzePassword('123456')
    const strong = analyzePassword('Correct-Horse-Battery-Staple-99!')

    expect(strong.result.score).toBeGreaterThan(weak.result.score)
  })

  it('differentiates scrambled words from complex passwords of same length, complex passwords should get higher time', () => {
    const scrambled = analyzePassword('poaswdsr').result.score
    const complex = analyzePassword('P5ol*V=K').result.score

    expect(scrambled).toBeLessThan(complex)
  })

  it('should handle long existing words', () => {
    const out = analyzePassword('Counterdemonstration')

    expect(out.result.score).toBe(1)
  })

  it('should return score 5 or less for complex passwords of length 6', () => {
    const out = analyzePassword('#lDZS1')

    expect(out.result.score).toBe(5)
  })

  it('should return score 1 for simple words of length 6', () => {
    const out = analyzePassword('expect')

    expect(out.result.score).toBe(1)
  })

  it('should return score 10 for complex passwords of length 7', () => {
    const out = analyzePassword('>6mSCgv')

    expect(out.result.score).toBe(10)
  })

  it('should return score 1 or for simple words of length 7', () => {
    const out = analyzePassword('marijan')

    expect(out.result.score).toBe(1)
  })

  it('should return score 20 for complex passwords of length 8', () => {
    const out = analyzePassword('[Cgl:=G5')

    expect(out.result.score).toBe(20)
  })

  it('should return score 1 for simple words of length 8', () => {
    const out = analyzePassword('majstori')

    expect(out.result.score).toBe(1)
  })

  it('should return score 40 or less for complex passwords of length 9', () => {
    const out = analyzePassword('0c{K5eyn{')

    expect(out.result.score).toBe(40)
  })

  it('should return score 65 or less for complex passwords of length 10', () => {
    const out = analyzePassword('FOx}Pk6r}p')

    expect(out.result.score).toBe(65)
  })

  it('should ignore compromised part of the password when calculating', () => {
    const resultWithWeak = analyzePassword('G$d?9spasswordWN').result.score
    const resultWithoutWeak = analyzePassword('G$d?9sWN').result.score
    expect(resultWithWeak).toEqual(resultWithoutWeak)
  })

  it('should ignore keyboard walks when calculating', () => {
    const resultWithWalk = analyzePassword('bPl9+eijnlt').result.score
    const resultWithoutWalk = analyzePassword('bPl9+elt').result.score
    expect(resultWithWalk).toEqual(resultWithoutWalk)
  })

  it('should ignore repeated characters when calculating', () => {
    const resultWithRepeated = analyzePassword('lW{!7%/////////////////////E-')
      .result.score
    const resultWithoutrepeated = analyzePassword('lW{!7%E-').result.score
    expect(resultWithRepeated).toEqual(resultWithoutrepeated)
  })

  it('should ignore predictable parts with low Markov chain analysis when calculating', () => {
    const resultWithRepeated = analyzePassword(';64BmforkpjS').result.score
    const resultWithoutrepeated = analyzePassword(';64BmpjS').result.score
    expect(resultWithRepeated).toEqual(resultWithoutrepeated)
  })

  it('should ignore parts with low Shannon entropy analysis when calculating', () => {
    const resultWithLowEntropy = analyzePassword('q(.2WiiW1*dD').result.score
    const resultWithHighEntropy = analyzePassword('q(.21*dD').result.score
    expect(resultWithLowEntropy).toEqual(resultWithHighEntropy)
  })

  it('should ignore repeated chatacters, leaked passwords, keyboard walks and repeated words when calculating', () => {
    const resultPoluted = analyzePassword('pass$wakewake6zzzP2pwsxXj0').result.score
    const resultClean = analyzePassword('$6P2pXj0').result.score
    expect(resultPoluted).toEqual(resultClean)
  })
    it('should ignore whitespaces when calculating', () => {
    const resultWithSpaces = analyzePassword('            ^K            >c8             (K            w').result.score
    const resultClean = analyzePassword('^K>c8(Kw').result.score
    expect(resultWithSpaces).toEqual(resultClean)
  })
})

// =======================
// PERFORMANCE TEST
// =======================
describe('estimateTimeToCrack() performance', () => {
  it('should execute under 25 ms even at the maximum character limit', () => {
    const maxInput =
      '6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie2'
    const startTime = performance.now()
    const { result } = analyzePassword(maxInput)
    const endTime = performance.now()
    const duration = endTime - startTime

    expect(typeof result.score).toBe('number')
    expect(duration).toBeLessThan(25)
  })
})
