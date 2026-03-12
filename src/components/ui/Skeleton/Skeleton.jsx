import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, variant = 'rect', className = '', style = {} }) => {
  const classes = `skeleton-base ${variant === 'circle' ? 'skeleton-circle' : ''} ${className}`;
  
  return (
    <div 
      className={classes} 
      style={{ width, height, ...style }}
    />
  );
};

export default Skeleton;