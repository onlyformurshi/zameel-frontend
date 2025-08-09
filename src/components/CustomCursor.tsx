import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

const CustomCursor = () => {
  const { isDarkMode } = useThemeStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [delayedPosition, setDelayedPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Cursor configuration
  const innerSize = 10;
  const outerSize = 20;
  const followDelay = 0.1;

  useEffect(() => {
    // Check if it's a touch device
    const checkTouchDevice = () => {
      const isTouchCapable = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
      setIsTouchDevice(isTouchCapable);
      
      // Only hide cursor if it's not a touch device
      if (!isTouchCapable) {
        document.body.style.cursor = 'none';
      }
    };

    checkTouchDevice();

    // Recheck on resize in case of device mode changes (e.g., iPad switching to desktop mode)
    window.addEventListener('resize', checkTouchDevice);

    // Only add mouse event listeners if it's not a touch device
    if (!isTouchDevice) {
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
        setTimeout(() => {
          setDelayedPosition({ x: e.clientX, y: e.clientY });
        }, followDelay * 1000);
      };

      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isHoverable = 
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a');
        
        setIsHovering(!!isHoverable);
      };

      const handleMouseOut = (e: MouseEvent) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        const stillHovering = relatedTarget && (
          relatedTarget.tagName === 'BUTTON' || 
          relatedTarget.tagName === 'A' || 
          relatedTarget.closest('button') || 
          relatedTarget.closest('a')
        );
        setIsHovering(!!stillHovering);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseover', handleMouseOver);
      window.addEventListener('mouseout', handleMouseOut);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseover', handleMouseOver);
        window.removeEventListener('mouseout', handleMouseOut);
        document.body.style.cursor = 'auto';
      };
    }

    return () => {
      window.removeEventListener('resize', checkTouchDevice);
      document.body.style.cursor = 'auto';
    };
  }, [isTouchDevice]);

  // Don't render the custom cursor on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-difference bg-white"
        style={{
          width: innerSize * 2,
          height: innerSize * 2
        }}
        animate={{
          x: position.x - innerSize,
          y: position.y - innerSize,
          scale: isHovering ? 2.5 : 1
        }}
        transition={{
          type: "tween",
          ease: "backOut",
          duration: 0.15
        }}
      />

      {/* Outer ring */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-49 ${
          isDarkMode 
            ? 'border border-white/30' 
            : 'border-2 border-indigo-500/60'
        }`}
        style={{
          width: outerSize * 2,
          height: outerSize * 2
        }}
        animate={{
          x: delayedPosition.x - outerSize,
          y: delayedPosition.y - outerSize,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{
          type: "tween",
          ease: "circOut",
          duration: 0.3
        }}
      />
    </>
  );
};

export default CustomCursor; 