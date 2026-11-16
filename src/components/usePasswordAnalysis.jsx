import { useMemo } from 'react'
import shannonEntropy from '../algorithms/shannonEntropy'
import markovEntropy from '../algorithms/markovEntropy'
import { characterVariety } from '../algorithms/characterVariety'
import { checkDictionaryAndPatterns } from '../algorithms/dictAndPatterns'
import { estimateTimeToCrack } from '../algorithms/estimateTimeToCrack'

//All algorythms calculated and ready to use
export function usePasswordAnalysis (password) {
  const dictResult = useMemo(
    () => checkDictionaryAndPatterns(password),
    [password]
  )
//Shannon entropy calculation
  const calculatedShannon = useMemo(
    () => (password ? shannonEntropy(password) : 0),
    [password]
  )
//Markov chain calculations
  const calculatedMarkov = useMemo(
    () =>
      password
        ? markovEntropy(password)
        : { bigramEntropy: 0, trigramEntropy: 0 },
    [password]
  )
//Chars variety 
  const calculatedVariety = useMemo(
    () => (password ? characterVariety(password) : 0),
    [password]
  )
//Estimate time to crack algorythm
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
