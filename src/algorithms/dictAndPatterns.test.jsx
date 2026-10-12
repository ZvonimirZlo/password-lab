import { describe, it, expect } from 'vitest'
import {
  checkDictionaryAndPatterns,
  isBlacklistLoaded
} from './dictAndPatterns'

describe('checkDictionaryAndPatterns()', () => {
  it('should return a score of 5 for a sequence/single character string', () => {
    const result = checkDictionaryAndPatterns('a')
    expect(result.score).toBe(5)
    expect(result.status).toBe('Weak Structure')
  })

  it('should return a score of 0 for a password found in the black list', () => {
    const result = checkDictionaryAndPatterns('password')
    expect(result.score).toBe(0)
    expect(result.status).toBe('Critical Alert')
  })

  it('should return a score of 5 for a password with highly predictable layout pattern', () => {
    const result = checkDictionaryAndPatterns('rty')
    expect(result.score).toBe(5)
    expect(result.status).toBe('Weak Structure')
  })

  it('should return a score of 5 for a password with 4 or more consecutive repeating characters', () => {
    const result = checkDictionaryAndPatterns('!!!!')
    expect(result.score).toBe(5)
    expect(result.status).toBe('Weak Structure')
  })

  it('should return no error if blacklist is loaded', () => {
    const result = isBlacklistLoaded
    expect(result).toBe(true)
  })
})
