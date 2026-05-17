import { useState, useEffect, useCallback, useRef, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, RefreshCw, PenLine, BookOpen, Layers, Palette, RotateCcw } from "lucide-react";
import { cn } from "./lib/utils";
import ReactMarkdown from "react-markdown";
import { LivingWord } from "./components/LivingWord";
import { useDoodleMode } from "./context/DoodleContext";

interface Atmosphere {
  primaryColor: string;
  secondaryColor: string;
  mood: string;
  keywords: string[];
  intensity: number;
}

export default function App() {
  const [text, setText] = useState("");
  const [backdropText, setBackdropText] = useState("");
  const [atmosphere, setAtmosphere] = useState<Atmosphere | null>(null);
  const [isAtmospherePending, startAtmosphereTransition] = useTransition();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [continuation, setContinuation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isDoodleMode, toggleDoodleMode } = useDoodleMode();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const analyzeAtmosphere = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setAtmosphere(data);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setContinuation(data.continuation);
    } catch (err) {
      console.error("Continuation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const focusTextarea = useCallback((position?: number) => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      if (typeof position === "number") {
        textareaRef.current.setSelectionRange(position, position);
      }
    }
  }, []);

  const resetText = () => {
    if (window.confirm("Are you sure you want to clear your writing?")) {
      setText("");
      setBackdropText("");
      setAtmosphere(null);
      setContinuation(null);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    startAtmosphereTransition(() => {
      setBackdropText(val);
    });
  };

  const renderedBackdropText = useMemo(() => {
    if (!backdropText) return null;
    const tokens = backdropText.split(/(\s+)/);
    let cumulativeOffset = 0;
    
    return tokens.map((token, i) => {
      const offset = cumulativeOffset;
      cumulativeOffset += token.length;

      if (/\s+/.test(token)) {
        return (
          <span 
            key={i} 
            onClick={() => focusTextarea(offset)}
            className="cursor-text pointer-events-auto"
          >
            {token}
          </span>
        );
      }
      return (
        <LivingWord 
          key={i} 
          word={token} 
          onClick={() => focusTextarea(offset)} 
        />
      );
    });
  }, [backdropText, focusTextarea]);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center selection:bg-black/10">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 transition-all duration-[3000ms] ease-in-out -z-10"
        style={{
          background: atmosphere 
            ? `radial-gradient(circle at 50% 50%, ${atmosphere.secondaryColor}22 0%, ${atmosphere.primaryColor}11 100%)`
            : "radial-gradient(circle at 50% 50%, #f3f4f6 0%, #ffffff 100%)"
        }}
      />
      
      {/* Atmospheric Particles/Blobs */}
      <AnimatePresence>
        {atmosphere && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: atmosphere.intensity }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -z-10 pointer-events-none"
          >
            <motion.div 
              animate={{ 
                x: [0, 50, -30, 0],
                y: [0, -40, 20, 0],
                scale: [1, 1.2, 0.9, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px]"
              style={{ backgroundColor: atmosphere.primaryColor }}
            />
            <motion.div 
              animate={{ 
                x: [0, -60, 40, 0],
                y: [0, 30, -50, 0],
                scale: [1, 0.8, 1.1, 1]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
              style={{ backgroundColor: atmosphere.secondaryColor }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="w-full max-w-[1400px] px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row justify-between items-center gap-6 z-20">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-white shadow-xl shrink-0">
            <PenLine size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Inksight</h1>
            <p className="text-xs text-ink/40 font-mono uppercase tracking-widest">Interactive Writing</p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={resetText}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all bg-white border border-black/5 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
            title="Reset writing"
          >
            <RotateCcw size={16} />
          </button>

          <button 
            onClick={toggleDoodleMode}
            className={cn(
              "flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm border whitespace-nowrap",
              isDoodleMode 
                ? "bg-amber-100 border-amber-200 text-amber-700 shadow-inner" 
                : "bg-white border-black/5 hover:border-black/20"
            )}
          >
            <Palette size={16} className={isDoodleMode ? "animate-pulse" : ""} />
            <span className="hidden sm:inline">{isDoodleMode ? "Doodle On" : "Doodle Off"}</span>
            <span className="sm:hidden">{isDoodleMode ? "On" : "Off"}</span>
          </button>

          <button 
            onClick={analyzeAtmosphere}
            disabled={isAnalyzing || !text}
            className={cn(
              "flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm whitespace-nowrap",
              "bg-white border border-black/5 hover:border-black/20 hover:shadow-md",
              "disabled:opacity-50 disabled:cursor-not-allowed group"
            )}
          >
            {isAnalyzing ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Sparkles className="group-hover:text-amber-500 transition-colors" size={16} />
            )}
            <span className="hidden sm:inline">Breathe Life</span>
            <span className="sm:hidden">Analyse</span>
          </button>
        </div>
      </header>

      <main className="w-full max-w-[1400px] flex flex-col lg:flex-row gap-8 md:gap-12 px-4 md:px-8 pb-20 z-10 flex-1">
        <section className="flex-1 flex flex-col gap-6 w-full">
          <div className="mirror-container flex-1 min-h-[400px] md:min-h-[500px]">
             <div 
              ref={backdropRef}
              className={cn(
                "mirror-backdrop",
                atmosphere ? "text-ink" : "text-ink/80"
              )}
            >
              {renderedBackdropText}
            </div>
             <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onScroll={handleScroll}
              placeholder=""
              className="mirror-textarea"
            />
            
            <AnimatePresence>
              {!text && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 md:p-12 text-center"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="text-amber-500/30 mb-6" size={48} />
                  </motion.div>
                  <h2 className="text-2xl md:text-4xl font-serif text-ink/10 italic leading-tight max-w-lg">
                    Begin your story...<br/>
                    <span className="text-lg md:text-xl opacity-50">Watch your words breathe and take shape.</span>
                  </h2>
                  <div className="mt-12 flex gap-12">
                    {["fire", "water", "forest", "heart"].map((word, i) => (
                      <motion.span 
                        key={word}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.05 }}
                        transition={{ delay: 0.5 + i * 0.2 }}
                        className="text-[10px] font-mono text-ink uppercase tracking-[0.5em] blur-[0.5px]"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ambient visual hint */}
            <div className="absolute top-0 left-0 w-1 h-full bg-black/5 rounded-full" />
          </div>
        </section>

        <aside className="w-full lg:w-80 flex flex-col gap-6">
          <div className="lg:sticky lg:top-10 flex flex-col gap-6">
            {/* Atmosphere Card */}
            <motion.div 
              layout
              className="p-6 rounded-3xl glass-panel shadow-sm border border-black/5 flex flex-col gap-4"
            >
            <div className="flex items-center gap-2 text-ink/40 mb-1">
              <Layers size={14} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Resonance</span>
            </div>
            
            {atmosphere ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-serif italic mb-1 capitalize">{atmosphere.mood}</h3>
                  <div className="flex gap-2 flex-wrap">
                    {atmosphere.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-black/5 text-[10px] font-medium uppercase text-ink/60 tracking-wider">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-black/5 w-full" />
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-ink/30 uppercase tracking-widest">Intensity</p>
                  <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${atmosphere.intensity * 100}%` }}
                      className="h-full bg-black"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink/40 italic">Wait until the words find their shape...</p>
            )}
          </motion.div>

          {/* AI Helper Card */}
          <motion.div 
            layout
            className="p-6 rounded-3xl glass-panel shadow-sm border border-black/5 flex flex-col gap-4 min-h-[200px]"
          >
            <div className="flex items-center gap-2 text-ink/40 mb-1">
              <BookOpen size={14} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Expansion</span>
            </div>

            {continuation ? (
              <div className="text-sm leading-relaxed text-ink/80 markdown-body">
                <ReactMarkdown>{continuation}</ReactMarkdown>
                <button 
                  onClick={() => setContinuation(null)}
                  className="mt-4 text-[10px] font-mono uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                >
                  Clear Whisper
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 flex-1">
                <p className="text-sm text-ink/40 italic mt-auto">Need a path forward?</p>
                <button 
                  onClick={handleContinue}
                  disabled={isGenerating || !text}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-ink text-white text-xs font-semibold hover:bg-ink/90 transition-all disabled:opacity-30 group"
                >
                  {isGenerating ? (
                    <RefreshCw className="animate-spin" size={14} />
                  ) : (
                    <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  )}
                  Whisper Path
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </aside>
      </main>

      {/* Floating Status */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-10 px-6 py-3 rounded-full bg-white shadow-2xl border border-black/5 font-mono text-[10px] uppercase tracking-[0.2em] z-50 pointer-events-none"
          >
            Analyzing the soul of the text...
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 w-full p-6 text-center pointer-events-none opacity-20 hidden md:block">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Every word has a pulse</p>
      </footer>
    </div>
  );
}
