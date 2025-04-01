import styles from "./Messages.module.scss";

export default function MessageItem({ message }) {
  return (
    <div className={`${styles.message} ${styles[message.sender]}`}>
      {message.image && (
        <img src={message.image} alt="sent" className={styles.messageImage} />
      )}
      <p>{message.text}</p>
    </div>
  );
}
