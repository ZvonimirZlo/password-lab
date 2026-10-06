

import { useState, useMemo } from 'react'
import './PasswordLab.scss'
import PasswordInput from './components/PasswordInput'
import MetricList from './components/MetricList'
import Stats from './components/Stats'
import PasswordGenerator from './components/PasswordGenerator'
import { checkDictionaryAndPatterns } from './algorithms/dictAndPatterns'

export default function App () {
  const [password, setPassword] = useState('')

  const dictResult = useMemo(() => {
    return checkDictionaryAndPatterns(password)
  }, [password])

  return (
    <div className='password-lab'>
      <header className='lab-header'>
        <h2>Password Lab</h2>
      </header>

      <div className='dashboard-grid'>
        {/* Top/Hero Row: Password Input & Generator side-by-side on desktop */}
        <section className='lab-section input-generator-section'>
          {/* Card is completely clean now - no positioning or margins pushing items down */}
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

        {/* Middle/Lower Row: Metrics & Stats card blocks stay perfectly rigid and locked! */}
        <section className='lab-section analysis-section'>
          <div className='card metrics-card'>
            <h3>Security Metrics</h3>
            <MetricList password={password} dictResult={dictResult} />
          </div>

          <div className='card stats-card-wrapper'>
            <h3>Statistics</h3>
            <Stats password={password} />
          </div>
        </section>
      </div>

      {/* 🔥 THE TRUE SYSTEM TOAST ALERT BOX */}
      {/* Placed completely outside the grid at the root level of the component */}
      {password && dictResult.warning && (
        <div style={{
          position: 'fixed',
          bottom: '24px', 
          right: '24px',
          width: '320px',
          padding: '1rem',
          backgroundColor: '#131c31', // Matches your card background style
          borderLeft: '4px solid #ef4444', 
          borderTop: '1px solid #1e293b',
          borderRight: '1px solid #1e293b',
          borderBottom: '1px solid #1e293b',
          borderRadius: '4px 8px 8px 4px',
          color: '#fca5a5',
          fontSize: '0.85rem',
          lineHeight: '1.4',
          zIndex: 9999, // Overrides everything on the window viewport
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.6)',
        }}>
          <div style={{ fontWeight: 'bold', color: '#ef4444', marginBottom: '0.35rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            CRITICAL SYSTEM ADVISORY
          </div>
          {dictResult.warning}
        </div>
      )}
    </div>
  )
}
