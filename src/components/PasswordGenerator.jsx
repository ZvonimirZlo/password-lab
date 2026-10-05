import { useState } from 'react';
import { generateSecurePassword } from '../algorithms/generateSecurePassword';
import { FiRefreshCw, FiCopy, FiCheck } from 'react-icons/fi';
import styles from './PasswordGenerator.module.scss'; // Import SCSS module

const PasswordGenerator = ({ onPasswordGenerated, currentPassword }) => {
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    useLower: true,
    useUpper: true,
    useNumbers: true,
    useSymbols: true,
  });

  const handleGenerate = () => {
    const newPass = generateSecurePassword({ length, ...options });
    onPasswordGenerated(newPass);
  };

  const handleCopy = () => {
    if (!currentPassword) return;
    
    navigator.clipboard.writeText(currentPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.generatorCard}>
      <div className={styles.header}>
        <span className={styles.title}>Secure Password Generator</span>
        
        <div className={styles.buttonGroup}>
          {/* Copy Button */}
          <button 
            onClick={handleCopy}
            disabled={!currentPassword}
            className={`${styles.button} ${styles.copyBtn} ${copied ? styles.copied : ''}`}
            title="Copy password"
          >
            {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}
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
          type="range" 
          min="8" 
          max="42" 
          value={length} 
          onChange={(e) => setLength(Number(e.target.value))}
          className={styles.rangeInput}
        />
      </div>
    </div>
  );
};

export default PasswordGenerator;