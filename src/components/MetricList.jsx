import { useMemo } from 'react'
import { FiInfo } from 'react-icons/fi'
import shannonEntropy from '../algorithms/shannonEntropy'
import markovEntropy from '../algorithms/markovEntropy'
import { characterVariety } from '../algorithms/characterVariety'
import { estimateTimeToCrack } from '../algorithms/estimateTimeToCrack.jsx'
import styles from './MetricList.module.scss'

// Added dictResult to the component props array destructurer
const MetricList = ({ password, dictResult }) => {

  const calculatedMarkovScore = useMemo(() => {
  const score = markovEntropy(password);
  return score;
}, [password]);

  const markovBarWidth = useMemo(() => {
    const MAX_TARGET_ENTROPY = 120 
    return Math.min(Math.max(Math.round((calculatedMarkovScore / MAX_TARGET_ENTROPY) * 100), 0), 100)
  }, [calculatedMarkovScore])

  // console.log(markovEntropy('password', PROD_MARKOV_MATRIX))

  const metrics = [
    {
      id: 'shannon',
      label: 'Shannon Entropy',
      score: password ? Number(shannonEntropy(password).toFixed(1)) : 0,
      unit: 'bits',
      barWidth: password
        //  for shorter passwords, the progress bar crawls more slowly, but as the entropy climbs into secure territory, the bar accelerates
        ? Math.min(Math.pow(shannonEntropy(password) / 8, 1.2) * 100, 100)
        : 0,
      description: 'Calculates the pure mathematical complexity of your character pool. It assumes every letter is completely random and independent, measuring how much theoretical effort a computer brute-force attack needs to break your keyspace.'
    },
    {
      id: 'markov',
      label: 'Markov Chain Analysis',
      score: password ? calculatedMarkovScore : 0,
      unit: 'bits',
      barWidth: password ? markovBarWidth : 0,
      description: 'Evaluates keystroke predictability based on real human typing patterns. It looks at character pairings to expose lazy keyboard walks, sequence flows, and common modifications that normal entropy math completely misses.'
    },
    {
      id: 'composition',
      label: 'Character Variety',
      score: password ? characterVariety(password) : 0,
      unit: '%',
      barWidth: password ? characterVariety(password) : 0,
      description: `Character Variety measures the range of different types of characters used. Mixing up lower, upper, numbers, and symbols exponentially increases the keyspace size.`
    },
    {
      id: 'dictionary',
      label: 'Dictionary & Pattern Check',
      // Dynamic reading from our App prop data directly!
      score: password && dictResult ? dictResult.score : 0,
      barWidth: password && dictResult ? dictResult.score : 0,
      unit: '%',
      description: `Scans passwords against known compromised words, common substitutions, and keyboard walks like "qwerty".`
    },
    {
      id: 'timetocrack',
      label: 'Time-to-Crack Estimate',
      score: password ? estimateTimeToCrack(password).text : 'Instantly',
      isTextScore: true,
      barWidth: password ? estimateTimeToCrack(password).score : 0,
      unit: 'est',
      description: `Time-to-crack divides total combinations (keyspace) by guessing speed on modern hardware.`
    },
    {
      id: 'keyspace',
      label: 'Keyspace Size',
      score: password ? Math.min(password.length * 7.5, 100) : 0,
      unit: '%',
      description: 'Measures theoretical geometric space total variants calculations.'
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
