import styles from './About.module.scss'
import { isBlacklistLoaded } from '../algorithms/dictAndPatterns.jsx'

const About = () => {
  return (
    <section
      className={`lab-section architecture-section ${styles.aboutSection}`}
      style={{ gridArea: 'distribution' }}
    >
      <div className={`card ${styles.aboutCard}`}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>SECURITY ARCHITECTURE</span>

            <h3>Dual-Engine Verification</h3>
          </div>

          <span
            className={`${styles.status} ${
              !isBlacklistLoaded ? styles.inactive : ''
            }`}
          >
            {isBlacklistLoaded === true ? 'Active' : 'Inactive'}
          <span className={styles.statusDot} />
          </span>
        </div>

        <div className={styles.engines}>
          <article className={`${styles.engine} ${styles.deterministic}`}>
            <div className={styles.engineHeader}>
              <div className={styles.engineIcon}>🔒</div>

              <div>
                <span className={styles.engineType}>
                  ENGINE 01 · DETERMINISTIC
                </span>

                <h4>Pattern-Matching Framework</h4>
              </div>
            </div>

            <p>
              This engine instantly compares your text input against a localized
              memory database of the top 10,000 most frequently compromised
              human credentials. Suffix, prefix, repetition, and keyboard
              sequence checks isolate lazily constructed patterns before they
              hit computing loops.
            </p>
          </article>

          <article className={`${styles.engine} ${styles.probabilistic}`}>
            <div className={styles.engineHeader}>
              <div className={styles.engineIcon}>🧠</div>

              <div>
                <span className={styles.engineType}>
                  ENGINE 02 · PROBABILISTIC
                </span>

                <h4>Markov Chain Analysis</h4>
              </div>
            </div>

            <p>
              Instead of guessing blindly, this conditional algorithm evaluates
              the transitional probability vectors of adjacent character pairs.
              Trained over one million leaked sequences, it computes structural
              "surprise" math to flag predictable typing habits that flat
              entropy completely misses.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default About
