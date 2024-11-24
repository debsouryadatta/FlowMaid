'use client';

import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MermaidEditor } from '@/components/mermaid/editor';
import { MermaidPreview } from '@/components/mermaid/preview';

export default function EditPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  return (
    <div className="h-screen pt-16 mb-20">
      <div className="flex h-full">
        {/* Editor Section */}
        <div 
          className={`${
            isEditorOpen ? 'w-2/6' : 'w-0'
          } bg-white/40 dark:bg-black/40 transition-all duration-300 relative`}
        >
          {isEditorOpen && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditorOpen(false)}
                className="absolute right-2 top-2 z-50"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
              <div className="pt-12">
                <MermaidEditor />
              </div>
            </>
          )}
        </div>
        
        {/* Preview Section */}
        <div 
          className={`${
            isEditorOpen ? 'w-4/6' : 'w-full'
          } bg-white/40 dark:bg-black/40 transition-all duration-300 relative top-14`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditorOpen(true)}
            className={`absolute left-2 top-2 z-50 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black ${
              isEditorOpen ? 'hidden' : 'block'
            }`}
          >
            <PanelLeftOpen className="h-4 w-10" />
          </Button>
          <MermaidPreview />
        </div>
      </div>
    </div>
  );
}
