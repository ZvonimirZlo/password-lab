import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import styles from './PasswordInput.module.scss'; // Import SCSS module

const PasswordInput = ({ password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.passwordInputWrapper}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder='Enter your password...'
      />
      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className={styles.toggleButton}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
