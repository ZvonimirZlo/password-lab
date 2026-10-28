import { useMemo } from 'react'
import shannonEntropy from '../algorithms/shannonEntropy'
import markovEntropy from '../algorithms/markovEntropy'
import { characterVariety } from '../algorithms/characterVariety'
import { checkDictionaryAndPatterns } from '../algorithms/dictAndPatterns'
import { estimateTimeToCrack } from '../algorithms/estimateTimeToCrack'

export function usePasswordAnalysis (password) {
  const dictResult = useMemo(
    () => checkDictionaryAndPatterns(password),
    [password]
  )

  const calculatedShannon = useMemo(
    () => (password ? shannonEntropy(password) : 0),
    [password]
  )

  const calculatedMarkov = useMemo(
    () =>
      password
        ? markovEntropy(password)
        : { bigramEntropy: 0, trigramEntropy: 0 },
    [password]
  )

  const calculatedVariety = useMemo(
    () => (password ? characterVariety(password) : 0),
    [password]
  )

  const crackEstimate = useMemo(() => {
    if (!password) return { text: 'Instantly', score: 0, warning: null }
    return estimateTimeToCrack(password, {
      bigramEntropy: calculatedMarkov.bigramEntropy,
      trigramEntropy: calculatedMarkov.trigramEntropy,
      shannonEntropy: calculatedShannon,
      isLeaked: dictResult
    })
  }, [password, calculatedMarkov, calculatedShannon, dictResult])

  return {
    dictResult,
    calculatedShannon,
    calculatedMarkov,
    calculatedVariety,
    crackEstimate,
    warning: dictResult.warning || crackEstimate.warning
  }
}
