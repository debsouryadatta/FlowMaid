'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MermaidEditor } from './editor';
import { MermaidPreview } from './preview';
import PromptInput from '../prompt-input';

export function MermaidContainer() {
  const [code, setCode] = useState(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);
  const [error, setError] = useState('');

  const extractMermaidCode = (response: string): string => {
    // Replace participant declarations with proper node syntax
    // response = response.replace(/participant\s+(\w+)\s+as\s+"([^"]+)"/g, '$1["$2"]');
    
    // Replace parentheses with quotes in chemical formulas and other content
    response = response.replace(/\(([^)]+)\)/g, "'$1'");
    
    // Try to find code between ```mermaid blocks
    const mermaidMatch = response.match(/```mermaid\n([\s\S]*?)\n```/);
    if (mermaidMatch) {
      return mermaidMatch[1].trim();
    }

    // If no mermaid blocks found, try to find any code blocks
    const codeMatch = response.match(/```\n([\s\S]*?)\n```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }

    // If no code blocks found, return the entire response
    // after removing any markdown-style comments
    return response.replace(/<!--[\s\S]*?-->/g, '').trim();
  };

  const handleCodeGenerated = (codes: string[]) => {
    if (codes.length > 0) {
      const extractedCode = extractMermaidCode(codes[0]);
      setCode(extractedCode);
      setError('');
    }
  };

  return (
    <div className="space-y-8">
      <PromptInput onCodeGenerated={handleCodeGenerated} onError={setError} />

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <MermaidEditor code={code} onChange={setCode} error={error} />
        </TabsContent>
        <TabsContent value="preview">
          <MermaidPreview code={code} onError={setError} />
        </TabsContent>
      </Tabs>
    </div>
  );
}