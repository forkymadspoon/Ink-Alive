import { useState, memo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { cn } from "../lib/utils";
import { useDoodleMode } from "../context/DoodleContext";
import { DoodleRenderer } from "./DoodleRenderer";

interface LivingWordProps {
  word: string;
  onClick?: () => void;
}

const CATEGORIES = [
  {
    id: "solar",
    color: "#FF7A00",
    nouns: ["sun", "flame", "summer", "noon", "torch", "fire", "heat", "star", "day", "light", "candle", "bonfire", "lava", "magma", "ember", "spark", "radiance", "dawn"],
    verbs: ["blaze", "glow", "warm", "ignite", "shine", "burn", "radiate", "scorch", "kindle", "flicker", "beam"],
    adjs: ["golden", "bright", "radiant", "solar", "warm", "hot", "brilliant", "sunny", "fiery", "ablaze", "luminous", "vivid"],
    animation: "glow"
  },
  {
    id: "rainbow",
    color: "#FF7A00",
    nouns: ["rainbow", "prism", "color", "spectrum", "palette", "hue", "dye", "paint", "pigment"],
    verbs: ["paint", "color", "tint", "shade"],
    adjs: ["colorful", "vibrant", "chromatic", "multicolored", "vivid", "bright", "saturated"],
    animation: "pulsate"
  },
  {
    id: "water",
    color: "#2C7BE5",
    nouns: ["rain", "ocean", "river", "wave", "frost", "snow", "mist", "flood", "dew", "storm", "ice", "sea", "water", "tear", "brook", "stream", "lake", "pool", "tide", "surf", "glacier", "pond", "fountain"],
    verbs: ["drizzle", "pour", "flow", "rush", "leak", "drip", "splash", "wave", "sink", "swim", "float", "wash", "soak", "drown", "ripple"],
    adjs: ["cold", "blue", "frozen", "wet", "liquid", "aqueous", "deep", "marine", "fluid", "crystal", "clear"],
    animation: "flow"
  },
  {
    id: "nature",
    color: "#2D8C4E",
    nouns: ["forest", "roots", "soil", "leaf", "meadow", "moss", "branch", "seed", "earth", "grass", "vine", "nature", "tree", "bloom", "flower", "garden", "jungle", "petal", "thorn", "stem", "bark", "wood", "flora"],
    verbs: ["grow", "bloom", "sprout", "flourish", "wilt", "plant", "climb", "root", "decay"],
    adjs: ["green", "lush", "natural", "verdant", "wild", "botanical", "earthy", "fertile", "organic"],
    animation: "ripple"
  },
  {
    id: "night",
    color: "#6B3FA0",
    nouns: ["shadow", "darkness", "void", "abyss", "dusk", "midnight", "phantom", "eclipse", "ghost", "night", "moon", "silence", "sleep", "dream", "shade", "twilight", "evening", "cave", "owl"],
    verbs: ["dim", "fade", "obscure", "hide", "sleep", "dream", "haunt", "lurk", "vanish", "drift"],
    adjs: ["dark", "phantom", "secret", "nocturnal", "dim", "eerie", "black", "silent", "dusky", "somber"],
    animation: "fade"
  },
  {
    id: "love",
    color: "#D94F70",
    nouns: ["love", "heart", "joy", "passion", "bliss", "desire", "life", "embrace", "soul", "kiss", "friend", "lover", "warmth", "mercy", "grace", "beauty", "kindness"],
    verbs: ["kiss", "yearn", "ache", "long", "love", "feel", "touch", "hug", "care", "adore", "miss", "hold", "marry", "please"],
    adjs: ["tender", "sweet", "longing", "dear", "beloved", "kind", "gentle", "lovely", "beautiful", "precious"],
    animation: "pulsate"
  },
  {
    id: "chaos",
    color: "#E03C31",
    nouns: ["blood", "fury", "rage", "wound", "wreck", "chaos", "violence", "danger", "death", "war", "storm", "pain", "battle", "venom", "poison", "blade", "weapon", "ruin", "horror", "monster", "ash", "dust"],
    verbs: ["shatter", "scream", "crash", "strike", "burn", "fear", "bleed", "break", "die", "kill", "fight", "crush", "smash", "tear", "rip", "destroy", "choke"],
    adjs: ["dangerous", "violent", "angry", "sharp", "broken", "deadly", "wild", "furious", "grim", "cruel", "harsh"],
    animation: "shake"
  },
  {
    id: "movement",
    color: "#E8A020",
    nouns: ["race", "bolt", "energy", "movement", "speed", "wind", "storm", "flight", "arrow", "rhythm", "beat", "pulse", "echo", "jolt", "shock"],
    verbs: ["dash", "leap", "sprint", "soar", "rush", "burst", "launch", "fly", "run", "whirl", "jump", "escape", "spin", "roll", "fall", "climb", "shake", "dance"],
    adjs: ["quick", "sudden", "fast", "swift", "rapid", "kinetic", "active", "dynamic", "agile"],
    animation: "burst"
  },
  {
    id: "calm",
    color: "#4DADA0",
    nouns: ["peace", "stillness", "calm", "hush", "rest", "sleep", "breath", "zen", "cloud", "feather", "cotton", "pillow", "silk", "wool", "breeze"],
    verbs: ["breathe", "pause", "drift", "whisper", "float", "wait", "sigh", "hum", "rest", "sink"],
    adjs: ["serene", "quiet", "still", "gentle", "soft", "peaceful", "calm", "smooth", "light", "airy", "delicate"],
    animation: "fade"
  },
  {
    id: "air",
    color: "#94A3B8",
    nouns: ["breath", "wind", "breeze", "cloud", "sky", "gale", "vapor", "smoke", "atmosphere", "altitude", "zephyr"],
    verbs: ["blow", "drift", "float", "hover", "sail", "soar", "puff", "whistle"],
    adjs: ["airy", "light", "ethereal", "atmospheric", "weightless", "thin", "lofty"],
    animation: "drift"
  },
  {
    id: "electric",
    color: "#FACC15",
    nouns: ["spark", "light", "flash", "bolt", "current", "power", "lightning", "battery", "wire", "engine", "signal", "static", "circuit"],
    verbs: ["shock", "zap", "surge", "flicker", "buzz", "click", "charge"],
    adjs: ["electric", "bright", "vibrant", "energetic", "artificial", "cyber", "digital", "neon"],
    animation: "flash"
  },
  {
    id: "cosmic",
    color: "#4F46E5",
    nouns: ["star", "galaxy", "nebula", "planet", "orbit", "universe", "comet", "meteor", "asteroid", "void", "space", "gravity"],
    verbs: ["orbit", "drift", "shine", "collapse", "explode", "float"],
    adjs: ["cosmic", "astral", "stellar", "celestial", "infinite", "vast", "galactic"],
    animation: "glow"
  },
  {
    id: "tech",
    color: "#10B981",
    nouns: ["code", "data", "binary", "system", "matrix", "network", "logic", "cyber", "grid", "machine", "pixel", "screen"],
    verbs: ["load", "process", "scan", "trace", "sync", "link"],
    adjs: ["digital", "coded", "virtual", "synthetic", "technical", "logical", "smart"],
    animation: "flash"
  },
  {
    id: "time",
    color: "#71717A",
    nouns: ["time", "clock", "second", "minute", "hour", "year", "epoch", "era", "moment", "rhythm", "tempo", "beat"],
    verbs: ["tick", "stop", "wait", "pass", "measure", "endure"],
    adjs: ["eternal", "ancient", "brief", "fast", "slow", "timeless", "rhythmic"],
    animation: "pulsate"
  }

];

function getSemanticInfo(word: string) {
  const clean = word.toLowerCase().replace(/[.,!?;:]/g, "");
  if (!clean || clean.length < 2) return null;

  const suffixes = ["ing", "s", "ed", "ly", "es", "er", "est", "y"];
  
  for (const cat of CATEGORIES) {
    // Check nouns
    for (const root of cat.nouns) {
      if (clean === root || suffixes.some(s => clean === root + s)) {
        return { ...cat, pos: 'noun' as const, role: 'entity' as const };
      }
    }
    // Check verbs
    for (const root of cat.verbs) {
      if (clean === root || suffixes.some(s => clean === root + s)) {
        return { ...cat, pos: 'verb' as const, role: 'action' as const };
      }
    }
    // Check adjs
    for (const root of cat.adjs) {
      if (clean === root || suffixes.some(s => clean === root + s)) {
        return { ...cat, pos: 'adj' as const, role: 'quality' as const };
      }
    }
  }
  return null;
}

export const LivingWord = memo(function LivingWord({ word, onClick }: LivingWordProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInitialPlaying, setIsInitialPlaying] = useState(true);
  const { isDoodleMode } = useDoodleMode();
  const containerRef = useRef<HTMLSpanElement>(null);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const semanticInfo = getSemanticInfo(word);

  useEffect(() => {
    // Initial animation lasts for a bit then goes dormant
    const timer = setTimeout(() => {
      setIsInitialPlaying(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!semanticInfo) {
    return <span onClick={onClick} className="inline-block transition-colors duration-200">{word}</span>;
  }

  const animationType = semanticInfo.animation;
  const semanticColor = semanticInfo.color;
  const clean = word.toLowerCase().replace(/[.,!?;:]/g, "");

  // Special Styles
  const isRainbow = clean === "rainbow";
  const isSun = clean === "sun";
  const isNounOrVerb = semanticInfo?.pos === 'noun' || semanticInfo?.pos === 'verb';
  const showDoodle = isDoodleMode && isNounOrVerb && !isHovered;

  return (
    <span 
      ref={containerRef}
      className="relative inline-block pointer-events-auto cursor-text will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {/* Dynamic Cursor Glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
              background: semanticColor ? `${semanticColor}15` : "rgba(0,0,0,0.05)",
              boxShadow: `0 0 15px ${semanticColor || "rgba(0,0,0,0.1)"}`,
            }}
            className="absolute top-0 left-0 w-8 h-8 rounded-full blur-sm pointer-events-none -z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showDoodle ? (
          <motion.span
            key="doodle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative inline-flex items-center justify-center align-middle"
          >
            {/* The Anchor: Matches the text version's layout exactly */}
            <span 
              className="opacity-0 select-none px-1 -mx-1 invisible" 
              aria-hidden="true"
            >
              {word}
            </span>
            
            {/* The Visual Overlay: Absolute centered over the anchor's space */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[3.5rem] h-[1.5em] shrink-0">
                <DoodleRenderer type={semanticInfo!.id} color={semanticColor} pos={semanticInfo!.pos} />
              </div>
            </div>
          </motion.span>
        ) : (
          <motion.span
            key="text"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              color: isRainbow ? undefined : semanticColor,
              ...(isHovered || isInitialPlaying || (isDoodleMode && semanticInfo?.pos === 'adj') ? getAnimation(animationType, isInitialPlaying, semanticInfo?.role) : {})
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              color: { duration: 0.2 },
              default: { duration: isInitialPlaying ? 2 : 0.3 } 
            }}
            style={{ 
              backgroundColor: isHovered ? "rgba(255, 255, 255, 0.8)" : "transparent",
              backgroundImage: isRainbow ? "linear-gradient(to right, #ef4444, #f59e0b, #10b981, #3b82f6, #6366f1)" : undefined,
              WebkitBackgroundClip: isRainbow ? "text" : undefined,
              WebkitTextFillColor: isRainbow ? "transparent" : undefined,
              backgroundSize: isRainbow ? "200% auto" : undefined,
              fontWeight: isDoodleMode && semanticInfo?.pos === 'adj' ? 600 : undefined,
              fontStyle: isDoodleMode && semanticInfo?.pos === 'adj' ? 'italic' : undefined,
            }}
            className={cn(
              "inline-block transition-[background-color,transform,font-weight] duration-200 px-1 -mx-1 rounded-sm",
              "underline decoration-dotted underline-offset-4 decoration-ink/10",
              (isHovered || (isInitialPlaying && isSun) || (isDoodleMode && semanticInfo?.pos === 'adj')) ? "scale-105 z-20 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] decoration-ink/40" : ""
            )}
          >
            {word}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Special Solar Micro-animation for 'sun' */}
      {isSun && (isHovered || isInitialPlaying) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2, rotate: 360 }}
          className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
        >
          <div className="w-full h-full rounded-full bg-amber-400/20 blur-md" />
        </motion.div>
      )}

      {/* Burst Effect Overlay */}
      {animationType === "burst" && (
        <AnimatePresence>
          {(isHovered || isInitialPlaying) && (
             <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{ 
                      scale: [0, 1.5, 0.5],
                      x: (Math.random() - 0.5) * 60,
                      y: (Math.random() - 0.5) * 60,
                      opacity: 0
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" as const }}
                    className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full"
                  />
                ))}
             </div>
          )}
        </AnimatePresence>
      )}

      {/* Ripple Effect Overlay */}
      {animationType === "ripple" && (
        <AnimatePresence>
          {(isHovered || isInitialPlaying) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ 
                    scale: 4,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: isInitialPlaying ? 1 : Infinity, 
                    delay: i * 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute w-4 h-4 border border-ink/20 rounded-full"
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
    </span>
  );
});

