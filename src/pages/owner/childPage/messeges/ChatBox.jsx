import styles from "./Messages.module.scss";
import MessageItem from "./MessageItem";

export default function ChatBox({ selectedChat, messages, currentUserId }) {
  // Add some debug logging
  console.log('Selected chat:', selectedChat);
  console.log('Messages:', messages);
  
  return (
    <div className={styles.chatBox}>
      <div className={styles.chatHeader}>{selectedChat?.name || 'Chat'}</div>
      <div className={styles.chatMessages}>
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <MessageItem 
              key={msg.id} 
              message={msg} 
              isCurrentUser={msg.user_id === currentUserId || msg.isCurrentUser}
            />
          ))
        ) : (
          <div className={styles.noMessages}>No messages yet</div>
        )}
      </div>
    </div>
  );
}