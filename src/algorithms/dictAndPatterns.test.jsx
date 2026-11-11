import { describe, it, expect } from 'vitest'
import {
  checkDictionaryAndPatterns,
  isBlacklistLoaded
} from './dictAndPatterns'

describe('checkDictionaryAndPatterns()', () => {
  it('should handle emojis correctly without NaN or errors', () => {
    const result = checkDictionaryAndPatterns('😀🚀🔥😀🚀🔥')

    expect(result.status).toBe('Weak Structure')
  })

  it('should work for accented or diacritic characters', () => {
    const asciiResult = checkDictionaryAndPatterns('cafe').score
    const unicodeResult = checkDictionaryAndPatterns('café').score

    // They should both return valid numbers
    expect(asciiResult).toBe(0) //because it's found on blacklist
    expect(unicodeResult).toBeGreaterThan(0)
  })

  it('should handle non-Latin character sets', () => {
    const result = checkDictionaryAndPatterns('пивт你好マラワガ')

    expect(result.status).toBe('Clear')
  })

  it('should return a score of 0 for a password found in the black list', () => {
    const result = checkDictionaryAndPatterns('password')
    expect(result.score).toBe(0)
    expect(result.status).toBe('Critical Alert')
  })

  it('should return a score of 0 for a normalized leetspeak password found in the black list', () => {
    const result = checkDictionaryAndPatterns('|24$$W0|?|)')
    expect(result.score).toBe(0)
    expect(result.status).toBe('Critical Alert')
  })

  it('should detect if portion of password is found on the global blacklist of compromised credentials', () => {
    const result = checkDictionaryAndPatterns('G$d?9spasswordWN')
    expect(result.status).toBe('Weak Structure')
    expect(result.warning).toBe(
      '⚠️ Detected: "password" This password or a portion of it was found on the global blacklist of compromised credentials.'
    )
  })

  it('should detect if leetspeak variation of the password was found on the global blacklist', () => {
    const result = checkDictionaryAndPatterns('|2@55W0|?|)') //Word password
    expect(result.status).toBe('Critical Alert')
    expect(result.score).toBe(0)
    expect(result.warning).toBe(
      '⚠️ A leetspeak variation of this password was found on the global blacklist.'
    )
  })

  it('should return a status Weak Structure for a password with horizontal keyboard walk pattern', () => {
    const result = checkDictionaryAndPatterns('rty')
    expect(result.status).toBe('Weak Structure')
  })

  it('should return a status Weak Structure for a password with reversed horizontal keyboard walk pattern', () => {
    const result = checkDictionaryAndPatterns('bvcx')
    expect(result.status).toBe('Weak Structure')
  })

  it('should return a status Weak Structure for a password with diagonal keyboard walk pattern', () => {
    const result = checkDictionaryAndPatterns('4rfv')
    const result1 = checkDictionaryAndPatterns('8uhb')
    expect(result.status).toBe('Weak Structure')
    expect(result1.status).toBe('Weak Structure')
  })

  it('should return a status Weak Structure for a password with reversed diagonal keyboard walk pattern', () => {
    const result = checkDictionaryAndPatterns('cde')
    const result1 = checkDictionaryAndPatterns('mko0')
    expect(result.status).toBe('Weak Structure')
    expect(result1.status).toBe('Weak Structure')
  })

  it('should return status Weak Structure for a password with 4 or more consecutive repeating characters', () => {
    const result = checkDictionaryAndPatterns('****')
    expect(result.status).toBe('Weak Structure')
  })

  it('should return status Weak Structure for a password with repeated pattern of two letters', () => {
    const result = checkDictionaryAndPatterns('!!asas^1!')
    expect(result.status).toBe('Weak Structure')
  })

  it('should return status Weak Structure for a password with repeated pattern of three letters', () => {
    const result = checkDictionaryAndPatterns('!!asdasd^1!')
    expect(result.status).toBe('Weak Structure')
  })

  it('should return a status Weak Structure for a password with repeated pattern of four chars', () => {
    const result = checkDictionaryAndPatterns('!1!12341234^1!')
    expect(result.status).toBe('Weak Structure')
  })

  it('should return no error if blacklist is loaded', () => {
    const result = isBlacklistLoaded
    expect(result).toBe(true)
  })
})

describe('checkDictionaryAndPatterns() performance', () => {
  it('should execute under 20 ms at the maximum character limit', () => {
    const maxInput =
      '6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie21<=C(05&MJ-{ch=SH+z6%,ie2'
    const startTime = performance.now()

    const score = checkDictionaryAndPatterns(maxInput)

    const endTime = performance.now()
    const duration = endTime - startTime

    expect(typeof score.score).toBe('number')
    expect(duration).toBeLessThan(20) // 20ms threshold
  })
})
