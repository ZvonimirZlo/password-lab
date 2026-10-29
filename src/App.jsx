import { useState } from 'react'
import './App.scss'
import PasswordInput from './components/PasswordInput'
import MetricList from './components/MetricList'
import Stats from './components/Stats'
import PasswordGenerator from './components/PasswordGenerator'
import AlertBox from './components/AlertBox'
import Footer from './components/Footer'
import About from './components/About'
import { usePasswordAnalysis } from './components/usePasswordAnalysis'

export default function App () {
  const [password, setPassword] = useState('')
  
  // All analysis bundled cleanly in one hook
  const analysis = usePasswordAnalysis(password)

  return (
    <div className='password-lab'>
      <header className='lab-header'>
        <h2>Zyfr@Lab</h2>
        <span>Password <br />Analyzer</span>
      </header>

      <div className='dashboard-grid'>
        <section className='lab-section input-generator-section'>
          <div className='card'>
            <h3>Password Input</h3>
            <PasswordInput password={password} setPassword={setPassword} analysis={analysis.crackEstimate}/>
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
            {/* Pass password and the analysis object down */}
            <MetricList password={password} analysis={analysis} />
          </div>
          <About />

          <div className='card stats-card-wrapper'>
            <h3>Statistics</h3>
            <Stats password={password} analysis={analysis.crackEstimate} />
          </div>
        </section>
      </div>

      <AlertBox warning={analysis.warning} />
      <Footer />
    </div>
  )
}
