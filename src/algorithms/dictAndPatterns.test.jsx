import { describe, it, expect } from 'vitest'
import {
  checkDictionaryAndPatterns,
  isBlacklistLoaded
} from './dictAndPatterns'

describe('checkDictionaryAndPatterns()', () => {
  it('should return a score of 0 for a sequence/single character string', () => {
    const result = checkDictionaryAndPatterns('a')
    expect(result).toBe(0)
  })

  it('should handle emojis correctly without NaN or errors', () => {
    const result = checkDictionaryAndPatterns('😀🚀🔥😀🚀🔥')

    expect(result.score).toBeGreaterThan(0)
  })

  it('should work for accented or diacritic characters', () => {
    const asciiResult = checkDictionaryAndPatterns('cafe').score
    const unicodeResult = checkDictionaryAndPatterns('café').score

    // They should both return valid numbers
    expect(asciiResult).toBe(0) //because it's found on blacklist
    expect(unicodeResult).toBeGreaterThan(0)
  })

  it('should handle non-Latin character sets', () => {
    const result = checkDictionaryAndPatterns('пивт你好123マラワガ')

    expect(result.score).toBeGreaterThan(0)
  })

  it('should return a score of 0 for a password found in the black list', () => {
    const result = checkDictionaryAndPatterns('password')
    expect(result.score).toBe(0)
    expect(result.status).toBe('Critical Alert')
  })

  it('should return a score of 0 for a normalized leetspeak password found in the black list', () => {
    const result = checkDictionaryAndPatterns('p@ssw0rd')
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

  it('should return a score of 5 for a password with repeated pattern of two letters', () => {
    const result = checkDictionaryAndPatterns('!!asas^1!')
    expect(result.score).toBe(5)
    expect(result.status).toBe('Weak Structure')
  })

  it('should return a score of 5 for a password with repeated pattern of three letters', () => {
    const result = checkDictionaryAndPatterns('!!asdasd^1!')
    expect(result.score).toBe(5)
    expect(result.status).toBe('Weak Structure')
  })

  it('should return a score of 5 for a password with repeated pattern of four letters', () => {
    const result = checkDictionaryAndPatterns('!1!12341234^1!')
    expect(result.score).toBe(5)
    expect(result.status).toBe('Weak Structure')
  })

  it('should return no error if blacklist is loaded', () => {
    const result = isBlacklistLoaded
    expect(result).toBe(true)
  })
})

describe('checkDictionaryAndPatterns() performance', () => {
  it('should execute almost instantly even at the maximum character limit', () => {
    const maxInput =
      '6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie2'
    const startTime = performance.now()

    const score = checkDictionaryAndPatterns(maxInput)

    const endTime = performance.now()
    const duration = endTime - startTime

    expect(typeof score.score).toBe('number')
    expect(duration).toBeLessThan(5) // 5ms threshold
  })
})
