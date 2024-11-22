import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCode } from '@/context/code-context';
import { useLLM } from '@/context/llm-context';
import { generateMermaidCode } from '@/lib/openai';

export function PromptInput() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setCode } = useCode();
  const { settings, isConfigured } = useLLM();

  const extractMermaidCode = (response: string): string => {
    console.log('Extracting Mermaid code from:', response);
    // Replace parentheses with quotes in chemical formulas and other content
    // response = response.replace(/\(([^)]+)\)/g, "'$1'");
    
    // Try to find code between ```mermaid blocks
    const mermaidMatch = response.match(/```mermaid\n([\s\S]*?)\n```/);
    if (mermaidMatch) {
      console.log('Found Mermaid code block:', mermaidMatch[1].trim());
      return mermaidMatch[1].trim();
    }

    // If no mermaid blocks found, try to find any code blocks
    const codeMatch = response.match(/```\n([\s\S]*?)\n```/);
    if (codeMatch) {
      console.log('Found generic code block:', codeMatch[1].trim());
      return codeMatch[1].trim();
    }

    // If no code blocks found, return the entire response
    // after removing any markdown-style comments
    const cleanedCode = response.replace(/<!--[\s\S]*?-->/g, '').trim();
    console.log('Using cleaned response:', cleanedCode);
    return cleanedCode;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: 'Please enter a prompt',
        description: 'The prompt cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    if (!isConfigured()) {
      toast({
        title: 'Model not configured',
        description: 'Please select and configure a language model in settings.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Generating code for prompt:', prompt);
      let code = await generateMermaidCode(prompt, settings);
      console.log('Generated code:', code);
      code = extractMermaidCode(code);
      console.log('Extracted code:', code);
      setCode(code);
      setPrompt('');
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: 'Error generating diagram',
        description: error.message || 'An error occurred while generating the diagram.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative group">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the diagram you want to create..."
          className="min-h-[100px] resize-none bg-white/40 dark:bg-black/40 border-gray-200/50 dark:border-indigo-500/20 focus:border-gray-300 dark:focus:border-indigo-500/50 rounded-xl transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-200"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-200/20 to-gray-300/20 dark:from-indigo-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      <Button
        type="submit"
        className={cn(
          'relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 dark:from-indigo-500 dark:to-purple-500 text-white font-medium py-2.5',
          'hover:from-gray-900 hover:to-black dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300',
          loading && 'cursor-not-allowed opacity-50'
        )}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Diagram'
        )}
      </Button>
    </form>
  );
}