function getAnimation(type: string, isInitial: boolean = false, role?: 'entity' | 'action' | 'quality'): any {
  const repeat = isInitial ? 1 : Infinity;
  
  // Base transforms based on semantic role
  const roleStyles: any = {};
  if (role === 'action') {
    // Verbs are more kinetic and lean forward
    roleStyles.skewX = [-2, 2, -2];
  } else if (role === 'entity') {
    // Nouns are more grounded but have a "breath"
    roleStyles.scale = [1, 1.05, 1];
  } else if (role === 'quality') {
    // Adjectives have a shimmer/pulsate effect
    roleStyles.opacity = [1, 0.8, 1];
    roleStyles.scale = [1, 1.03, 1];
    roleStyles.filter = ["brightness(1)", "brightness(1.5)", "brightness(1)"];
  }

  const getFinalAnimation = (anim: any) => {
    const merged = { ...roleStyles };
    for (const key in anim) {
      if (Array.isArray(merged[key]) && Array.isArray(anim[key])) {
        // Simple merge strategy: if both are arrays, use the main animation one
        // or we could combine. For now, let the explicit animation override the role shimmer
        // but offset it.
        merged[key] = anim[key];
      } else {
        merged[key] = anim[key];
      }
    }
    return merged;
  };

  switch (type) {
    case "bounce":
      return getFinalAnimation({
        y: [0, -16, 0],
        transition: { duration: 0.4, repeat, ease: "easeOut" }
      });
    case "shake":
      return getFinalAnimation({
        x: [-3, 3, -3, 3, 0],
        rotate: [-2, 2, -2, 2, 0],
        transition: { duration: 0.15, repeat: isInitial ? 4 : Infinity }
      });
    case "burst": // Kinetic displacement for 'run'
      return getFinalAnimation({
        skewX: [0, -20, 0],
        x: [0, 10, 0],
        transition: { duration: 0.3, repeat: isInitial ? 2 : Infinity }
      });
    case "fade":
      return getFinalAnimation({
        opacity: [1, 0.2, 1],
        filter: ["blur(0px)", "blur(6px)", "blur(0px)"],
        transition: { duration: 1.2, repeat }
      });
    case "flow":
      return getFinalAnimation({
        skewX: [-15, 15, -15],
        x: [-2, 2, -2],
        transition: { duration: 1.5, repeat, ease: "easeInOut" as const }
      });
    case "pulsate":
      return getFinalAnimation({
        scale: [1.25, 1.45, 1.25],
        transition: { duration: 0.8, repeat, ease: "easeInOut" }
      });
    case "glow":
      return getFinalAnimation({
        textShadow: [
          "0 0 0px rgba(255,215,0,0)",
          "0 0 20px rgba(255,215,0,0.8)",
          "0 0 0px rgba(255,215,0,0)"
        ],
        transition: { duration: 1.5, repeat }
      });
    case "ripple":
      return getFinalAnimation({
        scale: [1.25, 1.3, 1.25],
        transition: { duration: 1.5, repeat }
      });
    case "flash":
      return getFinalAnimation({
        opacity: [1, 0, 1, 0, 1],
        scale: [1, 1.2, 1, 1.2, 1],
        transition: { duration: 0.3, repeat: isInitial ? 2 : Infinity, ease: "linear" }
      });
    case "drift":
      return getFinalAnimation({
        x: [0, 4, 0, -4, 0],
        y: [0, -2, 2, -2, 0],
        transition: { duration: 4, repeat, ease: "easeInOut" }
      });
    default:
      return roleStyles;
  }
}
