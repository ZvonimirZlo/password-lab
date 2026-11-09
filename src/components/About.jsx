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
              memory database of more than 100,000 most frequently compromised
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
              Trained over a million leaked sequences, it computes structural
              &quot;surprise&quot; math to flag predictable typing habits that
              flat entropy completely misses.
            </p>
          </article>
        </div>
        <article className={styles.privacy}>
          <div className={styles.engineHeader}>
            <div className={styles.engineIcon}>🛡️</div>

            <div>
              <span className={styles.engineType}>
                PRIVACY ARCHITECTURE · CLIENT-SIDE
              </span>

              <h4>Local Processing. Private by Design.</h4>
            </div>
          </div>

          <p>
            All security analysis is performed locally within your browser. Your
            input is never transmitted to external servers, third-party APIs, or
            cloud-based processing services. No account or remote verification
            is required. Your sensitive data stays under your control throughout
            the entire analysis process.
          </p>

          <div className={styles.privacyIndicators}>
            <span>🔒 LOCAL PROCESSING</span>
            <span>☁️ NO CLOUD UPLOADS</span>
            <span>🚫 NO EXTERNAL API CALLS</span>
          </div>
        </article>
      </div>
    </section>
  )
}

export default About
