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

                  {/* Middle/Lower Row: Metrics & Stats */}
        <section className='lab-section analysis-section'>
          {/* ... your metrics and stats cards ... */}
        </section>

        <section className='lab-section architecture-section' style={{ gridArea: 'distribution' }}>
          <div className='card' style={{ lineHeight: '1.6' }}>
            <h3 style={{ color: '#38bdf8', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              System Blueprint: Dual-Engine Verification
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <div>
                <strong style={{ color: '#f1f5f9', display: 'block', marginBottom: '0.25rem' }}>
                  🔒 Pattern-Matching Framework (Deterministic)
                </strong>
                Our engine instantly compares your text input against a localized memory database of the top 10,000 most frequently compromised human credentials. Suffix, prefix, repetition, and keyboard sequence checks isolate lazily constructed patterns before they hit computing loops.
              </div>
              
              <div>
                <strong style={{ color: '#f1f5f9', display: 'block', marginBottom: '0.25rem' }}>
                  🧠 Probabilistic Modeling (Markov Chain)
                </strong>
                Instead of guessing blindly, our conditional algorithm evaluates the transitional probability vectors of adjacent character pairs. Trained over 100,000 leaked sequences, it computes structural "surprise" math to flag predictable typing habits that flat entropy completely misses.
              </div>
            </div>
          </div>
        </section>


          <div className='card stats-card-wrapper'>
            <h3>Statistics</h3>
            <Stats password={password} />
          </div>
        </section>
      </div>

      {/* THE TRUE SYSTEM TOAST ALERT BOX */}
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
      {/*FOOTER */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        fontSize: '0.75rem',
        color: '#475569', // Subtle gray color that doesn't steal focus
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Password Lab Engine v1.0.0 // Securing Cryptographic Initialization Inputs // {new Date().getFullYear()}
      </footer>
    </div>
  )


}
