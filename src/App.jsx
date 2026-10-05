import { useState } from 'react'
import './PasswordLab.scss'
import PasswordInput from './components/PasswordInput'
import MetricList from './components/MetricList'
import Stats from './components/Stats'
import PasswordGenerator from './components/PasswordGenerator'

export default function App () {
  const [password, setPassword] = useState('')

  return (
    <div className='password-lab'>
      <header className='lab-header'>
        <h2>Password Lab</h2>
      </header>

      <div className='dashboard-grid'>
        {/* Top/Hero Row: Password Input & Generator side-by-side on desktop */}
        <section className='lab-section input-generator-section'>
          <div className='card'>
            <h3>Password Input</h3>
            <PasswordInput password={password} setPassword={setPassword} />
          </div>
          <div className='card'>
            <PasswordGenerator
              onPasswordGenerated={setPassword}
              currentPassword={password}
            />
          </div>
        </section>

        {/* Middle/Lower Row: Metrics, Stats, & Distribution */}
        <section className='lab-section analysis-section'>
          <div className='card metrics-card'>
            <h3>Security Metrics</h3>
            <MetricList password={password} />
          </div>

          <div className='card stats-card-wrapper'>
            <h3>Statistics</h3>
            <Stats password={password} />
          </div>
        </section>
      </div>
    </div>
  )
}
