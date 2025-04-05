import { useState } from "react";
import { FaPaperPlane, FaImage } from "react-icons/fa";
import styles from "./Messages.module.scss";
import { supabase } from "../../../../redux/services/supabase";

export default function ChatInput({ onSendMessage }) {
  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async (file) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `message-images/${fileName}`;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.storage
        .from('chat-images') // Your storage bucket name
        .upload(filePath, file);
        
      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('chat-images')
        .getPublicUrl(filePath);
        
      return urlData?.publicUrl || null;
    } catch (error) {
      console.error('Error in image upload:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !imageFile) || isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Upload image if exists
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      // Send message with text content and/or image URL
      onSendMessage({ 
        content: messageText.trim(), 
        image_url: imageUrl 
      });
      
      // Reset input fields
      setMessageText("");
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatInput}>
      {imagePreview && (
        <div className={styles.imagePreview}>
          <img src={imagePreview} alt="Preview" />
          <button 
            className={styles.removeButton}
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        
        <label htmlFor="imageUpload" className={styles.uploadIcon}>
          <FaImage />
        </label>
        
        {/* <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        /> */}
        
        <button 
          onClick={handleSendMessage} 
          disabled={isLoading || (!messageText.trim() && !imageFile)}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}