import { FiInfo } from 'react-icons/fi'
import shannonEntropy from '../algorithms/shannonEntropy'
import { characterVariety } from '../algorithms/characterVariety';

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
      description: `Character Variety (often called character pool diversity) measures the range of different types of characters used in a password. 
      Instead of just looking at how long a password is or how random the letters are, this metric evaluates whether you are mixing up different character groups.
      Character variety is crucial because it exponentially increases the keyspace size—the total number of possible combinations an attacker has to guess.
      If a password only uses lowercase letters, a computer only tests 26 possibilities for each position.
      If a password incorporates all four classes, the pool expands to roughly 94 characters per position.
      For a 12-character password, a single-class pool gives around 26^12 combinations, while a mixed-class pool jumps to 94^12, making brute-force attacks computationally infeasible.`
    },
    {
      id: 'dictionary',
      label: 'Dictionary & Pattern Check',
      score: password ? characterVariety(password) : 0,
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
    }
  ]

  return (
    <div>
      {/* Comparative Progressive Bars */}
      <div className='bars-container'>
        {metrics.map(metric => (
          <div key={metric.id} className='metric-row'>
            <div className='metric-info'>
              <span className='label-with-info'>
                {metric.label}
                <span className='tooltip-container'>
                  <FiInfo className='info-icon' />
                  <span className='tooltip-text'>{metric.description}</span>
                </span>
              </span>
              <span>
                {metric.score} {metric.unit}
              </span>
            </div>
            <div className='progress-track'>
              <div
                className='progress-fill'
                style={{ width: `${metric.barWidth || metric.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MetricList
