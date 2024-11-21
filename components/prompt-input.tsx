import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCode, useLLM } from '@/components/Providers';
import { generateMermaidCode } from '@/lib/openai';

export function PromptInput() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setCode } = useCode();
  const { settings, isConfigured } = useLLM();

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
      const code = await generateMermaidCode(prompt, settings);
      console.log('Generated code:', code);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the diagram you want to create..."
        className="min-h-[100px] resize-none"
      />
      <Button
        type="submit"
        className={cn(
          'w-full',
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