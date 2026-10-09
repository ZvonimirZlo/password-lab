import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.status}>
        <span className={styles.statusDot} />
        <span>SECURITY LAB ONLINE</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.identity}>
        <span className={styles.brand}>Zyfr@</span>
        <span className={styles.engine}>Lab Engine</span>
        <span className={styles.version}>v1.0.0</span>
      </div>

      <div className={styles.description}>
        Securing cryptographic initialization inputs
      </div>

      <div className={styles.copyright}>
        © {new Date().getFullYear()} LOCAL ANALYSIS · NO EXTERNAL SERVICES
      </div>
    </footer>
  )
}

export default Footer