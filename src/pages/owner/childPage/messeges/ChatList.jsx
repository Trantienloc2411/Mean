"use client"

import { useState, useEffect } from "react"
import { FaSearch, FaCommentDots } from "react-icons/fa"
import styles from "./Messages.module.scss"

export default function ChatList({ chats, selectedChat, onSelectChat, currentUserId }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredChats, setFilteredChats] = useState(chats || [])

  useEffect(() => {
    if (!chats) return

    if (searchTerm.trim() === "") {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.participants.some((p) => p.username.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredChats(filtered)
    }
  }, [searchTerm, chats])

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Function to get other participant(s) in a chat
  const getOtherParticipants = (chat) => {
    if (!chat.participants || !currentUserId) return []
    return chat.participants.filter((p) => p.id !== currentUserId)
  }

  return (
    <div className={styles.chatList}>
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => {
          const otherParticipants = getOtherParticipants(chat)
          const isOnline = otherParticipants.some((p) => p.is_online)

          return (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${selectedChat && selectedChat.id === chat.id ? styles.activeChat : ""}`}
              onClick={() => onSelectChat(chat)}
            >
              {chat.avatar ? (
                <img src={chat.avatar || "/placeholder.svg"} alt={chat.name} className={styles.avatar} />
              ) : (
                <div className={styles.avatar}>{getInitials(chat.name)}</div>
              )}

              {isOnline && <div className={styles.onlineStatus}></div>}

              <div className={styles.chatInfo}>
                <p className={styles.chatName}>{chat.name}</p>
                <p className={styles.chatLastMessage}>{chat.lastMessage || "Start a conversation"}</p>
              </div>
            </div>
          )
        })
      ) : (
        <div className={styles.emptyState}>
          <FaCommentDots />
          <h3>No conversations found</h3>
          <p>Try a different search or start a new conversation</p>
        </div>
      )}
    </div>
  )
}

