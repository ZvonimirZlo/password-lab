import { FiEye, FiEyeOff, FiCopy, FiCheck, FiX } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import styles from './PasswordInput.module.scss'

const PasswordInput = ({ password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inputValue, setInputValue] = useState(password || '')

  
  useEffect(() => {
    setInputValue(password || '')
  }, [password])

  //Debounce function, so if user sits on single key it won't cause stuttering
  // or crashing the app
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== password) {
        setPassword(inputValue)
      }
    }, 200)
    return () => clearTimeout(timeoutId)
  }, [inputValue, password, setPassword])

  //Handles input change
  const handleInputChange = event => {
    const sanitizedValue = event.target.value.replace(/\s/g, '')
    setInputValue(sanitizedValue)
  }

  //Handles password copy
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
        value={inputValue}
        maxLength={'256'}
        onChange={handleInputChange}
        placeholder='Enter or generate your password...'
      />

      <div className={styles.actions}>
        {password && (
          <>
            <button
              type='button'
              onClick={() => {
                setInputValue('')
                setPassword('')
              }}
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
