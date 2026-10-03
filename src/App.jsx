import './PasswordLab.scss';
import { useState } from 'react';

export default function App() {
  const [password, setPassword] = useState('');

  // Basic character stats calculations
  const stats = {
    length: password.length,
    upper: (password.match(/[A-Z]/g) || []).length,
    lower: (password.match(/[a-z]/g) || []).length,
    numbers: (password.match(/[0-9]/g) || []).length,
    symbols: (password.match(/[^A-Za-z0-9]/g) || []).length,
  };

  // Mock metric scores for now (will replace these with real Shannon/Markov functions later)
  const metrics = [
    { 
      id: 'shannon', 
      label: 'Shannon Entropy', 
      score: password ? Math.min(password.length * 7, 100) : 0, 
      unit: 'bits' 
    },
    { 
      id: 'markov', 
      label: 'Markov Chain Analysis', 
      score: password ? Math.min(password.length * 6, 100) : 0, 
      unit: '%' 
    },
    { 
      id: 'composition', 
      label: 'Character Variety', 
      score: password ? Math.min(password.length * 9, 100) : 0, 
      unit: '%' 
    },
        { 
      id: 'composition', 
      label: 'Character Variety', 
      score: password ? Math.min(password.length * 9, 100) : 0, 
      unit: '%' 
    },
        { 
      id: 'composition', 
      label: 'Character Variety', 
      score: password ? Math.min(password.length * 9, 100) : 0, 
      unit: '%' 
    },
        { 
      id: 'composition', 
      label: 'Character Variety', 
      score: password ? Math.min(password.length * 9, 100) : 0, 
      unit: '%' 
    },
        { 
      id: 'composition', 
      label: 'Character Variety', 
      score: password ? Math.min(password.length * 9, 100) : 0, 
      unit: '%' 
    },
  ];

  return (
    <div className="password-lab">
      <h2>Password Lab</h2>
      
      <input
        type="password"
        placeholder="Type a password to test..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Comparative Progressive Bars */}
      <div className="bars-container">
        {metrics.map((metric) => (
          <div key={metric.id} className="metric-row">
            <div className="metric-info">
              <span>{metric.label}</span>
              <span>{metric.score} {metric.unit}</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${metric.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stats Grid Below */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Length</span>
          <strong>{stats.length}</strong>
        </div>
        <div className="stat-card">
          <span>Uppercase</span>
          <strong>{stats.upper}</strong>
        </div>
        <div className="stat-card">
          <span>Lowercase</span>
          <strong>{stats.lower}</strong>
        </div>
        <div className="stat-card">
          <span>Numbers</span>
          <strong>{stats.numbers}</strong>
        </div>
        <div className="stat-card">
          <span>Symbols</span>
          <strong>{stats.symbols}</strong>
        </div>
      </div>
    </div>
  );
}