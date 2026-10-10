import { useMemo } from 'react'
import { FiInfo } from 'react-icons/fi'
import shannonEntropy from '../algorithms/shannonEntropy'
import markovEntropy from '../algorithms/markovEntropy'
import { characterVariety } from '../algorithms/characterVariety'
import { estimateTimeToCrack } from '../algorithms/estimateTimeToCrack.jsx'
import styles from './MetricList.module.scss'


const MetricList = ({ password, dictResult }) => {
  // Calculate both Markov orders from the returned object
  const calculatedMarkov = useMemo(() => {
    if (!password) return { bigramEntropy: 0, trigramEntropy: 0 }
    return markovEntropy(password)
  }, [password])

  const maxEntropy = 400

  const bigramBarWidth = useMemo(() => {
    return Math.min(
      Math.max(
        Math.round((calculatedMarkov.bigramEntropy / maxEntropy) * 100),
        0
      ),
      100
    )
  }, [calculatedMarkov.bigramEntropy])

  const trigramBarWidth = useMemo(() => {
    return Math.min(
      Math.max(
        Math.round((calculatedMarkov.trigramEntropy / maxEntropy) * 100),
        0
      ),
      100
    )
  }, [calculatedMarkov.trigramEntropy])

  const crackEstimate = useMemo(() => {
    if (!password) return { text: 'Instantly', score: 0 }

    return estimateTimeToCrack(password, {
      bigramEntropy: calculatedMarkov.bigramEntropy,
      trigramEntropy: calculatedMarkov.trigramEntropy,
      shannonEntropy: shannonEntropy(password),
      isLeaked: dictResult
    })
  }, [password, calculatedMarkov, dictResult])

  const metrics = [
    {
      id: 'shannon',
      label: 'Shannon Entropy',
      score: password ? Number(shannonEntropy(password).toFixed(1)) : 0,
      unit: 'bits',
      barWidth: password
        ? Math.min(Math.pow(shannonEntropy(password) / 8, 1.2) * 100, 100)
        : 0,
      description:
        'Calculates the pure mathematical complexity of your character pool, assuming every character is completely random and independent.'
    },
    {
      id: 'markov1',
      label: 'Markov 1st Order (Bigram)',
      score: password ? calculatedMarkov.bigramEntropy : 0,
      unit: 'bits',
      barWidth: password ? bigramBarWidth : 0,
      description:
        'Evaluates character-pair predictability based on real human typing patterns to expose simple keyboard walks and sequence flows.'
    },
    {
      id: 'markov2',
      label: 'Markov 2nd Order (Trigram)',
      score: password ? calculatedMarkov.trigramEntropy : 0,
      unit: 'bits',
      barWidth: password ? trigramBarWidth : 0,
      description:
        'Evaluates 3-character rolling contexts for advanced pattern analysis, capturing complex human habits and common sub-word structures.'
    },
    {
      id: 'composition',
      label: 'Character Variety',
      score: password ? characterVariety(password) : 0,
      unit: '%',
      barWidth: password ? characterVariety(password) : 0,
      description:
        'Measures the range of different character types used (lowercase, uppercase, numbers, symbols).'
    },
    {
      id: 'dictionary',
      label: 'Dictionary & Pattern Check',
      score: password && dictResult ? dictResult.score : 0,
      barWidth: password && dictResult ? dictResult.score : 0,
      unit: '%',
      description:
        'Scans passwords against known compromised words, common substitutions, and keyboard walks.'
    },
    {
      id: 'timetocrack',
      label: 'Time-to-Crack Estimate',
      score: crackEstimate.text,
      isTextScore: true,
      barWidth: crackEstimate.score,
      unit: 'est',
      description:
        'Divides total combinations (keyspace) by modern hardware guessing speeds.'
    }
  ]


  return (
    <div>
      <div className={styles.barsContainer}>
        {metrics.map(metric => {
          const calculatedWidth =
            typeof (metric.barWidth ?? metric.score) === 'number'
              ? metric.barWidth ?? metric.score
              : 0

          return (
            <div key={metric.id} className={styles.metricRow}>
              <div className={styles.metricInfo}>
                <span className={styles.labelWithInfo}>
                  {metric.label}
                  <span className={styles.tooltipContainer}>
                    <FiInfo className={styles.infoIcon} />
                    <span className={styles.tooltipText}>
                      {metric.description}
                    </span>
                  </span>
                </span>
                <span>
                  {metric.score} {metric.unit}
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${calculatedWidth}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MetricList
