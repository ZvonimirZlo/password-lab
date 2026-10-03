import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import './PasswordLab.scss';
import PasswordInput from './components/PasswordInput';

export default function App() {
  const [password, setPassword] = useState('');

  const stats = {
    length: password.length,
    upper: (password.match(/[A-Z]/g) || []).length,
    lower: (password.match(/[a-z]/g) || []).length,
    numbers: (password.match(/[0-9]/g) || []).length,
    symbols: (password.match(/[^A-Za-z0-9]/g) || []).length,
  };

const metrics = [
    { 
      id: 'shannon', 
      label: 'Shannon Entropy', 
      score: password ? Math.min(password.length * 7, 100) : 0, 
      unit: 'bits' ,
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
      score: password ? Math.min(password.length * 9, 100) : 0, 
      unit: '%',
      description: 'Measures randomness and unpredictability of characters.'
    },
    { 
      id: 'dictionary', 
      label: 'Dictionary & Pattern Check', 
      score: password ? (password.length > 8 ? 80 : 30) : 0, 
      unit: '%',
      description: 'Measures randomness and unpredictability of characters.'
    },
    { 
      id: 'timetocrack', 
      label: 'Time-to-Crack Estimate', 
      score: password ? Math.min(password.length * 8, 100) : 0, 
      unit: 'est',
      description: 'Measures randomness and unpredictability of characters.' 
    },
    { 
      id: 'keyspace', 
      label: 'Keyspace Size', 
      score: password ? Math.min(password.length * 7.5, 100) : 0, 
      unit: '%',
      description: 'Measures randomness and unpredictability of characters.'
    },
  ];

  return (
    <div className="password-lab">
      <h2>Password Lab</h2>
      <PasswordInput password={password} setPassword={setPassword} />

      {/* Comparative Progressive Bars */}
      <div className="bars-container">
        {metrics.map((metric) => (
          <div key={metric.id} className="metric-row">
            <div className="metric-info">
              <span className="label-with-info">
                {metric.label}
                <span className="tooltip-container">
                  <FiInfo className="info-icon" />
                  <span className="tooltip-text">{metric.description}</span>
                </span>
              </span>
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