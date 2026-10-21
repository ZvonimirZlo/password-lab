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
  it('estimates cracking time for a weak/leaked password', () => {
    const { dictResult, result } = analyzePassword('password123')
    expect(result).toEqual({
      text: 'Instantly',
      score: dictResult.score
    })
  })

    it('detects the leet speak versions of leaked passwords', () => {
    const { dictResult, result } = analyzePassword('5cr@mbl3')
    expect(result).toEqual({
      text: 'Instantly',
      score: dictResult.score
    })
  })

  it('estimates cracking time for a weak structure password', () => {
    const { dictResult, result } = analyzePassword('acvbacvb')
    expect(result).toEqual(
      { text: '10 Seconds or Less', 
        score: dictResult.score }
    )
  })

  it('ensures a complex password takes longer to crack than a simple one', () => {
  const weak = analyzePassword('123456')
  const strong = analyzePassword('Correct-Horse-Battery-Staple-99!')

  // Assuming higher score means stronger / longer time to crack
  expect(strong.result.score).toBeGreaterThan(weak.result.score)
})

it('differentiates scrambled words from complex passwords of same length, complex passwords should get higher time', () => {
    // Note: Pass mock/actual entropy results that reflect these characteristics
    const scrambled = analyzePassword('dsoswrpa').result.text
    const complex = analyzePassword('P5ol*V=K').result.text
    expect(complex).toBe('3 hours')
    expect(scrambled).toBe('1 hours')
  })
})
