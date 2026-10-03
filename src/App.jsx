import { useState } from 'react';
import './PasswordLab.scss';
import PasswordInput from './components/PasswordInput';
import MetricList from './components/MetricList';
import Stats from './components/Stats';

export default function App() {
  const [password, setPassword] = useState('');

  // const stats = {
  //   length: password.length,
  //   upper: (password.match(/[A-Z]/g) || []).length,
  //   lower: (password.match(/[a-z]/g) || []).length,
  //   numbers: (password.match(/[0-9]/g) || []).length,
  //   symbols: (password.match(/[^A-Za-z0-9]/g) || []).length,
  // };

  return (
    <div className="password-lab">
      <h2>Password Lab</h2>
      <PasswordInput password={password} setPassword={setPassword} />
      <MetricList password={password}/>
      <Stats password={password} />
    </div>
  );
}