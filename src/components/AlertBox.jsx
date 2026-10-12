import './AlertBox.scss'

const AlertBox = ({ warning }) => {
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