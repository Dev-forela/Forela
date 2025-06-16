import React, { useState } from 'react';

interface AnimatedMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  color?: string;
}

const AnimatedMenuButton: React.FC<AnimatedMenuButtonProps> = ({ 
  isOpen, 
  onClick, 
  color = '#311D00' 
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        outline: 'none'
      }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div
        style={{
          width: '24px',
          height: '18px',
          position: 'relative',
          transform: 'rotate(0deg)',
          transition: '.5s ease-in-out',
          cursor: 'pointer'
        }}
      >
        <span
          style={{
            display: 'block',
            position: 'absolute',
            height: '2px',
            width: '100%',
            background: color,
            borderRadius: '2px',
            opacity: 1,
            left: 0,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transformOrigin: 'left center',
            transition: '.25s ease-in-out',
            top: isOpen ? '8px' : '0px'
          }}
        />
        <span
          style={{
            display: 'block',
            position: 'absolute',
            height: '2px',
            width: '100%',
            background: color,
            borderRadius: '2px',
            opacity: isOpen ? 0 : 1,
            left: 0,
            transformOrigin: 'left center',
            transition: '.25s ease-in-out',
            top: '8px'
          }}
        />
        <span
          style={{
            display: 'block',
            position: 'absolute',
            height: '2px',
            width: '100%',
            background: color,
            borderRadius: '2px',
            opacity: 1,
            left: 0,
            transform: isOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
            transformOrigin: 'left center',
            transition: '.25s ease-in-out',
            top: isOpen ? '8px' : '16px'
          }}
        />
      </div>
    </button>
  );
};

export default AnimatedMenuButton; 