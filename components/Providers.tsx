'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';

// LLM Context
interface LLMModel {
  id: string;
  name: string;
  provider: 'openai' | 'gemini' | 'groq' | 'openai-compatible' | 'custom';
  requiresAuth: boolean;
  requiresBaseUrl?: boolean;
  baseUrl?: string;
  description: string;
}

interface LLMSettings {
  selectedModel: string;
  apiKey?: string;
  baseUrl?: string;
  modelName?: string;
}

interface LLMContextType {
  availableModels: LLMModel[];
  settings: LLMSettings;
  updateSettings: (settings: Partial<LLMSettings>) => void;
  isConfigured: () => boolean;
}

const defaultModels: LLMModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    requiresAuth: true,
    description: 'Most capable OpenAI model for complex tasks',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    requiresAuth: true,
    description: 'Fast and efficient OpenAI model',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'gemini',
    requiresAuth: true,
    description: 'Google\'s advanced language model',
  },
  {
    id: 'openai-compatible',
    name: 'OpenAI Compatible API',
    provider: 'openai-compatible',
    requiresAuth: true,
    requiresBaseUrl: true,
    description: 'Use any OpenAI-compatible API endpoint',
  },
  {
    id: 'llama-3.1-70b-versatile',
    name: 'Llama 3.1 70B (Free Trial)',
    provider: 'groq',
    requiresAuth: false,
    description: 'High-performance open source model',
  },
];

const LLMContext = createContext<LLMContextType | undefined>(undefined);

function LLMProvider({ children }: { children: React.ReactNode }) {
  // Start with a consistent initial state
  const [settings, setSettings] = useState<LLMSettings>({
    selectedModel: 'llama-3.1-70b-versatile',
  });

  // Load saved settings after initial render
  useEffect(() => {
    const saved = localStorage.getItem('llm-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate the saved model still exists
      if (defaultModels.some(m => m.id === parsed.selectedModel)) {
        setSettings(parsed);
      }
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('llm-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<LLMSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const isConfigured = () => {
    const model = defaultModels.find(m => m.id === settings.selectedModel);
    if (!model) return false;

    if (model.requiresAuth && !settings.apiKey) return false;
    if (model.requiresBaseUrl && !settings.baseUrl) return false;

    return true;
  };

  return (
    <LLMContext.Provider value={{
      availableModels: defaultModels,
      settings,
      updateSettings,
      isConfigured,
    }}>
      {children}
    </LLMContext.Provider>
  );
}

export function useLLM() {
  const context = useContext(LLMContext);
  if (context === undefined) {
    throw new Error('useLLM must be used within a LLMProvider');
  }
  return context;
}

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
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

function CodeProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]);

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
        reorderCodes
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

// Mermaid Context
interface MermaidContextType {
  code: string;
  updateCode: (newCode: string) => void;
}

const MermaidContext = createContext<MermaidContextType | undefined>(undefined);

function MermaidProvider({ children }: { children: React.ReactNode }) {
  const { code, setCode } = useCode();

  const updateCode = (newCode: string) => {
    console.log('MermaidProvider updating code:', newCode);
    setCode(newCode);
  };

  return (
    <MermaidContext.Provider value={{ code, updateCode }}>
      {children}
    </MermaidContext.Provider>
  );
}

export function useMermaid() {
  const context = useContext(MermaidContext);
  if (context === undefined) {
    throw new Error('useMermaid must be used within a MermaidProvider');
  }
  return context;
}

// Combined Providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LLMProvider>
      <CodeProvider>
        <MermaidProvider>
          {children}
          <Toaster />
        </MermaidProvider>
      </CodeProvider>
    </LLMProvider>
  );
}
