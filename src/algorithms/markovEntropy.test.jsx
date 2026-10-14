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
})