import { useMemo } from 'react'
import { FiInfo } from 'react-icons/fi'
import styles from './MetricList.module.scss'

const MetricList = ({ password, analysis }) => {
  const maxEntropy = 400
  const {
    calculatedShannon,
    calculatedMarkov,
    calculatedVariety,
    dictResult,
    crackEstimate
  } = analysis

  // Bar width memos live right here where the bars are rendered
  const shannonBarWidth = useMemo(
    () => Math.min(Math.pow(calculatedShannon / 100, 1.2) * 100, 100),
    [calculatedShannon]
  )
  const bigramBarWidth = useMemo(
    () =>
      Math.min(
        Math.max(
          Math.round((calculatedMarkov.bigramEntropy / maxEntropy) * 100),
          0
        ),
        100
      ),
    [calculatedMarkov.bigramEntropy]
  )
  const trigramBarWidth = useMemo(
    () =>
      Math.min(
        Math.max(
          Math.round((calculatedMarkov.trigramEntropy / maxEntropy) * 100),
          0
        ),
        100
      ),
    [calculatedMarkov.trigramEntropy]
  )
  const dictBarWidth = useMemo(
    () => (password && dictResult ? dictResult.score : 0),
    [password, dictResult]
  )

  const metrics = [
    {
      id: 'shannon',
      label: 'Shannon Entropy',
      score: password ? Number(calculatedShannon.toFixed(1)) : 0,
      unit: 'bits',
      barWidth: shannonBarWidth,
      description: 'Calculates pure mathematical complexity.'
    },
    {
      id: 'markov1',
      label: 'Markov 1st Order (Bigram)',
      score: password ? calculatedMarkov.bigramEntropy : 0,
      unit: 'bits',
      barWidth: bigramBarWidth,
      description: 'Evaluates character-pair predictability.'
    },
    {
      id: 'markov2',
      label: 'Markov 2nd Order (Trigram)',
      score: password ? calculatedMarkov.trigramEntropy : 0,
      unit: 'bits',
      barWidth: trigramBarWidth,
      description: 'Evaluates 3-character rolling contexts.'
    },
    {
      id: 'composition',
      label: 'Character Variety',
      score: calculatedVariety,
      unit: '%',
      barWidth: calculatedVariety,
      description: 'Measures character types used.'
    },
    {
      id: 'dictionary',
      label: 'Dictionary & Pattern Check',
      score: password && dictResult ? dictResult.score : 0,
      unit: '%',
      barWidth: dictBarWidth,
      description: 'Scans against known compromised words.'
    },
    {
      id: 'timetocrack',
      label: 'Time-to-Crack Estimate',
      score: crackEstimate.text,
      isTextScore: true,
      barWidth: crackEstimate.score,
      unit: 'est',
      description: 'Divides total combinations by guessing speeds.'
    }
  ]

  return (
    <div className={styles.barsContainer}>
      {metrics.map(metric => {
        const calculatedWidth =
          typeof metric.barWidth === 'number' ? metric.barWidth : 0
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
  )
}

export default MetricList
