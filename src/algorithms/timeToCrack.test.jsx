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
      score: 0
    })
  })

  it('should handle null or undefined input', () => {
    expect(estimateTimeToCrack(null)).toStrictEqual({
      text: 'Instantly',
      score: 0
    })
    expect(estimateTimeToCrack(undefined)).toStrictEqual({
      text: 'Instantly',
      score: 0
    })
  })

  it('should handle non-string types', () => {
    expect(estimateTimeToCrack(12345)).toStrictEqual({
      text: 'Instantly',
      score: 0
    })
    expect(estimateTimeToCrack({})).toStrictEqual({
      text: 'Instantly',
      score: 0
    })
  })

  it('should estimate strong crack times for emoji-heavy passwords', () => {
    const emojiOnly = analyzePassword('🔑🔒🚀🔥🌟💻🎯🎨')

    // Pure emoji strings should be evaluated as very secure
    expect(emojiOnly.result.score).toBeGreaterThanOrEqual(80)
  })

  it('should calculate time for accented or diacritic characters', () => {
    const asciiResult = analyzePassword('cafe')
    const unicodeResult = analyzePassword('café')

    // They should both return valid numbers
    expect(asciiResult.result.score).toBe(0)
    expect(unicodeResult.result.score).toBeGreaterThan(0)
  })

  it('should handle non-Latin character sets', () => {
    const out = analyzePassword('пивт你好マラワガ')

    expect(out.result.score).toBeGreaterThan(0)
  })

  it('estimates cracking time for a weak/leaked password', () => {
    const { dictResult, result } = analyzePassword('password123')
    expect(result).toEqual({
      text: 'Instantly',
      score: dictResult.score
    })
  })

  it('detects the simple leet speak versions of leaked passwords', () => {
    const { dictResult, result } = analyzePassword('5cr@mbl3')
    expect(result).toEqual({
      text: 'Instantly',
      score: dictResult.score
    })
  })

  it('estimates cracking time for a weak structure password', () => {
    const { dictResult, result } = analyzePassword('acvbacvb')
    expect(result).toEqual({
      text: '10 Seconds or Less',
      score: dictResult.score
    })
  })

  it('ensures a complex password takes longer to crack than a simple one', () => {
    const weak = analyzePassword('123456')
    const strong = analyzePassword('Correct-Horse-Battery-Staple-99!')

    expect(strong.result.score).toBeGreaterThan(weak.result.score)
  })

  it('differentiates scrambled words from complex passwords of same length, complex passwords should get higher time', () => {
    const scrambled = analyzePassword('dsoswrpa').result.text
    const complex = analyzePassword('P5ol*V=K').result.text

    expect(complex).toBe('3 hours')
    expect(scrambled).toBe('1 hours')
  })

  it('should return lower output for words that are not on the black list but Markov chain analysis output is much lower than scrambled version of the same word', () => {
    const scrambled = analyzePassword('luesaricPtmchaa').result.text
    const word = analyzePassword('Pharmaceuticals').result.text

    const scrambled1 = analyzePassword('Almdeecensntogkw').result.text
    const word1 = analyzePassword('Acknowledgements').result.text

    const scrambled2 = analyzePassword('rvmnziio').result.text
    const word2 = analyzePassword('zvonimir').result.text

    expect(word).toBe('4 minutes')
    expect(word1).toBe('4 minutes')
    expect(scrambled).toBe('Centuries+')
    expect(scrambled1).toBe('Centuries+')

    expect(word2).toBe('27 seconds')
    expect(scrambled2).toBe('2 hours')
  })
})
