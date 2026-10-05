import { PieChart } from '@mui/x-charts/PieChart';
import styles from './Stats.module.scss';

const Stats = ({ password = '' }) => {
  const stats = {
    length: password.length,
    upper: (password.match(/[A-Z]/g) || []).length,
    lower: (password.match(/[a-z]/g) || []).length,
    numbers: (password.match(/[0-9]/g) || []).length,
    symbols: (password.match(/[^A-Za-z0-9]/g) || []).length
  };

  // Data formatted for MUI PieChart using your exact dashboard color palette
  const chartData = [
    { id: 'lower', value: stats.lower, label: 'Lower', color: '#0f61cc' },
    { id: 'upper', value: stats.upper, label: 'Upper', color: '#34d399' },
    { id: 'numbers', value: stats.numbers, label: 'Numbers', color: '#fbbf24' },
    { id: 'symbols', value: stats.symbols, label: 'Symbols', color: '#f87171' },
  ].filter(item => item.value > 0); // Only show slices if count > 0

  return (
    <div className={styles.statsWrapper}>
      {/* Top Numeric Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Length</span>
          <strong>{stats.length}</strong>
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
          highlightScope: { fade: 'global', highlight: 'item',},
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      slotProps={{
    legend: {
      sx: {
        // Targets the text color of the legend labels
        '& .MuiChartsLegend-label': {
          color: '#94a3b8',
        },
      },
    },
  }}
      height={200}
      width={200}
    />






            {/* Custom compact text legend */}
          </div>
        ) : (
          <div className={styles.emptyState}>Type or generate a password to view distribution</div>
        )}
      </div>
    </div>
  );
};

export default Stats;
