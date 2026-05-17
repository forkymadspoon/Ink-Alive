import React from 'react';
import { motion, Variants } from 'motion/react';

interface DoodleProps {
  type: string;
  color: string;
  pos: 'noun' | 'verb' | 'adj';
}

export const DoodleRenderer = ({ type, color, pos }: DoodleProps) => {
  const isVerb = pos === 'verb';

  const drawVariants: Variants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" as const }
    }
  };

  const idlerVariants: Variants = {
    animate: {
      scale: isVerb ? [1, 1.1, 1] : [1, 1.05, 1],
      rotate: isVerb ? [-5, 5, -5] : [-1, 1, -1],
      x: isVerb ? [-2, 2, -2] : [0, 0, 0],
      transition: { 
        duration: isVerb ? 0.6 : 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  };

  return (
    <motion.div 
      variants={idlerVariants}
      animate="animate"
      className="w-full h-full flex items-center justify-center p-1"
      style={{ aspectRatio: '1/1' }}
    >
      <div className="w-full h-full relative flex items-center justify-center">
        {(() => {
          const svgProps = {
            viewBox: "0 0 100 100",
            className: "w-full h-full",
            preserveAspectRatio: "xMidYMid meet"
          };

          switch (type) {
            case 'solar':
              return (
                <svg {...svgProps}>
                  <motion.circle
                    cx="50" cy="50" r="20"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  {[...Array(8)].map((_, i) => (
                    <motion.line
                      key={i}
                      x1="50" y1="20" x2="50" y2="5"
                      stroke={color} strokeWidth="3" strokeLinecap="round"
                      transform={`rotate(${i * 45} 50 50)`}
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                  ))}
                </svg>
              );
            case 'water':
              return (
                <svg {...svgProps}>
                  <motion.path
                    d="M50,20 Q70,50 50,80 Q30,50 50,20"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  <motion.path
                    d="M30,30 Q40,40 30,50"
                    fill="none" stroke={color} strokeWidth="2"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  {isVerb && (
                    <motion.path
                       d="M10,80 Q50,60 90,80"
                       fill="none" stroke={color} strokeWidth="2"
                       strokeDasharray="4 4"
                       animate={{ x: [-10, 10, -10] }}
                       transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </svg>
              );
            case 'love':
              return (
                <svg {...svgProps}>
                  <motion.path
                    d="M50,30 C35,10 10,30 50,80 C90,30 65,10 50,30"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  {isVerb && (
                    <motion.circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke={color} strokeWidth="1"
                      strokeDasharray="2 6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </svg>
              );
            case 'nature':
              return (
                <svg {...svgProps}>
                  <motion.path
                    d="M50,10 L80,60 L65,60 L85,90 L15,90 L35,60 L20,60 Z"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  <motion.line
                    x1="50" y1="90" x2="50" y2="95"
                    stroke={color} strokeWidth="4"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                </svg>
              );
            case 'night':
              return (
                <svg {...svgProps}>
                  <motion.path
                    d="M30,20 Q60,20 60,50 Q60,80 30,80 Q50,80 50,50 Q50,20 30,20"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                </svg>
              );
            case 'chaos':
              return (
                <svg {...svgProps}>
                  <motion.path
                    d="M10,10 L30,40 L10,70 L50,50 L90,70 L70,40 L90,10 L50,30 Z"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  {isVerb && (
                    <motion.path
                      d="M20,20 L80,80 M80,20 L20,80"
                      stroke={color} strokeWidth="1"
                      animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </svg>
              );
            case 'movement':
              return (
                <svg {...svgProps}>
                   <motion.path
                    d="M10,50 L40,50 L50,20 L60,80 L70,50 L90,50"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  {isVerb && (
                    <motion.path
                      d="M5,40 L25,40 M5,60 L25,60"
                      stroke={color} strokeWidth="2"
                      animate={{ x: [0, 10, 0], opacity: [1, 0, 1] }}
                      transition={{ duration: 0.4, repeat: Infinity }}
                    />
                  )}
                </svg>
              );
            case 'calm':
              return (
                <svg {...svgProps}>
                  <motion.path
                    d="M10,50 Q50,30 90,50"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  <motion.path
                    d="M10,70 Q50,50 90,70"
                    fill="none" stroke={color} strokeWidth="2"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                </svg>
              );
            case 'rainbow':
              return (
                 <svg {...svgProps}>
                  <motion.path
                    d="M10,80 Q50,10 90,80"
                    fill="none" stroke="#ef4444" strokeWidth="4"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                   <motion.path
                    d="M20,85 Q50,25 80,85"
                    fill="none" stroke="#3b82f6" strokeWidth="4"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                </svg>
              );
            case 'air':
              return (
                <svg {...svgProps}>
                  <motion.path
                    d="M20,40 Q50,20 80,40"
                    fill="none" stroke={color} strokeWidth="2"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  <motion.path
                    d="M10,60 Q50,40 90,60"
                    fill="none" stroke={color} strokeWidth="2"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  {isVerb && (
                    <motion.path
                      d="M30,30 L20,20 M70,30 L80,20"
                      stroke={color} strokeWidth="1"
                      animate={{ x: [0, 20], opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </svg>
              );
            case 'electric':
              return (
                <svg {...svgProps}>
                  <motion.path
                    d="M50,10 L30,50 L70,50 L50,90"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  {isVerb && (
                    <motion.circle
                      cx="50" cy="50" r="45"
                      fill="none" stroke={color} strokeWidth="1"
                      strokeDasharray="2 4"
                      animate={{ opacity: [0.2, 1, 0.2], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                    />
                  )}
                </svg>
              );
            case 'cosmic':
              return (
                <svg {...svgProps}>
                  <motion.circle
                    cx="50" cy="50" r="2"
                    fill={color}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.path
                    d="M20,50 A30,10 0 1,0 80,50 A30,10 0 1,0 20,50"
                    fill="none" stroke={color} strokeWidth="1"
                    variants={drawVariants}
                  />
                  <motion.circle
                    cx="50" cy="50" r="10"
                    fill="none" stroke={color} strokeWidth="2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </svg>
              );
            case 'tech':
              return (
                <svg {...svgProps}>
                   <motion.path
                    d="M30,30 L70,30 L70,70 L30,70 Z"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                  />
                  <motion.path
                    d="M30,50 L70,50 M50,30 L50,70"
                    stroke={color} strokeWidth="1"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </svg>
              );
            case 'time':
              return (
                <svg {...svgProps}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="3" />
                  <motion.line
                    x1="50" y1="50" x2="50" y2="25"
                    stroke={color} strokeWidth="3" strokeLinecap="round"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "50px", originY: "50px" }}
                  />
                  <motion.line
                    x1="50" y1="50" x2="70" y2="50"
                    stroke={color} strokeWidth="2" strokeLinecap="round"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "50px", originY: "50px" }}
                  />
                </svg>
              );
            default:
              return null;
          }
        })()}
      </div>
    </motion.div>
  );
};
