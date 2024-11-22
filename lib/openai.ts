import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompt';

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

    const systemPrompt = SYSTEM_PROMPT;

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