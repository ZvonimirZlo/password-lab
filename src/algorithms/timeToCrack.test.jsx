import { describe, it, expect } from 'vitest'

import { estimateTimeToCrack } from './estimateTimeToCrack'
import { checkDictionaryAndPatterns } from './dictAndPatterns'
import shannonEntropy from './shannonEntropy'
import markovEntropy from './markovEntropy'

describe('estimateTimeToCrack', () => {
  it('estimates cracking time using actual password analysis', () => {
    const password = 'password'

    // Run the same algorithms used by the application
    const dictResult = checkDictionaryAndPatterns(password)
    const shannon = shannonEntropy(password)
    const markov = markovEntropy(password)

    // Pass their results into the estimator
    const result = estimateTimeToCrack(password, {
      isLeaked: dictResult,
      shannonEntropy: shannon,
      bigramEntropy: markov.bigramEntropy,
      trigramEntropy: markov.trigramEntropy
    })

    // Verify the appropriate guard clause
    if (dictResult.status === 'Critical Alert') {
      expect(result).toEqual({
        text: 'Instantly',
        score: dictResult.score
      })
    } else if (dictResult.status === 'Weak Structure') {
      expect(result).toEqual({
        text: 'Less than 10 seconds',
        score: dictResult.score
      })
    } else {
      expect(result).toHaveProperty('text')
      expect(result).toHaveProperty('score')
    }
  })
})


