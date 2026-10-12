import { describe, it, expect } from 'vitest'
import { checkDictionaryAndPatterns } from './dictAndPatterns'

describe('checkDictionaryAndPatterns()', () => {
  it('should return a score of 5 for a sequence/single character string', () => {
    const result = checkDictionaryAndPatterns('a')
    expect(result.score).toBe(5)
    expect(result.status).toBe('Weak Structure')
  })
})
