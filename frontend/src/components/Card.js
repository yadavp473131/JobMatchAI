import React from 'react';
import './Card.css'; // Assuming you're using regular CSS

export const Card = ({ children, className = '' }) => (
  <div className={`custom-card ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="custom-card-content">
    {children}
  </div>
);
