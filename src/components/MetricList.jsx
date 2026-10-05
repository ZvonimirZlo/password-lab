import { FiInfo } from 'react-icons/fi';
import shannonEntropy from '../algorithms/shannonEntropy';
import { characterVariety } from '../algorithms/characterVariety';
import { estimateTimeToCrack } from '../algorithms/estimateTimeToCrack.jsx';
import { checkDictionaryAndPatterns } from '../algorithms/dictAndPatterns';
import styles from './MetricList.module.scss'; // Import SCSS module

const MetricList = ({ password }) => {
  const metrics = [
    {
      id: 'shannon',
      label: 'Shannon Entropy',
      score: password ? Number(shannonEntropy(password).toFixed(1)) : 0,
      unit: 'bits',
      barWidth: password
        ? Math.min(Math.pow(shannonEntropy(password) / 8, 1.2) * 100, 100)
        : 0,
      description: 'Measures randomness and unpredictability of characters.'
    },
    {
      id: 'markov',
      label: 'Markov Chain Analysis',
      score: password ? Math.min(password.length * 6, 100) : 0,
      unit: '%',
      description: 'Measures randomness and unpredictability of characters.'
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
      score: password ? checkDictionaryAndPatterns(password).score : 0,
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
      description: 'Measures randomness and unpredictability of characters.'
    }
  ];

  return (
    <div>
      {/* Comparative Progressive Bars */}
      <div className={styles.barsContainer}>
        {metrics.map(metric => {
          const calculatedWidth = typeof (metric.barWidth ?? metric.score) === 'number' 
            ? (metric.barWidth ?? metric.score) 
            : 0;

          return (
            <div key={metric.id} className={styles.metricRow}>
              <div className={styles.metricInfo}>
                <span className={styles.labelWithInfo}>
                  {metric.label}
                  <span className={styles.tooltipContainer}>
                    <FiInfo className={styles.infoIcon} />
                    <span className={styles.tooltipText}>{metric.description}</span>
                  </span>
                </span>
                <span>
                  {metric.score} {metric.unit}
                </span>
              </div>
              <div className={styles.progressTrack}>
                {/* Dynamic width stays inline, static styling moved to SCSS */}
                <div
                  className={styles.progressFill}
                  style={{ width: `${calculatedWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricList;
