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
      description:
        'Calculates mathematical measure of the average uncertainty and randomness.'
    },
    {
      id: 'markov1',
      label: 'Markov Chain 1st Order (Bigram)',
      score: password ? calculatedMarkov.bigramEntropy : 0,
      unit: 'bits',
      barWidth: bigramBarWidth,
      description:
        'Analyzes pairs of consecutive characters to detect common structural habits and patterns.'
    },
    {
      id: 'markov2',
      label: 'Markov Chain 2nd Order (Trigram)',
      score: password ? calculatedMarkov.trigramEntropy : 0,
      unit: 'bits',
      barWidth: trigramBarWidth,
      description:
        'Evaluates three-character sequences to catch predictable patterns that simpler checks might miss.'
    },
    {
      id: 'composition',
      label: 'Character Variety',
      score: calculatedVariety,
      unit: '%',
      barWidth: calculatedVariety,
      description:
        'Measures the diversity of character types used, such as lowercase, uppercase, numbers, and symbols.'
    },
    {
      id: 'dictionary',
      label: 'Dictionary & Pattern Check',
      score: password && dictResult ? dictResult.score : 0,
      unit: '%',
      barWidth: dictBarWidth,
      description:
        'Scans against known compromised passwords, detects common words and leetspeak variations, and identifies predictable patterns such as keyboard walks and repeated patterns and characters.'
    },
    {
      id: 'timetocrack',
      label: 'Time-to-Crack Estimate',
      score: crackEstimate.text,
      isTextScore: true,
      barWidth: crackEstimate.score,
      unit: 'est',
      description:
        'Estimates how long a password might take to guess by evaluating its length, character diversity, structural weaknesses, and predictable patterns under assumed attack speeds.'
    }
  ]

 const getCrackColor = score => {
  if (score <= 5) return '#dc2626'
  if (score <= 10) return '#ef4444'
  if (score <= 20) return '#f97316'
  if (score <= 30) return '#fb923c'
  if (score <= 40) return '#eab308'
  if (score <= 50) return '#a3b91a'
  if (score <= 65) return '#84cc16'
  if (score <= 75) return '#65a30d'
  if (score <= 90) return '#098013'
  return '#22c5a2'
}

  return (
    <div className={styles.barsContainer}>
      {metrics.map(metric => {
        const calculatedWidth =
          typeof metric.barWidth === 'number'
            ? Math.min(Math.max(metric.barWidth, 0), 100)
            : 0

        const isCrackEstimate = metric.id === 'timetocrack'

        return (
          <div
            key={metric.id}
            className={`${styles.metricRow} ${
              isCrackEstimate ? styles.crackEstimateRow : ''
            }`}
          >
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

            <div
              className={`${styles.progressTrack} ${
                isCrackEstimate ? styles.crackEstimateTrack : ''
              }`}
            >
              <div
                className={
                  isCrackEstimate
                    ? styles.crackEstimateFill
                    : styles.progressFill
                }
                style={
                  isCrackEstimate
                    ? {
                        width: `${calculatedWidth}%`,
                        backgroundColor: getCrackColor(calculatedWidth),
                        color: getCrackColor(calculatedWidth)
                      }
                    : {
                        width: `${calculatedWidth}%`
                      }
                }
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MetricList
