'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SaveIcon } from 'lucide-react';
import { useCode } from '@/context/code-context';

interface SaveCodeDialogProps {
  code: string;
}

export function SaveCodeDialog({ code }: SaveCodeDialogProps) {
  const { saveCode } = useCode();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    saveCode(name, code);
    setName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-1">
          <SaveIcon className="h-4 w-4" />
          <span>Save</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Diagram</DialogTitle>
          <DialogDescription>
            Enter a name for your diagram to save it for later use.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter diagram name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
