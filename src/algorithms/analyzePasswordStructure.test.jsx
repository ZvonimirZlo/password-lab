import { describe, test, expect, beforeEach, vi } from 'vitest';
import { analyzePasswordStructure } from './analyzePasswordStructure.jsx';
import { getChunkTrigramSurprisal } from './markovEntropy';

// Mock the Markov entropy module using Vitest's 'vi' helper
vi.mock('../algorithms/markovEntropy', () => ({
  getChunkTrigramSurprisal: vi.fn()
}));

describe('analyzePasswordStructure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('detects weak repeating chunks and flags minWindowSurprisal', () => {
    // Force low surprisal for weak chunks, high surprisal for others
    getChunkTrigramSurprisal.mockImplementation(chunk => {
      if (chunk.includes('aaaa') || chunk.includes('1234')) return 15; // Weak
      return 35; // Strong
    });

    const password = 'aaaa_secure_string';
    const result = analyzePasswordStructure(password);

    expect(result.weakestSegment).not.toBeNull();
    expect(result.minWindowSurprisal).toBeLessThan(21);
    expect(result.weakestSegment.chunk).toContain('aaaa');
  });

  test('returns safe results for strong passwords without weak triggers', () => {
    getChunkTrigramSurprisal.mockReturnValue(30);

    const password = 'X9#mP$vQ!zL';
    const result = analyzePasswordStructure(password);

    expect(result.minWindowSurprisal).toBeGreaterThanOrEqual(21);
    expect(result.structuralWeaknesses.length).toBe(0);
  });

  test('handles short passwords gracefully', () => {
    const password = 'abc'; // Shorter than default window size of 4
    const result = analyzePasswordStructure(password);

    expect(result.segments).toEqual([]);
    expect(result.weakestSegment).toBeNull();
    expect(result.minWindowSurprisal).toBe(Infinity);
  });
});