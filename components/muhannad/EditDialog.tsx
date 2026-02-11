'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  item?: {
    title: string;
    description?: string;
    deadline?: string;
    weight?: number;
    progress?: number;
  };
  onSave: (data: {
    title: string;
    description?: string;
    deadline?: string;
    weight?: number;
    progress?: number;
  }) => void;
  showWeight?: boolean;
  showProgress?: boolean;
  showDeadline?: boolean;
}

export function EditDialog({
  open,
  onOpenChange,
  title,
  description,
  item,
  onSave,
  showWeight = false,
  showProgress = false,
  showDeadline = true,
}: EditDialogProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    deadline: item?.deadline || '',
    weight: item?.weight || 50,
    progress: item?.progress || 0,
  });

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter title"
              className="font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">
              Description <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          {showDeadline && (
            <div className="space-y-2">
              <Label htmlFor="deadline" className="font-semibold">
                Deadline <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          )}

          {showWeight && (
            <div className="space-y-2">
              <Label htmlFor="weight" className="font-semibold">
                Weight (%) <span className="text-muted-foreground text-xs">- for progress calculation</span>
              </Label>
              <Input
                id="weight"
                type="number"
                min="0"
                max="100"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
              />
            </div>
          )}

          {showProgress && (
            <div className="space-y-2">
              <Label htmlFor="progress" className="font-semibold">
                Progress (%)
              </Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.title.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
