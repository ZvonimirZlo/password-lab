import { useState, useMemo } from 'react'
import './PasswordLab.scss'
import PasswordInput from './components/PasswordInput'
import MetricList from './components/MetricList'
import Stats from './components/Stats'
import PasswordGenerator from './components/PasswordGenerator'
import AlertBox from './components/AlertBox'
import Footer from './components/Footer'
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

        <section className='lab-section analysis-section'>
          <div className='card metrics-card'>
            <h3>Security Metrics</h3>
            <MetricList password={password} dictResult={dictResult} />
          </div>

          <section
            className='lab-section architecture-section'
            style={{ gridArea: 'distribution' }}
          >
            <div className='card' style={{ lineHeight: '1.6' }}>
              <h3
                style={{
                  color: '#38bdf8',
                  borderBottom: '1px solid #1e293b',
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem'
                }}
              >
                System Blueprint: Dual-Engine Verification
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2rem',
                  fontSize: '0.9rem',
                  color: '#94a3b8'
                }}
              >
                <div>
                  <strong
                    style={{
                      color: '#f1f5f9',
                      display: 'block',
                      marginBottom: '0.25rem'
                    }}
                  >
                    🔒 Pattern-Matching Framework (Deterministic)
                  </strong>
                  Our engine instantly compares your text input against a
                  localized memory database of the top 10,000 most frequently
                  compromised human credentials. Suffix, prefix, repetition, and
                  keyboard sequence checks isolate lazily constructed patterns
                  before they hit computing loops.
                </div>

                <div>
                  <strong
                    style={{
                      color: '#f1f5f9',
                      display: 'block',
                      marginBottom: '0.25rem'
                    }}
                  >
                    🧠 Probabilistic Modeling (Markov Chain)
                  </strong>
                  Instead of guessing blindly, our conditional algorithm
                  evaluates the transitional probability vectors of adjacent
                  character pairs. Trained over 100,000 leaked sequences, it
                  computes structural "surprise" math to flag predictable typing
                  habits that flat entropy completely misses.
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

      <AlertBox warning={dictResult.warning}/>
      <Footer />
    </div>
  )
}