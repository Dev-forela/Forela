import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'companion';
  timestamp: Date;
  type: 'text' | 'audio';
  audioUrl?: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessage[];
}

const Companion: React.FC = () => {
  const { user } = useAuth();
  const [showPreviousChats, setShowPreviousChats] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('current');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Hi! I'm Ela, your personal health companion. I'm here to support you through your wellness journey, especially with managing autoimmune conditions like Hashimoto's, Endometriosis, and PCOS. I can help you process your feelings, discuss symptoms, and explore coping strategies. How are you feeling today?`,
      sender: 'companion',
      timestamp: new Date(),
      type: 'text'
    }
  ]);

  const [previousChats] = useState<ChatSession[]>([
    {
      id: 'session1',
      title: 'Sleep & Stress Management',
      lastMessage: 'Thanks for helping me understand my sleep patterns better.',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      messages: []
    },
    {
      id: 'session2', 
      title: 'Coping with Flare Days',
      lastMessage: 'Your suggestions for gentle movement really helped.',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      messages: []
    },
    {
      id: 'session3',
      title: 'Building Daily Routines',
      lastMessage: 'I feel more confident about my morning routine now.',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      messages: []
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Use the Netlify function endpoint
      const API_URL = '/.netlify/functions/chat';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          context: `User ID: ${user?.id}. This is a conversation in the Forela health companion app.`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const companionResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: 'companion',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, companionResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response if API fails
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, know that I'm here to support you through whatever you're experiencing.",
        sender: 'companion',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: `Hi! I'm here for our new conversation. I'm Ela, your personal health companion, ready to support you through whatever you're experiencing today. How can I help you?`,
        sender: 'companion',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
    setCurrentChatId(Date.now().toString());
    setShowPreviousChats(false);
  };

  const loadPreviousChat = (chatId: string) => {
    const chat = previousChats.find(c => c.id === chatId);
    if (chat) {
      // For demo purposes, just show a single message
      setMessages([
        {
          id: '1',
          content: `Continuing our conversation about ${chat.title.toLowerCase()}. I'm here to support you - what would you like to explore today?`,
          sender: 'companion',
          timestamp: new Date(),
          type: 'text'
        }
      ]);
      setCurrentChatId(chatId);
      setShowPreviousChats(false);
    }
  };

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        const audioMessage: ChatMessage = {
          id: Date.now().toString(),
          content: "I just recorded a voice message about how I'm feeling today.",
          sender: 'user',
          timestamp: new Date(),
          type: 'audio'
        };
        setMessages(prev => [...prev, audioMessage]);
        
        // AI response to audio
        setTimeout(() => {
          const response: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: "Thank you for sharing your voice message. I can hear the emotion in your voice, and I want you to know that I'm here to listen and support you. Your feelings are valid, and it's okay to have ups and downs in your healing journey.",
            sender: 'companion',
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, response]);
        }, 1500);
      }, 3000);
    }
  };

  // Show loading state if user is not available
  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading user information...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#EAE9E5', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>
      {/* Header with previous chats drawer toggle */}
      <div style={{ 
        background: '#fff', 
        padding: '1.5rem 1.5rem 1rem 4rem', 
        borderBottom: '1px solid #D9CFC2',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Sparkles size={32} color="#A36456" />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#311D00', margin: 0, fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
            Your Companion
          </h1>
        </div>


      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, padding: '1rem 1.5rem', overflowY: 'auto', marginTop: '80px' }}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: 16,
              background: message.sender === 'user' ? '#1E6E8B' : '#fff',
              color: message.sender === 'user' ? '#fff' : '#311D00',
              boxShadow: '0 2px 8px rgba(49,29,0,0.1)',
              fontSize: 15,
              lineHeight: 1.4
            }}>
              {message.type === 'audio' && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  marginBottom: 8,
                  padding: '8px 12px',
                  background: message.sender === 'user' ? 'rgba(255,255,255,0.2)' : '#F5E9E2',
                  borderRadius: 8
                }}>
                  <Mic size={16} color={message.sender === 'user' ? '#fff' : '#A36456'} />
                  <div style={{ 
                    flex: 1, 
                    height: 3, 
                    background: message.sender === 'user' ? 'rgba(255,255,255,0.3)' : '#D9CFC2', 
                    borderRadius: 2 
                  }}>
                    <div style={{ 
                      width: '60%', 
                      height: '100%', 
                      background: message.sender === 'user' ? '#fff' : '#A36456', 
                      borderRadius: 2 
                    }} />
                  </div>
                  <span style={{ fontSize: 12, opacity: 0.8 }}>0:23</span>
                </div>
              )}
              {message.content}
              <div style={{ 
                fontSize: 11, 
                opacity: 0.7, 
                marginTop: 4,
                textAlign: message.sender === 'user' ? 'right' : 'left'
              }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: 16
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: 16,
              background: '#fff',
              color: '#311D00',
              boxShadow: '0 2px 8px rgba(49,29,0,0.1)',
              fontSize: 15,
              lineHeight: 1.4,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <div style={{
                display: 'flex',
                gap: 4
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#A36456',
                  animation: 'dot1 1.4s infinite ease-in-out'
                }} />
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#A36456',
                  animation: 'dot2 1.4s infinite ease-in-out'
                }} />
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#A36456',
                  animation: 'dot3 1.4s infinite ease-in-out'
                }} />
              </div>
              <span style={{ color: '#6F5E53', fontSize: 14 }}>Ela is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ 
        background: '#EAE9E5', 
        padding: '1rem 1.5rem',
        borderTop: '1px solid #D9CFC2'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          background: '#EAE9E5',
          borderRadius: 24,
          padding: '8px 12px',
          border: '1.5px solid #D9CFC2'
        }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              color: '#A36456',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Add attachment"
          >
            <Plus size={20} />
          </button>
          
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 16,
              color: '#311D00',
              padding: '8px 0'
            }}
          />

          <button
            onClick={handleRecordToggle}
            style={{
              background: isRecording ? '#ef4444' : 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              color: isRecording ? '#fff' : '#A36456',
              display: 'flex',
              alignItems: 'center',
              animation: isRecording ? 'pulse 1s infinite' : 'none'
            }}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <Mic size={20} />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isLoading}
            style={{
              background: (currentMessage.trim() && !isLoading) ? '#1E6E8B' : '#D9CFC2',
              border: 'none',
              cursor: (currentMessage.trim() && !isLoading) ? 'pointer' : 'not-allowed',
              padding: 8,
              borderRadius: '50%',
              color: '#fff',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          @keyframes dot1 {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes dot2 {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes dot3 {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes dot2 {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          div[style*="animation: dot2"] {
            animation-delay: 0.2s !important;
          }
          
          div[style*="animation: dot3"] {
            animation-delay: 0.4s !important;
          }
        `
      }} />
    </div>
  );
};

export default Companion; 