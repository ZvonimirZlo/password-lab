import { describe, it, expect } from 'vitest'
import { characterVariety } from './characterVariety'

describe('characterVariety()', () => {
  it('should handle empty strings or null/undefined inputs safely', () => {
    expect(characterVariety('')).toBe(0)
    expect(characterVariety(null)).toBe(0)
  })

  it('should handle passwords containing only spaces or whitespace', () => {
    // Ensure whitespace doesn't falsely trigger high variety scores
    expect(characterVariety('      ')).toBeLessThan(10)
  })

  it('should return 6 for a single character string', () => {
    expect(characterVariety('a')).toBe(6)
  })

  it('should give lower score for repetitive characters than complex ones', () => {
    const lowScore = characterVariety('aaaaaa')
    const highScore = characterVariety('aB3!zX9#')

    expect(lowScore).toBeLessThan(highScore)
  })

  it('should return 8 for repeated patterns three times', () => {
    expect(characterVariety('123123123')).toBe(8)
  })

  it('should return 1 for repeated characters more then 16 times', () => {
    expect(characterVariety('QQQQQQQQQQQQQQQQQ')).toBe(1)
  })

  it('should return 50 for uppercase and lowercase letters with length more than 4', () => {
    expect(characterVariety('QaWsRf')).toBe(50)
  })

  it('should return 75 for uppercase, lowercase and numbers mix with length more or equal to 4', () => {
    expect(characterVariety('Qw23')).toBe(75)
  })

  it('should return 100 for all chars included', () => {
    expect(characterVariety('A1*aW2+')).toBe(100)
  })

  it('should return 25 for non alphabet letters with length >= 4', () => {
    expect(characterVariety('アァカサ')).toBe(25)
  })
})

describe('characterVariety() performance', () => {
  it('should execute almost instantly even at the maximum 42-character limit', () => {
    // Build a complex 42-character string (the maximum allowed length)
    const maxInput = 'A1!aB2@bC3#cD4$dE5%eF6^fG7&gH8*hI9(iJ0)j'

    const startTime = performance.now()

    // Run the function
    const score = characterVariety(maxInput)

    const endTime = performance.now()
    const duration = endTime - startTime

    // Assert that it produced a valid score and finished in under 5 milliseconds
    expect(typeof score).toBe('number')
    expect(duration).toBeLessThan(5) // 5ms threshold is generous for pure logic
  })
})
