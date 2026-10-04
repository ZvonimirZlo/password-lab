import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useState } from 'react'

const PasswordInput = ({ password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    // Inside your render/return:
    <div className='password-input-wrapper' style={{ position: 'relative' }}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder='Enter your password...'
      />
      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: 'absolute',
          right: '10px',
          top: '30%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  )
}

export default PasswordInput
