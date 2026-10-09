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
      <div className="security-alert__indicator">
        !
      </div>

      <div className="security-alert__content">
        <div className="security-alert__title">
          CRITICAL SECURITY ADVISORY
        </div>

        <div className="security-alert__message">
          {warning}
        </div>
      </div>
    </div>
  );
};

export default AlertBox;