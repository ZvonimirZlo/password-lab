import { describe, it, expect } from 'vitest'
import { generateSecurePassword } from './generateSecurePassword'

describe('generateSecurePassword()', () => {
  it('should include at least one lowercase letter', () => {
    const result = generateSecurePassword()
    expect(/[a-z]/.test(result)).toBe(true)
  })
  it('should include at least one uppercase letter', () => {
    const result = generateSecurePassword()
    expect(/[A-Z]/.test(result)).toBe(true)
  })
  it('should include at least one number', () => {
    const result = generateSecurePassword()
    expect(/[0-9]/.test(result)).toBe(true)
  })
  it('should include at least one symbol', () => {
    const result = generateSecurePassword()
    expect(/[^a-zA-Z0-9]/.test(result)).toBe(true)
  })
  it('should generate a password of the requested length', () => {
    const result = generateSecurePassword({ length: 20 })
    expect(result).toHaveLength(20)
  })

  it('should respect the minimum length limit of 8', () => {
    const result = generateSecurePassword({ length: 8 })
    expect(result).toHaveLength(8)
  })

  it('should respect the maximum length limit of 256', () => {
    const result = generateSecurePassword({ length: 256 })
    expect(result).toHaveLength(256)
  })

it('should accept custom lengths below 8 if requested', () => {
    const result = generateSecurePassword({ length: 7 })
    expect(result).toHaveLength(7)
  })

  it('should accept custom lengths above 256 if requested', () => {
    const result = generateSecurePassword({ length: 257 })
    expect(result).toHaveLength(257)
  })
})

// const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
// const nums = '0123456789'
// const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
