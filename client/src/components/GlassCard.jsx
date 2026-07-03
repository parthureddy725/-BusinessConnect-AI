import React from 'react';

const GlassCard = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`glass-card ${hoverEffect ? 'glass-card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
