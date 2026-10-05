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
    { id: 'lower', value: stats.lower, label: 'Lower', color: '#38bdf8' },
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
                  innerRadius: 35, // Creates the doughnut hole style
                  outerRadius: 55,
                  paddingAngle: 4,
                  cornerRadius: 4,
                },
              ]}
              height={130}
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
              slotProps={{
                legend: { hidden: true }, // We can use a custom legend or let tooltips handle it
              }}
            />
            {/* Custom compact text legend */}
            <div className={styles.chartLegend}>
              {chartData.map((item) => (
                <div key={item.id} className={styles.legendItem}>
                  <span style={{ backgroundColor: item.color }} className={styles.legendDot} />
                  <span>{item.label}: <strong>{item.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>Type or generate a password to view distribution</div>
        )}
      </div>
    </div>
  );
};

export default Stats;
