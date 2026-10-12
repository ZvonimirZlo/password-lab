import { describe, it, expect } from 'vitest'
import { characterVariety } from './characterVariety'

describe('characterVariety()', () => {
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
