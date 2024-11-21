'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MermaidEditor } from './editor';
import { MermaidPreview } from './preview';
import { PromptInput } from '../prompt-input';
import { useCode } from '@/components/Providers';

export function MermaidContainer() {
  const { code, setCode } = useCode();
  const [error, setError] = useState('');

  const extractMermaidCode = (response: string): string => {
    console.log('Extracting Mermaid code from:', response);
    // Replace parentheses with quotes in chemical formulas and other content
    response = response.replace(/\(([^)]+)\)/g, "'$1'");
    
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

  const handleCodeGenerated = (codes: string[]) => {
    console.log('Handling generated codes:', codes);
    if (codes.length > 0) {
      const extractedCode = extractMermaidCode(codes[0]);
      console.log('Setting extracted code:', extractedCode);
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