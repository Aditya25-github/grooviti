import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import "./ChatRoom.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPaperPlane, 
  faSmile, 
  faImage, 
  faEllipsisV,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faClock,
  faUser,
  faReply,
  faPaperclip,
  faXmark
} from "@fortawesome/free-solid-svg-icons";


// Helper to keep socket URL consistent even if apiBase is http(s)
function socketUrlFromApiBase(apiBase) {
  try {
    const u = new URL(apiBase);
    u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
    return u.toString().replace(/\/$/, "");
  } catch {
    return apiBase;
  }
}


export default function ChatRoom({ apiBase, communityId, token, currentUserId, compact = false, communityName = "Community Chat" }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [olderLoading, setOlderLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const fileInputRef = useRef(null);


  // Make a dedicated socket connection for chat
  const socket = useMemo(
    () => {
      try {
        return io(socketUrlFromApiBase(apiBase), {
          transports: ["websocket"],
        });
      } catch (error) {
        console.error('Socket connection failed:', error);
        toast.error('Failed to connect to chat');
        return null;
      }
    },
    [apiBase]
  );


  function onEmojiSelect(emoji) {
    setText((t) => (t ?? "") + (emoji?.native || ""));
  }


  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!olderLoading && listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      // Only auto-scroll if user is near bottom
      if (scrollHeight - scrollTop - clientHeight < 100) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }
  }, [messages, olderLoading]);


  // Load initial history
  useEffect(() => {
    if (!socket) return;


    function onHistory(history) {
      setMessages(history);
      setLoading(false);
      setError(null);
    }
    
    function onNew(msg) {
      setMessages((prev) => [...prev, msg]);
    }
    
    function onUpdated(msg) {
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
    }
    
    function onDeleted({ _id, deletedAt }) {
      setMessages((prev) =>
        prev.map((m) => (m._id === _id ? { ...m, deletedAt, text: "" } : m))
      );
    }
    
    function onError(e) {
      console.error('Socket error:', e);
      toast.error(e?.message || "Chat error");
      setError(e);
    }


    socket.on("connect", () => {
      console.log('Socket connected, joining community:', communityId);
      socket.emit("community:join", { token, communityId, limit: 30 });
    });


    socket.on("disconnect", () => {
      console.log('Socket disconnected');
    });


    socket.on("community:history", onHistory);
    socket.on("community:message:new", onNew);
    socket.on("community:message:updated", onUpdated);
    socket.on("community:message:deleted", onDeleted);
    socket.on("community:error", onError);


    return () => {
      socket.off("community:history", onHistory);
      socket.off("community:message:new", onNew);
      socket.off("community:message:updated", onUpdated);
      socket.off("community:message:deleted", onDeleted);
      socket.off("community:error", onError);
      socket.disconnect();
    };
  }, [socket, token, communityId]);


  // Fetch older messages
  async function fetchOlder() {
    if (!hasMore || olderLoading) return;
    try {
      setOlderLoading(true);
      const before = messages[0]?.createdAt;
      const res = await axios.get(
        `${apiBase}/api/community/${communityId}/chat/history`,
        {
          params: { before, limit: 30 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const older = res.data?.messages ?? [];
      if (older.length === 0) setHasMore(false);
      setMessages((prev) => [...older, ...prev]);
    } catch (e) {
      console.error('Failed to load older messages:', e);
      toast.error("Failed to load older messages");
    } finally {
      setOlderLoading(false);
    }
  }


  function sendMessage() {
    if (!socket) {
      toast.error("Not connected to chat");
      return;
    }


    const clean = text.trim();
    if (!clean) return;
    
    const messageData = {
      text: clean,
      replyTo: replyingTo?._id
    };
    
    socket.emit("community:message:create", messageData);
    setText("");
    setReplyingTo(null);
  }


  function requestEdit(messageId, newText) {
    if (!socket) {
      toast.error("Not connected to chat");
      return;
    }


    const clean = newText.trim();
    if (!clean) return;
    socket.emit("community:message:update", { messageId, text: clean });
  }


  function requestDelete(messageId) {
    if (!socket) {
      toast.error("Not connected to chat");
      return;
    }


    if (!window.confirm("Delete this message?")) return;
    socket.emit("community:message:delete", { messageId });
  }


  // Handle file upload
  async function handleFileUpload(file) {
    if (!file) return;
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("communityId", communityId);
      
      const res = await axios.post(
        `${apiBase}/api/community/${communityId}/chat/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (res.data.success) {
        socket.emit("community:message:create", {
          text: res.data.fileUrl,
          fileType: file.type.startsWith('image/') ? 'image' : 'file',
          fileName: file.name
        });
      }
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  }


  // Inline editor state
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState(null);


  function startEdit(m) {
    setEditingId(m._id);
    setEditDraft(m.text || "");
  }


  function submitEdit() {
    requestEdit(editingId, editDraft);
    setEditingId(null);
    setEditDraft("");
  }


  function cancelReply() {
    setReplyingTo(null);
  }


  function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
  }


  function formatDate(date) {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (today.toDateString() === messageDate.toDateString()) {
      return "Today";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === messageDate.toDateString()) {
      return "Yesterday";
    }
    
    return messageDate.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }


  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDate = null;
    
    messages.forEach(message => {
      const messageDate = formatDate(message.createdAt);
      
      if (messageDate !== currentDate) {
        groups.push({
          type: 'date',
          date: messageDate,
          id: messageDate + Math.random()
        });
        currentDate = messageDate;
      }
      
      groups.push({
        type: 'message',
        ...message
      });
    });
    
    return groups;
  }, [messages]);


  // Render error state
  if (error) {
    return (
      <div className="chat-room error-state">
        <div className="chat-error">
          <h3>Error loading chat</h3>
          <p>{error.message || "Failed to connect to chat"}</p>
          <button onClick={() => setError(null)} className="retry-btn">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className={`chat-room ${compact ? 'compact' : ''}`}>
      {/* Messages List */}
      <div className="chat-list" ref={listRef}>
        {loading ? (
          <div className="chat-loading">
            <div className="loading-spinner"></div>
            <span>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <FontAwesomeIcon icon={faUser} className="empty-icon" />
            <h3>No messages yet</h3>
            <p>Start the conversation by sending a message!</p>
          </div>
        ) : (
          <div className="messages-container">
            {olderLoading && (
              <div className="loading-older">
                <div className="loading-spinner small"></div>
                Loading older messages...
              </div>
            )}
            
            {groupedMessages.map((item) => {
              if (item.type === 'date') {
                return (
                  <div key={item.id} className="date-divider">
                    <span>{item.date}</span>
                  </div>
                );
              }


              const m = item;
              const mine = String(m?.sender?._id || m?.sender) === String(currentUserId);
              const deleted = !!m.deletedAt;
              const isHovered = hoveredMessage === m._id;


              return (
                <div 
                  key={m._id} 
                  className={`message-item ${mine ? 'mine' : 'theirs'} ${deleted ? 'deleted' : ''}`}
                  onMouseEnter={() => setHoveredMessage(m._id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  {/* Reply context */}
                  {m.replyTo && (
                    <div className="reply-context">
                      <FontAwesomeIcon icon={faReply} />
                      <span>Replying to {m.replyTo.sender?.name || 'User'}</span>
                    </div>
                  )}


                  <div className="message-content">
                    {!mine && (
                      <div className="sender-avatar">
                        {m.sender?.profileImage?.url ? (
                          <img src={m.sender.profileImage.url} alt={m.sender.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {m.sender?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                    )}


                    <div className="message-bubble">
                      {!mine && (
                        <div className="message-sender">{m.sender?.name || 'User'}</div>
                      )}
                      
                      {editingId === m._id ? (
                        <div className="edit-container">
                          <input
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                submitEdit();
                              }
                              if (e.key === 'Escape') {
                                setEditingId(null);
                                setEditDraft('');
                              }
                            }}
                            placeholder="Edit your message..."
                            autoFocus
                          />
                          <div className="edit-actions">
                            <button onClick={submitEdit} className="confirm-edit">
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button onClick={() => { setEditingId(null); setEditDraft(''); }} className="cancel-edit">
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {m.fileType === 'image' ? (
                            <div className="message-image">
                              <img src={m.text} alt="Shared image" />
                            </div>
                          ) : m.fileType === 'file' ? (
                            <div className="message-file">
                              <FontAwesomeIcon icon={faPaperclip} />
                              <span>{m.fileName}</span>
                              <a href={m.text} download>Download</a>
                            </div>
                          ) : (
                            <div className="message-text">
                              {deleted ? (
                                <span className="deleted-text">
                                  <FontAwesomeIcon icon={faXmark} className="deleted-icon" />
                                  Message deleted
                                </span>
                              ) : (
                                m.text
                              )}
                            </div>
                          )}
                          
                          <div className="message-meta">
                            <span className="message-time">
                              {formatTime(m.createdAt)}
                              {m.editedAt && <span className="edited-indicator"> (edited)</span>}
                            </span>
                          </div>
                        </>
                      )}
                    </div>


                    {mine && (
                      <div className="sender-avatar">
                        {m.sender?.profileImage?.url ? (
                          <img src={m.sender.profileImage.url} alt={m.sender.name} />
                        ) : (
                          <div className="avatar-placeholder mine">
                            {m.sender?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>


                  {/* Message actions */}
                  {!deleted && mine && isHovered && editingId !== m._id && (
                    <div className="message-actions">
                      <button 
                        onClick={() => startEdit(m)} 
                        className="action-btn"
                        title="Edit message"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => requestDelete(m._id)} 
                        className="action-btn delete"
                        title="Delete message"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                      <button 
                        onClick={() => setReplyingTo(m)} 
                        className="action-btn"
                        title="Reply to message"
                      >
                        <FontAwesomeIcon icon={faReply} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Reply Preview */}
      {replyingTo && (
        <div className="reply-preview">
          <div className="reply-preview-content">
            <FontAwesomeIcon icon={faReply} />
            <div className="reply-info">
              <span>Replying to {replyingTo.sender?.name || 'User'}</span>
              <p>{replyingTo.text?.substring(0, 100)}{replyingTo.text?.length > 100 ? '...' : ''}</p>
            </div>
            <button onClick={cancelReply} className="cancel-reply">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}


      {/* Message Input */}
      <div className="chat-composer">
        <div className="composer-actions">
          <button
            type="button"
            className="action-btn"
            onClick={() => setShowEmoji(v => !v)}
            title="Add emoji"
          >
            <FontAwesomeIcon icon={faSmile} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files[0])}
            accept="image/*,.pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
          />
        </div>


        <div className="input-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={replyingTo ? `Replying to ${replyingTo.sender?.name || 'User'}...` : "Message"}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows="1"
          />
          
          {showEmoji && (
            <div className="emoji-picker-container">
              <Picker
                data={data}
                onEmojiSelect={onEmojiSelect}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
                searchPosition="sticky"
                navPosition="top"
              />
            </div>
          )}
        </div>


        <button 
          onClick={sendMessage} 
          disabled={!text.trim()}
          className="send-btn"
          title="Send message"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}
