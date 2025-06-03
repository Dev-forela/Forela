import React from 'react';

interface ActivityOverlayProps {
  open: boolean;
  onClose: () => void;
  activity: any;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onReplace: () => void;
  onCompleteToggle: () => void;
  isCompleted: boolean;
  children?: React.ReactNode;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(49,29,0,0.18)',
  zIndex: 20000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.3s',
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '1rem',
  boxShadow: '0 8px 32px rgba(49,29,0,0.18)',
  maxWidth: 400,
  width: '95vw',
  maxHeight: '95vh',
  overflowY: 'auto',
  position: 'relative',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
};

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 8,
  padding: '1rem 1rem 0.5rem 1rem',
};

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 6,
  cursor: 'pointer',
  fontSize: 22,
  color: '#A36456',
  outline: 'none',
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
};

const actionBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  padding: '0 1rem 1rem 1rem',
};

const actionBtnStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  borderRadius: 8,
  padding: '0.75rem 0',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  background: '#D99C8F',
  color: '#fff',
  transition: 'background 0.2s',
};

const completeBtnStyle: React.CSSProperties = {
  ...actionBtnStyle,
  background: '#082026',
};

const ActivityOverlay: React.FC<ActivityOverlayProps> = ({
  open,
  onClose,
  activity,
  isBookmarked,
  onBookmarkToggle,
  onReplace,
  onCompleteToggle,
  isCompleted,
  children,
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={overlayStyle}
      onClick={onClose}
    >
      <div
        style={modalStyle}
        onClick={e => e.stopPropagation()}
      >
        {/* Top section: Image | Title/Sub | Bookmark/X */}
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '1.5rem 1.5rem 0 1.5rem', gap: 20 }}>
          {/* Image */}
          <img
            src={activity?.image}
            alt={activity?.title}
            style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
          />
          {/* Title & Subtitle */}
          <div style={{
            width: 169,
            height: 75,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 4,
            marginLeft: 0,
            marginRight: 0,
          }}>
            <div style={{
              fontFamily: 'Neue Haas Grotesk Text Pro, Inter, Arial, sans-serif',
              fontWeight: 500,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: 0,
              color: '#311D00',
              margin: 0,
              marginBottom: 6,
            }}>{activity?.title}</div>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 400,
              fontSize: 14,
              color: '#A36456',
              margin: 0,
              marginBottom: 0,
              opacity: 0.95,
            }}>{activity?.subtitle || 'Low-FODMAP, dairy-free, and flavorful without irritants.'}</div>
          </div>
          {/* Bookmark & X */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginLeft: 'auto' }}>
            <button style={iconBtnStyle} aria-label="Bookmark" onClick={onBookmarkToggle}>
              {isBookmarked ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#D99C8F" stroke="#D99C8F"><path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2Z"/></svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D99C8F" strokeWidth="2"><path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2Z"/></svg>
              )}
            </button>
            <button style={{ ...iconBtnStyle, fontSize: 32, marginTop: -4 }} aria-label="Close" onClick={onClose}>×</button>
          </div>
        </div>
        {/* Action buttons */}
        <div style={{ ...actionBarStyle, padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
          <button style={actionBtnStyle} onClick={onReplace}>Replace</button>
          <button style={completeBtnStyle} onClick={onCompleteToggle}>
            {isCompleted ? 'Completed' : 'Not Started'}
          </button>
        </div>
        {/* Divider line */}
        <div style={{
          width: 322,
          height: 1,
          background: '#311D00',
          opacity: 0.2,
          margin: '0 auto 1.5rem auto',
        }} />
        {/* Main content */}
        <div style={{ padding: '0 1.5rem 2rem 1.5rem' }}>{
          React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type === 'img') {
              return null;
            }
            return child;
          })
        }</div>
      </div>
    </div>
  );
};

export default ActivityOverlay; 