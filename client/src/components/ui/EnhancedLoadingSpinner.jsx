import React, { useState, useEffect } from 'react';

export const EnhancedLoadingSpinner = ({ 
  variant = 'default',
  size = 'medium',
  speed = 'normal',
  showText = true,
  customText = 'Loading...',
  colorScheme = 'indigo'
}) => {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate() {
      setRotation(prev => (prev + 1) % 360);
      requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative w-20 h-20">
        <div 
          className="absolute inset-0 border-4 border-indigo-200 rounded-full"
          style={{ borderTopColor: 'rgb(99, 102, 241)', transform: `rotate(${rotation}deg)` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 bg-indigo-600 rounded-full shadow-lg" />
        </div>
      </div>
      {showText && (
        <div className="text-sm text-indigo-600 font-medium mt-3">{customText}</div>
      )}
    </div>
  );
};

const SpinnerShowcase = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <EnhancedLoadingSpinner 
        variant="pulse"
        size="medium"
        speed="normal"
        showText={true}
        colorScheme="indigo"
      />
    </div>
  );
};

export default SpinnerShowcase;
