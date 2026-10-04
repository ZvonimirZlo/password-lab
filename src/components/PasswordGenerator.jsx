import { useState } from 'react';
import { generateSecurePassword } from '../algorithms/generateSecurePassword';
import { FiRefreshCw, FiCopy, FiCheck } from 'react-icons/fi';

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
      setTimeout(() => setCopied(false), 2000); // Reset back to copy icon after 2 seconds
    });
  };

  return (
    <div className="generator-card" style={{ marginBottom: '20px', padding: '16px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc' }}>Secure Password Generator</span>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Copy Button */}
          <button 
            onClick={handleCopy}
            disabled={!currentPassword}
            style={{ 
              background: '#1e293b', 
              border: '1px solid #334155', 
              color: copied ? '#10b981' : '#38bdf8', 
              padding: '6px 10px', 
              borderRadius: '6px', 
              cursor: currentPassword ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
            title="Copy password"
          >
            {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}
          </button>

          {/* Generate Button */}
          <button 
            onClick={handleGenerate}
            style={{ 
              background: '#3b82f6', 
              border: 'none', 
              color: 'white', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <FiRefreshCw /> Generate
          </button>
        </div>
      </div>

      {/* Length Slider */}
      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Length: {length}</span>
        </div>
        <input 
          type="range" 
          min="8" 
          max="62" 
          value={length} 
          onChange={(e) => setLength(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#3b82f6', marginTop: '4px' }}
        />
      </div>
    </div>
  );
};

export default PasswordGenerator;