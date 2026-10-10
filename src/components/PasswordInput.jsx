import { FiEye, FiEyeOff, FiCopy, FiCheck, FiX } from 'react-icons/fi'
import { useState } from 'react'
import styles from './PasswordInput.module.scss'

const PasswordInput = ({ password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.passwordInputWrapper}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        maxLength={'42'}
        onChange={e => setPassword(e.target.value)}
        placeholder='Enter or generate your password...'
      />

      <div className={styles.actions}>
        {password && (
          <>
            <button
              type='button'
              onClick={() => setPassword('')}
              className={styles.actionBtn}
              title='Clear password'
            >
              <FiX size={18} />
            </button>
            <button
              type='button'
              onClick={handleCopy}
              className={styles.actionBtn}
              title='Copy password'
            >
              {copied ? (
                <FiCheck size={18} color='#34d399' />
              ) : (
                <FiCopy size={18} />
              )}
            </button>
          </>
        )}
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className={styles.actionBtn}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
