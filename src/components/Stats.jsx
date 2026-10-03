const Stats = ({ password }) => {
  const stats = {
    length: password.length,
    upper: (password.match(/[A-Z]/g) || []).length,
    lower: (password.match(/[a-z]/g) || []).length,
    numbers: (password.match(/[0-9]/g) || []).length,
    symbols: (password.match(/[^A-Za-z0-9]/g) || []).length
  }

  return (
    <div>
      {/* Stats Grid Below */}
      <div className='stats-grid'>
        <div className='stat-card'>
          <span>Length</span>
          <strong>{stats.length}</strong>
        </div>
        <div className='stat-card'>
          <span>Uppercase</span>
          <strong>{stats.upper}</strong>
        </div>
        <div className='stat-card'>
          <span>Lowercase</span>
          <strong>{stats.lower}</strong>
        </div>
        <div className='stat-card'>
          <span>Numbers</span>
          <strong>{stats.numbers}</strong>
        </div>
        <div className='stat-card'>
          <span>Symbols</span>
          <strong>{stats.symbols}</strong>
        </div>
      </div>
    </div>
  )
}

export default Stats
