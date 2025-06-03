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
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={topBarStyle}>
          <button style={iconBtnStyle} aria-label="Bookmark" onClick={onBookmarkToggle}>
            {isBookmarked ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#D99C8F" stroke="#D99C8F"><path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2Z"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D99C8F" strokeWidth="2"><path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2Z"/></svg>
            )}
          </button>
          <button style={iconBtnStyle} aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div style={actionBarStyle}>
          <button style={actionBtnStyle} onClick={onReplace}>Replace</button>
          <button style={completeBtnStyle} onClick={onCompleteToggle}>
            {isCompleted ? 'Completed' : 'Not Started'}
          </button>
        </div>
        <div style={{ padding: '0 1rem 1.5rem 1rem' }}>{children}</div>
      </div>
    </div>
  );
};

export default ActivityOverlay; 