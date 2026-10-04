import { useState } from 'react'
import './PasswordLab.scss'
import PasswordInput from './components/PasswordInput'
import MetricList from './components/MetricList'
import Stats from './components/Stats'
import CharacterDistribution from './components/CharacterDistribution'
import PasswordGenerator from './components/PasswordGenerator'

export default function App () {
  const [password, setPassword] = useState('')

  return (
    <div className='password-lab'>
      <h2>Password Lab</h2>
      <PasswordInput password={password} setPassword={setPassword} />
      <MetricList password={password} />
      <Stats password={password} />
      <CharacterDistribution password={password} />
      <PasswordGenerator
        onPasswordGenerated={setPassword}
        currentPassword={password}
      />
    </div>
  )
}
