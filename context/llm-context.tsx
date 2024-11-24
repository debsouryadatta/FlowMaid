'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';

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

// Utility functions outside component to avoid recreating them
const defaultSettings = {
  selectedModel: 'llama-3.1-70b-versatile',
} as const;

const loadSettings = (): LLMSettings => {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const saved = localStorage.getItem('llm-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (defaultModels.some(m => m.id === parsed.selectedModel)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return defaultSettings;
};

const saveSettings = debounce((settings: LLMSettings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('llm-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}, 1000);

const LLMContext = createContext<LLMContextType | undefined>(undefined);

export function LLMContextProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<LLMSettings>(defaultSettings);
  const [isClient, setIsClient] = useState(false);

  // One-time initialization on client-side
  useEffect(() => {
    setIsClient(true);
    setSettings(loadSettings());
  }, []);

  const updateSettings = useCallback((newSettings: Partial<LLMSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      saveSettings.cancel();
    };
  }, []);

  const isConfigured = useCallback(() => {
    const model = defaultModels.find(m => m.id === settings.selectedModel);
    if (!model) return false;
    
    if (model.requiresAuth && !settings.apiKey) return false;
    if (model.requiresBaseUrl && !settings.baseUrl) return false;
    
    return true;
  }, [settings]);

  const value = useMemo(() => ({
    availableModels: defaultModels,
    settings,
    updateSettings,
    isConfigured,
  }), [settings, updateSettings, isConfigured]);

  return (
    <LLMContext.Provider value={value}>
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