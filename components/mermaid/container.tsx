'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MermaidEditor } from './editor';
import { MermaidPreview } from './preview';
import { PromptInput } from '../prompt-input';

export function MermaidContainer() {
  return (
    <div className="relative space-y-8 rounded-xl bg-black/20 dark:bg-black/20 p-6 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100/30 to-gray-200/30 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl" />
      
      <div className="relative">
        <PromptInput />
      </div>

      <div className="relative">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100/30 dark:bg-black/20 p-1">
            <TabsTrigger 
              value="editor"
              className="data-[state=active]:bg-white/50 dark:data-[state=active]:bg-indigo-950/50 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
            >
              Editor
            </TabsTrigger>
            <TabsTrigger 
              value="preview"
              className="data-[state=active]:bg-white/50 dark:data-[state=active]:bg-indigo-950/50 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="rounded-lg bg-white/40 dark:bg-black/40 p-4 mt-2">
            <MermaidEditor />
          </TabsContent>
          <TabsContent value="preview" className="rounded-lg bg-white/40 dark:bg-black/40 p-4 mt-2">
            <MermaidPreview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}