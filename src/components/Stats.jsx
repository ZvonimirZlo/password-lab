import { PieChart } from '@mui/x-charts/PieChart'
import styles from './Stats.module.scss'



const Stats = ({ password = '' }) => {
  const len = password.length;
  const upper = (password.match(/[A-Z]/g) || []).length 
  const lower = (password.match(/[a-z]/g) || []).length
  const nums = (password.match(/[0-9]/g) || []).length
  const sym = (password.match(/[^A-Za-z0-9]/g) || []).length
  const unique = new Set(password).size
  // const cyril = (password.match(/\p{Script=Cyrillic}/u) || []).length
  // const jap = (password.match(/[\p{Script=Hiragana}\p{Script=Katakana}]/u) || []).length
  // const chn = (password.match(/\p{Script=Han}/u) || []).length

let pool = 0

//Standard Latin keyboards
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/[0-9]/.test(password)) pool += 10
  if (/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(password)) pool += 33
  
//Non-Latin
  if (/\p{Script=Cyrillic}/u.test(password)) pool += 33
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(password)) pool += 80
  if (/\p{Script=Han}/u.test(password)) pool += 2500

  const combinations = BigInt(pool) ** BigInt(len);
const formatScientific = (value, precision = 2) => {
  if (value === 0n) return '0';

  const str = value.toString();
  const exponent = str.length - 1;

  if (exponent === 0) return str;

  const decimals = str
    .slice(1, precision + 1)
    .padEnd(precision, '0');

  return `${str[0]}.${decimals} × 10${toSuperscript(exponent)}`;
};

const toSuperscript = (num) => {
  const superscriptDigits = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³',
    '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷',
    '8': '⁸', '9': '⁹', '-': '⁻'
  };

  return String(num)
    .split('')
    .map(char => superscriptDigits[char] || char)
    .join('');
};


  const stats = {
    length: len,
    upper: upper,
    lower: lower,
    numbers: nums,
    symbols: sym,
    unique: unique,
    combo: combinations
  }

  // Data formatted for MUI PieChart using your exact dashboard color palette
  const chartData = [
    { id: 'lower', value: stats.lower, label: 'Lower', color: '#0f61cc' },
    { id: 'upper', value: stats.upper, label: 'Upper', color: '#34d399' },
    { id: 'numbers', value: stats.numbers, label: 'Numbers', color: '#fbbf24' },
    { id: 'symbols', value: stats.symbols, label: 'Symbols', color: '#f87171' }
  ].filter(item => item.value > 0) // Only show slices if count > 0

  return (
    <div className={styles.statsWrapper}>
      {/* Top Numeric Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Length</span>
          <strong>{stats.length}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Unique</span>
          <strong>{stats.unique}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Uppercase</span>
          <strong>{stats.upper}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Lowercase</span>
          <strong>{stats.lower}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Numbers</span>
          <strong>{stats.numbers}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Symbols</span>
          <strong>{stats.symbols}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Combinations</span>
          <strong>{formatScientific(stats.combo)}</strong>
        </div>
      </div>

      {/* Integrated Doughnut Chart for Character Distribution */}
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <span>Character Distribution</span>
          <span>{stats.length} chars</span>
        </div>

        {stats.length > 0 ? (
          <div className={styles.pieWrapper}>
            <PieChart
              series={[
                {
                  data: chartData,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: 'gray'
                  }
                }
              ]}
              slotProps={{
                legend: {
                  sx: {
                    // Targets the text color of the legend labels
                    '& .MuiChartsLegend-label': {
                      color: '#94a3b8'
                    }
                  }
                }
              }}
              height={200}
              width={200}
            />
          </div>
        ) : (
          <div className={styles.emptyState}>
            Type or generate a password to view distribution
          </div>
        )}
      </div>
    </div>
  )
}

export default Stats

