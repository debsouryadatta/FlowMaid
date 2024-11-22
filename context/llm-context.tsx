'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

const LLMContext = createContext<LLMContextType | undefined>(undefined);

export function LLMContextProvider({ children }: { children: React.ReactNode }) {
  // Load initial settings from localStorage synchronously
  const getInitialSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem('llm-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate the saved model still exists
        if (defaultModels.some(m => m.id === parsed.selectedModel)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return {
      selectedModel: 'llama-3.1-70b-versatile',
    };
  }, []);

  const [settings, setSettings] = useState<LLMSettings>(getInitialSettings());

  // Debounce the save operation
  const debouncedSave = useCallback(
    debounce((newSettings: LLMSettings) => {
      try {
        localStorage.setItem('llm-settings', JSON.stringify(newSettings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }, 1000),
    []
  );

  // Save settings when they change
  useEffect(() => {
    debouncedSave(settings);
    return () => {
      debouncedSave.cancel();
    };
  }, [settings, debouncedSave]);

  const updateSettings = useCallback((newSettings: Partial<LLMSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

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