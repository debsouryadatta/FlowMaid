'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SaveIcon, Trash2, Code2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCode } from '@/context/code-context';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface SavedCodesSheetProps {
  triggerElement?: React.ReactNode;
}

interface SortableCardProps {
  id: string;
  name: string;
  code: string;
  onSelect: (code: string) => void;
  onDelete: () => void;
}

function SortableCard({ id, name, code, onSelect, onDelete }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={cn(
          'bg-muted/50 relative',
          isDragging && 'opacity-50 shadow-lg'
        )}
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{name}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-grab active:cursor-grabbing touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground line-clamp-2 font-mono">
            {code}
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => onSelect(code)}
          >
            <Code2 className="h-4 w-4" />
            Load Code
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function SavedCodesSheet({ triggerElement }: SavedCodesSheetProps) {
  const { setCode, savedCodes, deleteCode, reorderCodes } = useCode();
  const [open, setOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSelectCode = (code: string) => {
    setCode(code);
    setOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = savedCodes.findIndex((code) => code.id === active.id);
    const newIndex = savedCodes.findIndex((code) => code.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderCodes(oldIndex, newIndex);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {triggerElement || (
          <Button variant="outline" size="icon">
            <SaveIcon className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Saved Diagrams</SheetTitle>
          <SheetDescription>
            Click on a saved diagram to load it into the editor. Drag the handle to reorder.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4 px-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={savedCodes.map(code => code.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {savedCodes.map((savedCode, index) => (
                  <SortableCard
                    key={savedCode.id}
                    id={savedCode.id}
                    name={savedCode.name}
                    code={savedCode.code}
                    onSelect={handleSelectCode}
                    onDelete={() => deleteCode(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
