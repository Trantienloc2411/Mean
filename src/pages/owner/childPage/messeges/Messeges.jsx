import { useState } from "react";
import styles from "./Messages.module.scss";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";

export default function Messages() {
  const [chats] = useState([
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hello!",
      avatar: "https://i.pravatar.cc/50?img=1",
      messages: [
        { id: 1, text: "Hello!", sender: "user" },
        { id: 2, text: "Hey John!", sender: "other" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "How are you?",
      avatar: "https://i.pravatar.cc/50?img=2",
      messages: [
        { id: 1, text: "Hi Jane!", sender: "user" },
        { id: 2, text: "Hey! How's it going?", sender: "other" },
      ],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [messages, setMessages] = useState(selectedChat.messages);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
  };

  const handleSendMessage = ({ text, image }) => {
    const newMessage = { id: Date.now(), text, image, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className={styles.chatContainer}>
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
      />
      <div className={styles.chatContent}>
        <ChatBox selectedChat={selectedChat} messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
