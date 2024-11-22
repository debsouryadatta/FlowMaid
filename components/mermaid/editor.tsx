'use client';

import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { AlertCircle, Book, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SaveCodeDialog } from '@/components/save-code-dialog';
import { useCode } from '@/context/code-context';


export function MermaidEditor() {
  const { code, setCode, codeError, setCodeError } = useCode();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('MermaidEditor received code:', code);
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    console.log('MermaidEditor onChange:', value);
    if (value !== undefined) {
      // Clean up any potential formatting issues
      const cleanValue = value
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
        .replace(/\r\n/g, '\n'); // Normalize line endings
      setCode(cleanValue);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SaveCodeDialog code={code} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center space-x-1"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Code</span>
          </Button>
          <a
            href="https://mermaid.js.org/syntax/flowchart.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <Book className="h-4 w-4" />
            <span>Documentation</span>
          </a>
        </div>
      </div>

      {codeError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{codeError}</AlertDescription>
        </Alert>
      )}

      <div className="relative min-h-[400px] overflow-hidden rounded-lg border">
        <Editor
          value={code}
          height="400px"
          language="mermaid"
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
}