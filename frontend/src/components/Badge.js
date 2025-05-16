import React from 'react';
import './Badge.css';

export const Badge = ({ children, className = '' }) => (
  <span className={`custom-badge ${className}`}>
    {children}
  </span>
);
