import { useState, useMemo } from 'react'
import './App.scss'
import PasswordInput from './components/PasswordInput'
import MetricList from './components/MetricList'
import Stats from './components/Stats'
import PasswordGenerator from './components/PasswordGenerator'
import AlertBox from './components/AlertBox'
import Footer from './components/Footer'
import { checkDictionaryAndPatterns } from './algorithms/dictAndPatterns'
import About from './components/About'

export default function App () {
  const [password, setPassword] = useState('')

  const dictResult = useMemo(() => {
    return checkDictionaryAndPatterns(password)
  }, [password])

  return (
    <div className='password-lab'>
      <header className='lab-header'>
        <h2>Zyfr@Lab</h2>
           <span>Password <br></br>Analyzer</span>
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
        <About />

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