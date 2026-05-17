import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DoodleContextType {
  isDoodleMode: boolean;
  toggleDoodleMode: () => void;
}

const DoodleContext = createContext<DoodleContextType | undefined>(undefined);

export function DoodleProvider({ children }: { children: ReactNode }) {
  const [isDoodleMode, setIsDoodleMode] = useState(false);

  const toggleDoodleMode = () => {
    setIsDoodleMode((prev) => !prev);
  };

  return (
    <DoodleContext.Provider value={{ isDoodleMode, toggleDoodleMode }}>
      {children}
    </DoodleContext.Provider>
  );
}

export function useDoodleMode() {
  const context = useContext(DoodleContext);
  if (context === undefined) {
    throw new Error('useDoodleMode must be used within a DoodleProvider');
  }
  return context;
}
