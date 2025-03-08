import styles from "../styles/thankyou.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export default function ThankYou() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Thumbs-Up Icon */}
        <FontAwesomeIcon icon={faThumbsUp} size="4x" className={styles.icon} />
        <h2 className={styles.thank_you_heading}>Thank You!</h2>
        <p className={styles.thank_you_message}>
          Your information was submitted to our team of immigration attorneys.
          Expect an email from hello@tryalma.ai.
        </p>
        <button
          className={styles.thank_you_button}
          onClick={() => (window.location.href = "/")}
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
}
