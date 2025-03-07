import styles from "../styles/thankyou.module.css";

export default function ThankYou() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img
          src="/check-circle.png"
          alt="Success Icon"
          className={styles.icon}
        />
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
