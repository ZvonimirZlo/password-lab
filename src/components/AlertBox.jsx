const AlertBox = ({warning}) => {

if (!warning) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '320px',
        padding: '1rem',
        backgroundColor: '#131c31',
        borderLeft: '4px solid #ef4444',
        borderTop: '1px solid #1e293b',
        borderRight: '1px solid #1e293b',
        borderBottom: '1px solid #1e293b',
        borderRadius: '4px 8px 8px 4px',
        color: '#fca5a5',
        fontSize: '0.85rem',
        lineHeight: '1.4',
        zIndex: 9999,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.6)'
      }}
    >
      <div
        style={{
          fontWeight: 'bold',
          color: '#ef4444',
          marginBottom: '0.35rem',
          fontSize: '0.75rem',
          letterSpacing: '0.05em'
        }}
      >
        CRITICAL SYSTEM ADVISORY
      </div>
      {warning}
    </div>
  )
}

export default AlertBox