import './AlertBox.scss'
import { useEffect } from 'react';

const AlertBox = ({ warning }) => {

useEffect(() => {
  if(warning) {
    const alertSound = new Audio('/universfield-new-notification-051-494246.mp3')
  alertSound.play()
  }
}, [warning])

  if (!warning) return null;

  return (
    <div
      className="security-alert"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="security-alert_indicator">
        !
      </div>

      <div className="security-alert_content">
        <div className="security-alert_title">
          CRITICAL SECURITY ADVISORY
        </div>

        <div className="security-alert_message">
          {warning}
        </div>
      </div>
    </div>
  );
};

export default AlertBox;