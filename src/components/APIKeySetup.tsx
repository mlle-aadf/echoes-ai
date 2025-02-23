
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface APIKey {
  name: string;
  key: string;
  storageKey: string;
}

const apiKeys: APIKey[] = [
  { name: "OpenAI", key: "", storageKey: "OPENAI_API_KEY" },
  { name: "Anthropic", key: "", storageKey: "ANTHROPIC_API_KEY" },
  { name: "Google (Gemini)", key: "", storageKey: "GEMINI_API_KEY" },
  { name: "Perplexity", key: "", storageKey: "PERPLEXITY_API_KEY" },
  { name: "DeepL", key: "", storageKey: "DEEPL_API_KEY" },
];

export default function APIKeySetup() {
  const [keys, setKeys] = useState<APIKey[]>(
    apiKeys.map(k => ({ 
      ...k, 
      key: localStorage.getItem(k.storageKey) || "" 
    }))
  );
  const { toast } = useToast();

  const handleSave = () => {
    keys.forEach(({ storageKey, key }) => {
      if (key) {
        localStorage.setItem(storageKey, key);
      } else {
        localStorage.removeItem(storageKey);
      }
    });

    toast({
      title: "API Keys Saved",
      description: "Your API keys have been securely saved in your browser.",
    });
  };

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...keys];
    newKeys[index] = { ...newKeys[index], key: value };
    setKeys(newKeys);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Key Setup</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {keys.map((apiKey, index) => (
            <div key={apiKey.storageKey} className="grid gap-2">
              <Label htmlFor={apiKey.storageKey}>{apiKey.name} API Key</Label>
              <Input
                id={apiKey.storageKey}
                type="password"
                value={apiKey.key}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                placeholder={`Enter your ${apiKey.name} API key`}
              />
            </div>
          ))}
          <Button onClick={handleSave}>Save API Keys</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
