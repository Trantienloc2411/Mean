import styles from "./Messages.module.scss";
import MessageItem from "./MessageItem";

export default function ChatBox({ selectedChat, messages }) {
  return (
    <div className={styles.chatBox}>
      <div className={styles.chatHeader}>{selectedChat.name}</div>
      <div className={styles.chatMessages}>
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}
