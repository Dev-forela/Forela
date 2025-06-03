import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Mic, Send, MessageCircle, Sparkles } from 'lucide-react';

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
  const [showPreviousChats, setShowPreviousChats] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('current');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Hi Olivia! I've been reviewing your recent journal entries and activities. I noticed you had a great morning yesterday with yoga and coffee, and you mentioned feeling more rested. How are you feeling today? I'm here to listen and support you through whatever you're experiencing.`,
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

  const generateCompanionResponse = (userMessage: string): string => {
    const messageLower = userMessage.toLowerCase();
    
    // Simple sentiment and keyword-based responses
    if (messageLower.includes('pain') || messageLower.includes('hurt') || messageLower.includes('flare')) {
      return `I hear that you're experiencing pain right now, and I want you to know that your feelings are completely valid. From your recent journal entries, I see you've been managing flare days with gentle movement and pelvic floor lengthening. Would you like to try some breathing exercises, or would you prefer to talk about what's helping you cope today?`;
    }
    
    if (messageLower.includes('tired') || messageLower.includes('exhausted') || messageLower.includes('energy')) {
      return `Fatigue can be so challenging, especially when you're dealing with other symptoms. I noticed in your journal that you've been working on your sleep routine and it seemed to help a few days ago. How has your sleep been lately? Sometimes even small adjustments to rest can make a difference.`;
    }
    
    if (messageLower.includes('anxious') || messageLower.includes('worried') || messageLower.includes('stress')) {
      return `Anxiety and stress can really amplify physical symptoms. I see from your activities that you've been doing meditation and somatic trauma healing work. Those are wonderful tools. Would you like to explore what's triggering these feelings today, or would you prefer some grounding techniques?`;
    }
    
    if (messageLower.includes('better') || messageLower.includes('good') || messageLower.includes('positive')) {
      return `I'm so glad to hear you're feeling better! That's wonderful progress. Looking at your recent entries, it seems like the combination of gentle movement, mindful eating, and your morning routine is really supporting you. What feels like it's contributing most to this positive shift?`;
    }
    
    if (messageLower.includes('art') || messageLower.includes('creative') || messageLower.includes('paint')) {
      return `I loved reading about your inspired art session! Creativity can be such a powerful form of self-expression and healing. You mentioned feeling energized and the colors seeming more vibrant - that sounds like you were really in flow. How has your creative practice been supporting your wellbeing?`;
    }
    
    // Default empathetic response
    return `Thank you for sharing that with me. I can see from your journal entries that you're really committed to understanding and supporting your healing journey. You've been so thoughtful about tracking your activities, mood, and body responses. What would feel most supportive to explore together right now?`;
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    // Simulate AI response delay
    setTimeout(() => {
      const companionResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateCompanionResponse(currentMessage),
        sender: 'companion',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, companionResponse]);
    }, 1500);
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
        content: `Hi Olivia! I'm here for our new conversation. Based on your recent journal entries, I can see you've been focusing on gentle movement, mindful eating, and building supportive routines. How can I support you today?`,
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
          content: `Continuing our conversation about ${chat.title.toLowerCase()}...`,
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Sparkles size={32} color="#A36456" />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#311D00', margin: 0, fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
              Your Companion
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setShowPreviousChats(!showPreviousChats)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                color: '#A36456'
              }}
              aria-label="Toggle previous chats"
            >
              {showPreviousChats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <button
              onClick={startNewChat}
              style={{
                background: '#E2B6A1',
                color: '#8C5A51',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(49,29,0,0.1)'
              }}
              aria-label="Start new chat"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Previous chats drawer */}
        <div style={{
          maxHeight: showPreviousChats ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
          marginTop: showPreviousChats ? 16 : 0
        }}>
          <div style={{ 
            background: '#F5F1ED', 
            borderRadius: 8, 
            padding: showPreviousChats ? 12 : 0,
            transition: 'padding 0.3s ease-in-out'
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#6F5E53', marginBottom: 8 }}>
              Previous Conversations
            </div>
            <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
              {previousChats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => loadPreviousChat(chat.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    marginBottom: 4,
                    background: currentChatId === chat.id ? '#DAEBF0' : '#fff',
                    border: '1px solid #D9CFC2',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 13
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#311D00', marginBottom: 2 }}>
                    {chat.title}
                  </div>
                  <div style={{ color: '#6F5E53', fontSize: 12 }}>
                    {chat.lastMessage}
                  </div>
                </button>
              ))}
            </div>
          </div>
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
            disabled={!currentMessage.trim()}
            style={{
              background: currentMessage.trim() ? '#1E6E8B' : '#D9CFC2',
              border: 'none',
              cursor: currentMessage.trim() ? 'pointer' : 'not-allowed',
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
        `
      }} />
    </div>
  );
};

export default Companion; 