'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import debounce from 'lodash/debounce';
import { Loader2, Maximize2, Minimize2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCode } from '@/context/code-context';

// Initialize Mermaid once at module level
mermaid.initialize({
  startOnLoad: false, // Disable auto-load
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    useMaxWidth: true,
  },
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#2563eb',
    lineColor: '#64748b',
    secondaryColor: '#6366f1',
    tertiaryColor: '#8b5cf6',
  },
});

export function MermaidPreview() {
  const { code, codeError, setCodeError } = useCode();
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const renderTimeoutRef = useRef<NodeJS.Timeout>();

  const renderDiagram = useCallback(async (code: string) => {
    if (!code.trim()) return;
    
    try {
      setLoading(true);
      const cleanCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
        
      const id = `mermaid-${Date.now()}`;
      const { svg } = await mermaid.render(id, cleanCode);
      setSvg(svg);
      setCodeError('');
    } catch (error) {
      console.error('Mermaid render error:', error);
      setCodeError(error instanceof Error ? error.message : 'Failed to render diagram');
    } finally {
      setLoading(false);
    }
  }, [setCodeError]);

  // Use a more efficient debounce with cleanup
  useEffect(() => {
    // Clear any existing timeout
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    // Set new timeout
    renderTimeoutRef.current = setTimeout(() => {
      renderDiagram(code);
    }, 1000); // Increased debounce time to 1000ms

    // Cleanup
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [code, renderDiagram]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setTransform(prev => ({ ...prev, x: newX, y: newY }));
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.1, 2.0)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.1, 0.5)
    }));
  }, []);

  const handleReset = useCallback(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, []);

  return (
    <div className="relative w-full min-h-[400px] h-[calc(90vh-8rem)] overflow-hidden rounded-lg border bg-white">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="h-8 w-8"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full h-full p-4 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}
        
        <div
          ref={containerRef}
          className="h-full w-full cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
            transformOrigin: '50% 50%',
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] overflow-hidden p-0">
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
            <DialogTitle>Mermaid Diagram Preview</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                className="h-8 w-8"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                className="h-8 w-8"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 w-full h-[calc(90vh-8rem)] p-4 overflow-hidden bg-white">
            <div
              ref={containerRef}
              className="h-full w-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
                transformOrigin: '50% 50%',
              }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}