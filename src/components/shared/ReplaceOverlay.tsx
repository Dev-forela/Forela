import React, { useState } from 'react';

interface MealOption {
  id: number;
  image: string;
  title: string;
}

interface ReplaceOverlayProps {
  open: boolean;
  onClose: () => void;
  currentMeal: MealOption;
  mealOptions: MealOption[];
  onReplace: (meal: MealOption) => void;
  headerColor?: string;
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
  maxWidth: 420,
  width: '98vw',
  maxHeight: '95vh',
  overflowY: 'auto',
  position: 'relative',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = (color?: string): React.CSSProperties => ({
  background: color || '#D99C8F',
  borderTopLeftRadius: '1rem',
  borderTopRightRadius: '1rem',
  padding: '1.25rem 1.5rem 1rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

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

const carouselContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  margin: '1.5rem 0 1rem 0',
};

const mealCardStyle = (selected: boolean): React.CSSProperties => ({
  border: selected ? '2px solid #D99C8F' : '2px solid #eee',
  borderRadius: 12,
  background: '#fff',
  width: 90,
  minWidth: 90,
  maxWidth: 90,
  boxShadow: selected ? '0 2px 8px rgba(217,156,143,0.18)' : '0 1px 3px rgba(0,0,0,0.08)',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 8,
  transition: 'border 0.2s, box-shadow 0.2s',
});

const changeBtnStyle: React.CSSProperties = {
  width: '100%',
  margin: '1.5rem 0 1rem 0',
  padding: '0.75rem 0',
  borderRadius: 8,
  border: 'none',
  background: '#D99C8F',
  color: '#fff',
  fontWeight: 600,
  fontSize: 18,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const ReplaceOverlay: React.FC<ReplaceOverlayProps> = ({
  open,
  onClose,
  currentMeal,
  mealOptions,
  onReplace,
  headerColor,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const visibleOptions = mealOptions.slice(carouselIndex, carouselIndex + 3);
  const canScrollLeft = carouselIndex > 0;
  const canScrollRight = carouselIndex + 3 < mealOptions.length;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle(headerColor)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={currentMeal.image} alt={currentMeal.title} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', marginRight: 12 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#311D00' }}>{currentMeal.title}</div>
            </div>
          </div>
          <button style={iconBtnStyle} aria-label="Close" onClick={onClose}>×</button>
        </div>
        {/* Carousel */}
        <div style={carouselContainerStyle}>
          <button style={{ ...iconBtnStyle, opacity: canScrollLeft ? 1 : 0.3 }} onClick={() => setCarouselIndex(i => Math.max(0, i - 1))} disabled={!canScrollLeft}>&lt;</button>
          {visibleOptions.map(option => (
            <div
              key={option.id}
              style={mealCardStyle(selectedId === option.id)}
              onClick={() => setSelectedId(option.id)}
            >
              <img src={option.image} alt={option.title} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', marginBottom: 8 }} />
              <div style={{ fontWeight: 600, fontSize: 14, color: '#311D00', textAlign: 'center' }}>{option.title}</div>
            </div>
          ))}
          <button style={{ ...iconBtnStyle, opacity: canScrollRight ? 1 : 0.3 }} onClick={() => setCarouselIndex(i => Math.min(mealOptions.length - 3, i + 1))} disabled={!canScrollRight}>&gt;</button>
        </div>
        {/* Change Button */}
        <button
          style={changeBtnStyle}
          disabled={selectedId === null || selectedId === currentMeal.id}
          onClick={() => {
            const selected = mealOptions.find(m => m.id === selectedId);
            if (selected) onReplace(selected);
          }}
        >
          Change
        </button>
      </div>
    </div>
  );
};

export default ReplaceOverlay;

// New overlay for sleep, movement, and mental health
interface SectionReplaceOverlayProps {
  open: boolean;
  onClose: () => void;
  currentActivity: { id: number; title: string; image: string };
  activityOptions: { id: number; title: string; image: string }[];
  onReplace: (activity: { id: number; title: string; image: string }, time: string) => void;
  headerColor?: string;
  sectionLabel: string; // e.g. 'sleep', 'movement', 'mental health'
}

const timeOptions = [
  '5 minutes',
  '10 minutes',
  '15 minutes',
  '20 minutes',
  '30 minutes',
  '45 minutes',
  '1 hour',
];

export const SectionReplaceOverlay: React.FC<SectionReplaceOverlayProps> = ({
  open,
  onClose,
  currentActivity,
  activityOptions,
  onReplace,
  headerColor,
  sectionLabel,
}) => {
  const [selectedId, setSelectedId] = useState<number>(currentActivity.id);
  const [selectedTime, setSelectedTime] = useState<string>(timeOptions[0]);

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

  React.useEffect(() => {
    setSelectedId(currentActivity.id);
  }, [currentActivity]);

  if (!open) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle(headerColor)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={currentActivity.image} alt={currentActivity.title} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', marginRight: 12 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#311D00' }}>{currentActivity.title}</div>
            </div>
          </div>
          <button style={iconBtnStyle} aria-label="Close" onClick={onClose}>×</button>
        </div>
        {/* Dropdowns */}
        <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 500, color: '#311D00', fontSize: 15, marginBottom: 6, display: 'block' }}>
              What would you like to work on today?
            </label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 8,
                border: '1.5px solid #D99C8F',
                fontSize: 16,
                fontWeight: 500,
                color: '#311D00',
                background: '#fff',
                marginTop: 4,
                marginBottom: 0,
                outline: 'none',
                boxShadow: 'none',
                appearance: 'none',
              }}
            >
              {activityOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.title}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 500, color: '#311D00', fontSize: 15, marginBottom: 6, display: 'block' }}>
              How much time can you dedicate to your {sectionLabel} today?
            </label>
            <select
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 8,
                border: '1.5px solid #D99C8F',
                fontSize: 16,
                fontWeight: 500,
                color: '#311D00',
                background: '#fff',
                marginTop: 4,
                marginBottom: 0,
                outline: 'none',
                boxShadow: 'none',
                appearance: 'none',
              }}
            >
              {timeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button
            style={changeBtnStyle}
            disabled={selectedId === currentActivity.id && selectedTime === timeOptions[0]}
            onClick={() => {
              const selected = activityOptions.find(a => a.id === selectedId);
              if (selected) onReplace(selected, selectedTime);
            }}
          >
            Replace
          </button>
        </div>
      </div>
    </div>
  );
}; 