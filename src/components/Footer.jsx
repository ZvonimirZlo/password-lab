const Footer = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        fontSize: '0.75rem',
        color: '#475569',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      Password Lab Engine v1.0.0 // Securing Cryptographic Initialization Inputs // {new Date().getFullYear()}
    </footer>
  )
}

export default Footer