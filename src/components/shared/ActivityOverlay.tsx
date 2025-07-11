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
  maxWidth: 520,
  width: '98vw',
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
  background: '#635850',
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
            minWidth: 0,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 4,
            marginLeft: 0,
            marginRight: 0,
          }}>
            <h3 style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Inter, Arial, Helvetica, sans-serif',
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--color-text-main)',
              marginBottom: '1rem',
              marginLeft: 0,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}>{activity?.title}</h3>
            <div style={{
              fontFamily: 'Inter, Arial, Helvetica, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              color: '#A36456',
              margin: 0,
              marginBottom: 0,
              opacity: 0.95,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
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
          width: 'calc(100% - 48px)', // 24px padding on each side
          height: 1,
          background: '#311D00',
          opacity: 0.2,
          margin: '12px auto 1.5rem auto',
        }} />
        {/* Main content */}
        <div style={{ padding: '0 1.5rem 2rem 1.5rem' }}>
          <div style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontSize: 16, color: '#311D00', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Ingredients</div>
            <div style={{ fontWeight: 500, marginBottom: 2 }}>For the Soup:</div>
            <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 8 }}>
              <li>1 small head of cauliflower, cut into florets</li>
              <li>1 medium carrot, sliced</li>
              <li>1 small parsnip (optional, for sweetness), peeled & chopped</li>
              <li>2 tablespoons olive oil</li>
              <li>½ teaspoon dried thyme</li>
              <li>½ teaspoon ground turmeric (optional, anti-inflammatory)</li>
              <li>2½ cups low-sodium vegetable broth (IC-friendly, no onion/garlic)</li>
              <li>½ cup unsweetened coconut milk (from a can or carton — IC-safe)</li>
              <li>Sea salt & black pepper (if tolerated), to taste</li>
            </ul>
            <div style={{ fontWeight: 500, marginBottom: 2 }}>For Topping:</div>
            <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 12 }}>
              <li>2 tablespoons coconut milk (for swirl)</li>
              <li>Microgreens (e.g., pea shoots, broccoli sprouts, or radish microgreens — IC-safe in small amounts)</li>
              <li>Optional: a few pink peppercorns or chive oil for garnish</li>
            </ul>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Instructions</div>
            <ol style={{ margin: 0, paddingLeft: 18, marginBottom: 12 }}>
              <li><b>Roast the Veggies</b>
                <ul>
                  <li>Preheat oven to 400°F (200°C).</li>
                  <li>Toss cauliflower, carrot, and parsnip with olive oil, thyme, turmeric, and sea salt.</li>
                  <li>Roast for 25–30 minutes, until golden and tender.</li>
                </ul>
              </li>
              <li><b>Blend the Soup</b>
                <ul>
                  <li>Transfer roasted vegetables to a blender or use an immersion blender.</li>
                  <li>Add broth and ½ cup coconut milk, and blend until smooth.</li>
                  <li>If needed, add a bit more broth for a thinner texture.</li>
                </ul>
              </li>
              <li><b>Warm and Adjust</b>
                <ul>
                  <li>Pour blended soup into a pot and warm over medium-low heat.</li>
                  <li>Taste and adjust salt or herbs.</li>
                </ul>
              </li>
              <li><b>Serve</b>
                <ul>
                  <li>Ladle into bowls.</li>
                  <li>Swirl a spoonful of coconut milk on top.</li>
                  <li>Garnish with microgreens and optional pink peppercorns or herbs.</li>
                </ul>
              </li>
            </ol>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Why It Works</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>No onions, garlic, or acidic ingredients.</li>
              <li>Roasting adds natural sweetness without needing extra sugar.</li>
              <li>Coconut milk adds creaminess without dairy irritation.</li>
              <li>Topped with fresh micro greens for texture and nutrients.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityOverlay; 