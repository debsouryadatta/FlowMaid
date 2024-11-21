import OpenAI from 'openai';

const getOpenAIConfig = () => {
  if (typeof window === 'undefined') return null;

  const settings = JSON.parse(localStorage.getItem('llm-settings') || '{}');
  const { selectedModel, apiKey, baseUrl } = settings;

  // If no model is selected, use default Groq settings
  if (!selectedModel) {
    return {
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      baseURL: process.env.NEXT_PUBLIC_GROQ_BASE_URL,
      model: process.env.NEXT_PUBLIC_GROQ_LLM_MODEL,
    };
  }

  // For Groq free trial model
  if (selectedModel === 'llama-3.1-70b-versatile') {
    return {
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      baseURL: process.env.NEXT_PUBLIC_GROQ_BASE_URL,
      model: 'llama-3.1-70b-versatile',
    };
  }

  // For OpenAI models
  if (selectedModel.startsWith('gpt-')) {
    return {
      apiKey: apiKey,
      baseURL: 'https://api.openai.com/v1',
      model: selectedModel,
    };
  }

  // For Gemini models
  if (selectedModel === 'gemini-pro') {
    return {
      apiKey: apiKey,
      baseURL: baseUrl || 'https://generativelanguage.googleapis.com/v1',
      model: 'gemini-pro',
    };
  }

  // For custom models
  return {
    apiKey: apiKey,
    baseURL: baseUrl,
    model: selectedModel,
  };
};

export function createOpenAIClient() {
  const config = getOpenAIConfig();
  if (!config) {
    throw new Error('Failed to load LLM configuration');
  }

  let baseURL = config.baseURL;
  let apiKey = config.apiKey;
  let model = config.model;

  // Handle different providers
  switch (true) {
    case model.startsWith('gpt'):
      // Default OpenAI configuration
      break;
    case model === 'openai-compatible':
      if (!config.baseURL) {
        throw new Error('Base URL is required for OpenAI-compatible APIs');
      }
      baseURL = config.baseURL;
      break;
    case model === 'llama-3.1-70b-versatile':
      baseURL = process.env.NEXT_PUBLIC_GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
      apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      break;
    default:
      throw new Error('Unsupported model selected');
  }

  return new OpenAI({
    apiKey: apiKey || '',
    baseURL,
  });
}

export async function generateMermaidCode(prompt: string, settings: any): Promise<string> {
  try {
    console.log('Starting diagram generation...');
    let baseURL = 'https://api.openai.com/v1';
    let apiKey = settings.apiKey;
    let modelName = settings.selectedModel;

    if (!settings?.selectedModel) {
      throw new Error('Please select a language model in settings before generating.');
    }

    console.log('Using model:', modelName);

    // Handle different providers
    switch (true) {
      case modelName.startsWith('gpt'):
        if (!apiKey) {
          throw new Error('OpenAI API key is required');
        }
        break;
      case modelName === 'openai-compatible':
        if (!settings.baseUrl) {
          throw new Error('Base URL is required for OpenAI-compatible APIs');
        }
        if (!apiKey) {
          throw new Error('API key is required for OpenAI-compatible APIs');
        }
        baseURL = settings.baseUrl;
        modelName = settings.modelName || 'gpt-3.5-turbo';
        break;
      case modelName === 'llama-3.1-70b-versatile':
        baseURL = 'https://api.groq.com/openai/v1';
        apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
        if (!apiKey) {
          throw new Error('GROQ API key not found in environment variables');
        }
        console.log('Using GROQ API with base URL:', baseURL);
        break;
      default:
        throw new Error('Unsupported model selected');
    }

    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey,
      baseURL,
      dangerouslyAllowBrowser: true,
      timeout: 60000, // 60 second timeout
    });

    const systemPrompt = `Create a Mermaid.js diagram based on the user's request. Follow these guidelines:

1. Use appropriate diagram type (flowchart TD/LR, sequence, class, etc.)
2. Keep the diagram clear and readable
3. Use meaningful node IDs and labels
4. Follow latest Mermaid.js syntax strictly
5. Avoid overly complex structures
6. Include only essential elements
7. Use proper arrow types and connections

Important: Only output the Mermaid.js code without any explanations or additional text.
Example format:
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Other Action]`;

    console.log('Making API request...');
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Create a Mermaid.js diagram for: ${prompt}. Only output the diagram code, no explanations.`,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent output
      max_tokens: 1000, // Reduced token limit for faster response
      top_p: 0.8,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log('Processing API response...');
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    // Clean up the response to extract only the Mermaid code
    const mermaidCode = content
      .replace(/```mermaid/g, '')
      .replace(/```/g, '')
      .trim();

    console.log('Successfully generated diagram code');
    return mermaidCode;
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      response: error.response,
      stack: error.stack,
    });
    throw error;
  }
}