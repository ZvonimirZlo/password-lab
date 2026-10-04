import {getCharacterDistribution}  from '../algorithms/getCharacterDistribution.jsx';

const CharacterDistribution = ({ password = '' }) => {
    console.log("Current password in distribution:", password);
    
  const dist = getCharacterDistribution(password);

  return (
    <div className="distribution-card" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: '#94a3b8' }}>
        <span>Character Breakdown</span>
        <span>{password.length} chars total</span>
      </div>

      {/* Stacked Bar Container */}
      <div style={{ 
        display: 'flex', 
        height: '8px', 
        width: '100%', 
        backgroundColor: '#1e293b', 
        borderRadius: '4px', 
        overflow: 'hidden' 
      }}>
        <div style={{ width: `${dist.lower}%`, backgroundColor: '#3b82f6', transition: 'width 0.3s ease' }} title={`Lowercase: ${dist.counts.lower}`} />
        <div style={{ width: `${dist.upper}%`, backgroundColor: '#10b981', transition: 'width 0.3s ease' }} title={`Uppercase: ${dist.counts.upper}`} />
        <div style={{ width: `${dist.numbers}%`, backgroundColor: '#f59e0b', transition: 'width 0.3s ease' }} title={`Numbers: ${dist.counts.numbers}`} />
        <div style={{ width: `${dist.symbols}%`, backgroundColor: '#ef4444', transition: 'width 0.3s ease' }} title={`Symbols: ${dist.counts.symbols}`} />
      </div>

      {/* Mini Legend */}
      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', marginTop: '8px', color: '#64748b', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#3b82f6' }}>■</span> Lower ({dist.counts.lower})</span>
        <span><span style={{ color: '#10b981' }}>■</span> Upper ({dist.counts.upper})</span>
        <span><span style={{ color: '#f59e0b' }}>■</span> Numbers ({dist.counts.numbers})</span>
        <span><span style={{ color: '#ef4444' }}>■</span> Symbols ({dist.counts.symbols})</span>
      </div>
    </div>
  );
};

export default CharacterDistribution;