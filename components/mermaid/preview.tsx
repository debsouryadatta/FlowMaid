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


export function MermaidPreview() {
  const { code, setCode, codeError, setCodeError } = useCode();
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
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
  }, []);

  const debouncedRenderDiagram = useCallback(
    debounce(async (code: string) => {
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
    }, 500),
    []
  );

  useEffect(() => {
    debouncedRenderDiagram(code);
    return () => {
      debouncedRenderDiagram.cancel();
    };
  }, [code, debouncedRenderDiagram]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setTransform(prev => ({ ...prev, x: newX, y: newY }));
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.1, 2.0) // Max zoom: 2x
    }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.1, 0.5) // Min zoom: 0.5x
    }));
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const PreviewContent = () => (
    <div
      ref={containerRef}
      style={{
        transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
        transformOrigin: 'center',
        transition: 'transform 0.2s ease-out',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
        <PreviewContent />
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
            <PreviewContent />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}