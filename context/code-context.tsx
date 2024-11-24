'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';

// Code Context
interface SavedCode {
  id: string;
  name: string;
  code: string;
}

interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
  savedCodes: SavedCode[];
  saveCode: (name: string, code: string) => void;
  deleteCode: (index: number) => void;
  reorderCodes: (oldIndex: number, newIndex: number) => void;
  codeError: string | null;
  setCodeError: (error: string | null) => void;
}

const defaultCode = `graph TD
  A[Start] --> B{Is it working?}
  B -->|Yes| C[Great!]
  B -->|No| D[Debug]
  D --> B`;

// Utility functions
const loadSavedCodes = (): SavedCode[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedCodesStr = localStorage.getItem('savedCodes');
    if (savedCodesStr) {
      return JSON.parse(savedCodesStr);
    }
  } catch (error) {
    console.error('Error loading saved codes:', error);
  }
  return [];
};

const saveCodesToStorage = debounce((codes: SavedCode[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('savedCodes', JSON.stringify(codes));
  } catch (error) {
    console.error('Error saving codes:', error);
  }
}, 1000);

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeContextProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState(defaultCode);
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize on client-side only
  useEffect(() => {
    setIsClient(true);
    setSavedCodes(loadSavedCodes());
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      saveCodesToStorage.cancel();
    };
  }, []);

  const saveCode = useCallback((name: string, codeToSave: string) => {
    setSavedCodes(prevCodes => {
      const newCodes = [
        ...prevCodes,
        { 
          id: crypto.randomUUID(), 
          name: name.trim(), 
          code: codeToSave 
        }
      ];
      saveCodesToStorage(newCodes);
      return newCodes;
    });
  }, []);

  const deleteCode = useCallback((index: number) => {
    setSavedCodes(prevCodes => {
      const newCodes = [...prevCodes];
      newCodes.splice(index, 1);
      saveCodesToStorage(newCodes);
      return newCodes;
    });
  }, []);

  const reorderCodes = useCallback((oldIndex: number, newIndex: number) => {
    setSavedCodes(prevCodes => {
      const newCodes = [...prevCodes];
      const [movedItem] = newCodes.splice(oldIndex, 1);
      newCodes.splice(newIndex, 0, movedItem);
      saveCodesToStorage(newCodes);
      return newCodes;
    });
  }, []);

  const handleSetCode = useCallback((newCode: string) => {
    setCode(newCode);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('codeChanged', { detail: newCode }));
    }
  }, []);

  const value = useMemo(() => ({
    code,
    setCode: handleSetCode,
    savedCodes,
    saveCode,
    deleteCode,
    reorderCodes,
    codeError,
    setCodeError
  }), [code, handleSetCode, savedCodes, saveCode, deleteCode, reorderCodes, codeError]);

  return (
    <CodeContext.Provider value={value}>
      {children}
    </CodeContext.Provider>
  );
}

export function useCode() {
  const context = useContext(CodeContext);
  if (context === undefined) {
    throw new Error('useCode must be used within a CodeProvider');
  }
  return context;
}