import styles from "./Messages.module.scss";

export default function MessageItem({ message }) {
  // Debug to see what's in the message object
  console.log("Message object:", message);

  // Determine if current user (for styling)
  const isCurrentUser = message.isCurrentUser || false;

  return (
    <div
      className={`${styles.message} ${
        isCurrentUser ? styles.user : styles.other
      }`}
    >
      {/* Show username for non-current user */}
      {!isCurrentUser && (
        <div className={styles.messageUsername}>
          {message.sender?.username || "Unknown"}
        </div>
      )}

      {/* Show message content */}
      {message.image_url && (
        <img
          src={message.image_url}
          alt="sent"
          className={styles.messageImage}
        />
      )}

      <p className={styles.messageContent}>{message.content}</p>

      {/* Optionally show timestamp */}
      <span className={styles.messageTime}>
        {new Date(message.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
