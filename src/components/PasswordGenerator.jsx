import { useState } from 'react'
import { generateSecurePassword } from '../algorithms/generateSecurePassword'
import { FiRefreshCw, FiCheck, FiDownload } from 'react-icons/fi'
import styles from './PasswordGenerator.module.scss' // Import SCSS module

const PasswordGenerator = ({ onPasswordGenerated, currentPassword }) => {
  const [length, setLength] = useState(16)
  const [downloaded, setDownloaded] = useState(false)
  const [options, setOptions] = useState({
    useLower: true,
    useUpper: true,
    useNumbers: true,
    useSymbols: true
  })

  const handleGenerate = () => {
    const newPass = generateSecurePassword({ length, ...options })
    onPasswordGenerated(newPass)
  }

//Download password function
  const handleDownload = () => {
  if (!currentPassword) return

  const blob = new Blob([currentPassword], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = 'password.txt'
  document.body.appendChild(link)
  link.click()
  
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  // Feedback state update
  setDownloaded(true)
  setTimeout(() => setDownloaded(false), 2000)
}

  return (
    <div className={styles.generatorCard}>
      <div className={styles.header}>
        <span className={styles.title}>Secure Password Generator</span>

        <div className={styles.buttonGroup}>
          {/* Copy Button */}
          <button
            onClick={handleDownload}
            disabled={!currentPassword}
            className={`${styles.button} ${styles.copyBtn} ${
              downloaded ? styles.copied : ''
            }`}
            title='Download password'
          >
            {downloaded ? <FiCheck /> : <FiDownload />} {downloaded ? 'Downloaded' : 'Download'}
          </button>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className={`${styles.button} ${styles.generateBtn}`}
          >
            <FiRefreshCw /> Generate
          </button>
        </div>
      </div>

      {/* Length Slider */}
      <div className={styles.sliderContainer}>
        <div className={styles.sliderLabel}>
          <span>Length: {length}</span>
        </div>
        <input
          type='range'
          min='8'
          max='42'
          value={length}
          onChange={e => setLength(Number(e.target.value))}
          className={styles.rangeInput}
        />
      </div>
    </div>
  )
}

export default PasswordGenerator
