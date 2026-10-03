import { FiInfo } from 'react-icons/fi';


const MetricList = ({password}) => {

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
    <div>      
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
      </div></div>
  )
}

export default MetricList