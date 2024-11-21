'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';
import { useLLM } from '@/components/Providers';
import { cn } from '@/lib/utils';

export function LLMSettingsDialog() {
  const { availableModels, settings, updateSettings, isConfigured } = useLLM();
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const selectedModel = availableModels.find(m => m.id === localSettings.selectedModel);
  const requiresAuth = selectedModel?.requiresAuth ?? false;
  const requiresBaseUrl = selectedModel?.requiresBaseUrl ?? false;

  const handleModelChange = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    setLocalSettings(prev => ({
      ...prev,
      selectedModel: modelId,
      // Clear auth details if switching to a non-auth model
      ...((!model?.requiresAuth) && { apiKey: undefined }),
      ...((!model?.requiresBaseUrl) && { baseUrl: undefined }),
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setOpen(false);
  };

  const getButtonContent = () => {
    if (!selectedModel) {
      return (
        <>
          <Settings2 className="h-4 w-4 mr-2" />
          <span>Configure Model</span>
        </>
      );
    }

    return (
      <>
        <Settings2 className="h-4 w-4 mr-2" />
        <span>{selectedModel.name}</span>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isConfigured() ? "outline" : "secondary"}
          className="flex items-center"
          size="sm"
        >
          {getButtonContent()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Model Settings</DialogTitle>
          <DialogDescription>
            Choose your preferred language model and configure authentication if required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={localSettings.selectedModel}
              onValueChange={handleModelChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>OpenAI Models</SelectLabel>
                  {availableModels
                    .filter(m => m.provider === 'openai')
                    .map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Google Models</SelectLabel>
                  {availableModels
                    .filter(m => m.provider === 'gemini')
                    .map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Compatible APIs</SelectLabel>
                  {availableModels
                    .filter(m => m.provider === 'openai-compatible')
                    .map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Free Trial Models</SelectLabel>
                  {availableModels
                    .filter(m => !m.requiresAuth)
                    .map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {selectedModel && (
              <p className="text-sm text-muted-foreground">
                {selectedModel.description}
              </p>
            )}
          </div>

          <div className={cn("space-y-4", !requiresAuth && "opacity-50 pointer-events-none")}>
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder={requiresAuth ? "Enter your API key" : "No API key required"}
                value={localSettings.apiKey || ""}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  apiKey: e.target.value
                }))}
              />
            </div>

            {requiresBaseUrl && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    id="baseUrl"
                    placeholder="Enter the API base URL"
                    value={localSettings.baseUrl || ""}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      baseUrl: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modelName">Model Name</Label>
                  <Input
                    id="modelName"
                    placeholder="Enter the model name (e.g., gpt-3.5-turbo)"
                    value={localSettings.modelName || ""}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      modelName: e.target.value
                    }))}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
