import { getCharacterDistribution } from '../algorithms/getCharacterDistribution.jsx';
import styles from './CharacterDistribution.module.scss';

const CharacterDistribution = ({ password = '' }) => {
  console.log("Current password in distribution:", password);
  
  const dist = getCharacterDistribution(password);

  return (
    <div className={styles.distributionCard}>
      <div className={styles.header}>
        <span>Character Breakdown</span>
        <span>{password.length} chars total</span>
      </div>

      {/* Stacked Bar Container (Dynamic widths kept inline) */}
      <div className={styles.barContainer}>
        <div style={{ width: `${dist.lower}%` }} className={`${styles.segment} ${styles.lower}`} title={`Lowercase: ${dist.counts.lower}`} />
        <div style={{ width: `${dist.upper}%` }} className={`${styles.segment} ${styles.upper}`} title={`Uppercase: ${dist.counts.upper}`} />
        <div style={{ width: `${dist.numbers}%` }} className={`${styles.segment} ${styles.numbers}`} title={`Numbers: ${dist.counts.numbers}`} />
        <div style={{ width: `${dist.symbols}%` }} className={`${styles.segment} ${styles.symbols}`} title={`Symbols: ${dist.counts.symbols}`} />
      </div>

      {/* Mini Legend */}
      <div className={styles.legend}>
        <span><span className={styles.lowerText}>■</span> Lower ({dist.counts.lower})</span>
        <span><span className={styles.upperText}>■</span> Upper ({dist.counts.upper})</span>
        <span><span className={styles.numbersText}>■</span> Numbers ({dist.counts.numbers})</span>
        <span><span className={styles.symbolsText}>■</span> Symbols ({dist.counts.symbols})</span>
      </div>
    </div>
  );
};

export default CharacterDistribution;