import React from 'react';
import { motion, Variants } from 'motion/react';

interface DoodleProps {
  type: string;
  color: string;
  pos: 'noun' | 'verb' | 'adj' | 'adv';
  word?: string;
}

const translateVariants: Variants = {
  animate: {
    x: [-4, 4, -4],
    transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
  }
};

const jitterVariants: Variants = {
  animate: {
    x: [-3, 3, -3, -3, 3],
    rotate: [-8, 8, -8],
    transition: { duration: 0.3, repeat: Infinity, ease: "easeInOut" }
  }
};

const breatheVariants: Variants = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.5, 1, 0.5],
    transition: { duration: 0.25, repeat: Infinity, ease: "easeInOut" }
  }
};

const adverbVariants: Variants = {
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
  }
};

const getDefaultVariants = (pos: string): Variants => {
  const isVerb = pos === 'verb';
  return {
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
};

const getIdlerVariants = (type: string, pos: string): Variants => {
  if (type === 'movement' && pos === 'verb') return translateVariants;
  if (type === 'chaos') return jitterVariants;
  if (type === 'calm') return breatheVariants;
  if (type === 'electric') return pulseVariants;
  if (pos === 'adv') return adverbVariants;
  return getDefaultVariants(pos);
};

export const DoodleRenderer = ({ type, color, pos, word }: DoodleProps) => {
  const isVerb = pos === 'verb';
  const cleanWord = word?.toLowerCase().replace(/[.,!?;:]/g, '');

  const drawVariants: Variants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" as const }
    }
  };

  const idlerVariants = getIdlerVariants(type, pos);

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
              if (['flame', 'fire', 'blaze'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.path
                      d="M50,90 C30,70 20,50 35,30 C40,50 45,45 50,20 C55,45 60,50 65,30 C80,50 70,70 50,90"
                      fill="none" stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                    <motion.g
                      animate={{ scaleY: [1, 1.08, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      style={{ originY: "90px" }}
                    />
                  </svg>
                );
              }
              if (['spark', 'flash'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.g
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                    >
                      {[45, 135, 225, 315].map((angle, i) => (
                        <motion.line
                          key={i}
                          x1="50" y1="50"
                          x2={50 + 30 * Math.cos(angle * Math.PI / 180)}
                          y2={50 + 30 * Math.sin(angle * Math.PI / 180)}
                          stroke={color} strokeWidth="3" strokeLinecap="round"
                          variants={drawVariants}
                          initial="initial" animate="animate"
                        />
                      ))}
                    </motion.g>
                  </svg>
                );
              }
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
              if (['rain', 'drizzle'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    {[
                      { x1: 35, y1: 20, y2: 45 },
                      { x1: 50, y1: 10, y2: 35 },
                      { x1: 65, y1: 25, y2: 50 }
                    ].map((line, i) => (
                      <motion.line
                        key={i}
                        x1={line.x1} y1={line.y1}
                        x2={line.x1} y2={line.y2}
                        stroke={color} strokeWidth="3" strokeLinecap="round"
                        variants={{
                          initial: { pathLength: 0, opacity: 0, y: 0 },
                          animate: { 
                            pathLength: 1, 
                            opacity: 1,
                            y: isVerb ? [0, 20] : 0,
                            transition: { 
                              pathLength: { duration: 1 },
                              opacity: { duration: 1 },
                              y: isVerb ? { 
                                duration: 1, 
                                repeat: Infinity, 
                                delay: i * 0.2,
                                ease: "linear"
                              } : { duration: 0 }
                            }
                          }
                        }}
                        initial="initial"
                        animate="animate"
                      />
                    ))}
                  </svg>
                );
              }
              if (['wave', 'flood'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.path
                      d="M10,45 Q30,30 50,45 Q70,60 90,45"
                      fill="none" stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                    <motion.path
                      d="M10,60 Q30,45 50,60 Q70,75 90,60"
                      fill="none" stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                  </svg>
                );
              }
              if (['ice', 'frost'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <motion.g key={i} transform={`rotate(${angle} 50 50)`}>
                        <motion.line
                          x1="50" y1="50" x2="50" y2="20"
                          stroke={color} strokeWidth="3" strokeLinecap="round"
                          variants={drawVariants}
                          initial="initial" animate="animate"
                        />
                        <motion.line
                          x1="46" y1="30" x2="54" y2="30"
                          stroke={color} strokeWidth="3" strokeLinecap="round"
                          variants={drawVariants}
                          initial="initial" animate="animate"
                        />
                      </motion.g>
                    ))}
                  </svg>
                );
              }
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
            case 'mountain':
              return (
                <svg {...svgProps}>
                  <motion.path
                    d="M10,90 L40,30 L60,60 L80,10 L95,90 Z"
                    fill="none" stroke={color} strokeWidth="3"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                  <motion.path
                    d="M30,50 L40,60 M70,30 L80,45"
                    stroke={color} strokeWidth="2"
                    variants={drawVariants}
                    initial="initial" animate="animate"
                  />
                </svg>
              );
            case 'night':
              if (['shadow', 'dark'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.ellipse
                      cx="50" cy="70" rx="43" ry="16"
                      fill={color} opacity="0.1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      transition={{ duration: 1.5 }}
                    />
                    <motion.ellipse
                      cx="50" cy="70" rx="35" ry="12"
                      fill={color} opacity="0.3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ duration: 1.5 }}
                    />
                  </svg>
                );
              }
              if (['star', 'starlight'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.path
                      d="M50,10 L61,35 L89,35 L67,54 L76,79 L50,62 L24,79 L33,54 L11,35 L39,35 Z"
                      fill="none" stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                  </svg>
                );
              }
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
              if (['shatter', 'crack'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    {[
                      "M50,50 L25,20", "M50,50 L80,15", "M50,50 L90,60",
                      "M50,50 L30,85", "M50,50 L15,65"
                    ].map((d, i) => (
                      <motion.path
                        key={i}
                        d={d}
                        fill="none" stroke={color} strokeWidth="3"
                        initial={{ pathLength: 0, opacity: 0, scale: 0 }}
                        animate={{ 
                          pathLength: 1, 
                          opacity: 1, 
                          scale: 1 
                        }}
                        transition={{ 
                          duration: 1, 
                          delay: i * 0.1,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </svg>
                );
              }
              if (['explode', 'burst'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    {[...Array(8)].map((_, i) => (
                      <motion.g key={i} transform={`rotate(${i * 45} 50 50)`}>
                        <motion.line
                          x1="50" y1="30" x2="50" y2="5"
                          stroke={color} strokeWidth="3" strokeLinecap="round"
                          variants={drawVariants}
                          initial="initial" 
                          animate={{ 
                            pathLength: 1, 
                            opacity: 1,
                            scale: [1, 1.3, 1],
                            transition: { 
                              scale: { duration: 0.4, repeat: Infinity },
                              pathLength: { duration: 1.5 },
                              opacity: { duration: 1.5 }
                            }
                          }}
                        />
                        <motion.circle
                          cx="50" cy="5" r="3"
                          fill="none" stroke={color} strokeWidth="3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                        />
                      </motion.g>
                    ))}
                  </svg>
                );
              }
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
              if (['jump', 'leap', 'bounce'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.path
                      d="M20,80 Q50,10 80,80"
                      fill="none" stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                    <motion.circle
                      r="4"
                      fill="none" stroke={color} strokeWidth="3"
                      animate={isVerb ? {
                        x: [20, 50, 80],
                        y: [80, 18, 80],
                        opacity: [0, 1, 0]
                      } : { cx: 50, cy: 18 }}
                      transition={isVerb ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : {}}
                    />
                  </svg>
                );
              }
              if (['fly', 'soar'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.path
                      d="M50,50 Q30,30 10,40"
                      fill="none" stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                    <motion.path
                      d="M50,50 Q70,30 90,40"
                      fill="none" stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                    <motion.line
                      x1="40" y1="50" x2="60" y2="50"
                      stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                  </svg>
                );
              }
              if (['spin', 'whirl'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.path
                      d="M50,50 Q60,40 65,50 Q70,65 50,70 Q30,72 25,50 Q22,28 50,22 Q78,18 82,50"
                      fill="none" stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ originX: "50px", originY: "50px" }}
                    />
                  </svg>
                );
              }
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
              if (['breathe', 'rest', 'sleep'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.path
                      d="M25,50 Q50,35 75,50"
                      fill="none" stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                    {[25, 50, 75].map((x, i) => (
                      <motion.line
                        key={i}
                        x1={x} y1={50} x2={x} y2={55}
                        stroke={color} strokeWidth="2"
                        variants={drawVariants}
                        initial="initial" animate="animate"
                      />
                    ))}
                    {cleanWord === 'sleep' && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                        <path d="M80,30 L90,30 L80,40 L90,40" fill="none" stroke={color} strokeWidth="2" />
                        <path d="M70,45 L78,45 L70,53 L78,53" fill="none" stroke={color} strokeWidth="2" />
                      </motion.g>
                    )}
                  </svg>
                );
              }
              if (['still', 'quiet', 'hush'].includes(cleanWord || '')) {
                return (
                  <svg {...svgProps}>
                    <motion.line
                      x1="20" y1="50" x2="80" y2="50"
                      stroke={color} strokeWidth="3"
                      variants={drawVariants}
                      initial="initial" animate="animate"
                    />
                    <motion.g
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </svg>
                );
              }
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
