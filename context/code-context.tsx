'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeContextProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]);
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedCodesStr = localStorage.getItem('savedCodes');
    if (savedCodesStr) {
      setSavedCodes(JSON.parse(savedCodesStr));
    }
  }, []);

  const saveCode = useCallback((name: string, codeToSave: string) => {
    setSavedCodes(prevCodes => {
      const newCodes = [...prevCodes, { 
        id: crypto.randomUUID(), 
        name: name.trim(), 
        code: codeToSave 
      }];
      localStorage.setItem('savedCodes', JSON.stringify(newCodes));
      return newCodes;
    });
  }, []);

  const deleteCode = useCallback((index: number) => {
    setSavedCodes(prevCodes => {
      const newCodes = [...prevCodes];
      newCodes.splice(index, 1);
      localStorage.setItem('savedCodes', JSON.stringify(newCodes));
      return newCodes;
    });
  }, []);

  const reorderCodes = useCallback((oldIndex: number, newIndex: number) => {
    setSavedCodes(prevCodes => {
      const newCodes = [...prevCodes];
      const [movedItem] = newCodes.splice(oldIndex, 1);
      newCodes.splice(newIndex, 0, movedItem);
      localStorage.setItem('savedCodes', JSON.stringify(newCodes));
      return newCodes;
    });
  }, []);

  const handleSetCode = useCallback((newCode: string) => {
    setCode(newCode);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('codeChanged', { detail: newCode }));
    }
  }, []);

  return (
    <CodeContext.Provider 
      value={{ 
        code, 
        setCode: handleSetCode, 
        savedCodes, 
        saveCode, 
        deleteCode,
        reorderCodes,
        codeError,
        setCodeError
      }}
    >
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