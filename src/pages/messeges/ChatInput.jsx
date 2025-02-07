import { useState } from "react";
import { FaPaperPlane, FaImage } from "react-icons/fa";
import styles from "./Messages.module.scss";

export default function ChatInput({ onSendMessage }) {
  const [messageText, setMessageText] = useState("");
  const [image, setImage] = useState(null);

  const handleSendMessage = () => {
    if (messageText.trim() || image) {
      onSendMessage({ text: messageText, image });
      setMessageText("");
      setImage(null);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.chatInput}>
      <input
        type="text"
        placeholder="Nhập tin nhắn..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <label htmlFor="imageUpload" className={styles.uploadIcon}>
        <FaImage />
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleImageUpload}
        hidden
      />
      <button onClick={handleSendMessage}>
        <FaPaperPlane />
      </button>
    </div>
  );
}
