'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateMermaidCode } from '@/lib/openai';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PromptInputProps {
  onCodeGenerated: (code: string[]) => void;
  onError: (error: string) => void;
}

export default function PromptInput({ onCodeGenerated, onError }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('default');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const code = await generateMermaidCode(prompt, style);
      onCodeGenerated([code]);
      onError('');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to generate diagram');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto max-w-3xl space-y-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <Textarea
              placeholder="Describe your visual (e.g., 'Create a flowchart showing the process of user registration')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px] resize-none rounded-lg border-border bg-background p-4 text-foreground shadow-sm transition-colors focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="w-48">
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            disabled={loading || !prompt.trim()}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-primary to-purple-600 px-8 py-3 text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="h-5 w-5" />
              )}
              {loading ? 'Generating...' : 'Generate Visual'}
            </span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}