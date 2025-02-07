import styles from "./Messages.module.scss";

export default function ChatList({ chats, selectedChat, onSelectChat }) {
  return (
    <div className={styles.chatList}>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`${styles.chatItem} ${
            selectedChat.id === chat.id ? styles.activeChat : ""
          }`}
          onClick={() => onSelectChat(chat)}
        >
          <img src={chat.avatar} alt={chat.name} className={styles.avatar} />
          <div>
            <p className={styles.chatName}>{chat.name}</p>
            <p className={styles.chatLastMessage}>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
