"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Key, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ApiKey } from "@/types/api_keys.types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ApiKeyGetAllAction } from "@/action/apiKeys/api_keys.action";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ApiKeyComboboxProps {
  onApiKeySelect: (apiKeyId: string) => void;
  selectedApiKeyId?: string;
  required?: boolean;
  label?: string;
}

const providerColors = {
  groq: "bg-green-100 text-green-800 border-green-200",
  openai: "bg-purple-100 text-purple-800 border-purple-200",
  anthropic: "bg-blue-100 text-blue-800 border-blue-200",
  google: "bg-red-100 text-red-800 border-red-200",
  cohere: "bg-yellow-100 text-yellow-800 border-yellow-200",
  mistral: "bg-indigo-100 text-indigo-800 border-indigo-200",
  other: "bg-gray-100 text-gray-800 border-gray-200",
};

export function ApiKeyCombobox({
  onApiKeySelect,
  selectedApiKeyId,
  required = true,
  label = "Select API Key",
}: ApiKeyComboboxProps) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, [token]);

  useEffect(() => {
    if (selectedApiKeyId && apiKeys.length > 0) {
      const key = apiKeys.find((k) => k.id === selectedApiKeyId);
      setSelectedKey(key || null);
    }
  }, [selectedApiKeyId, apiKeys]);

  const fetchApiKeys = async () => {
    if (!token) return;

    try {
      const response = await ApiKeyGetAllAction(token);
      if (response.success && response.data) {
        const activeKeys = response.data.filter((key) => key.is_active);
        setApiKeys(activeKeys);

        // Auto-select default key if available
        if (!selectedApiKeyId && activeKeys.length > 0) {
          const defaultKey = activeKeys.find((key) => key.isDefault);
          if (defaultKey) {
            setSelectedKey(defaultKey);
            onApiKeySelect(defaultKey.id);
          }
        }
      }
    } catch (error) {
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (key: ApiKey) => {
    setSelectedKey(key);
    onApiKeySelect(key.id);
    setOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>
          {label} {required && "*"}
        </Label>
        <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-600">Loading API keys...</span>
        </div>
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="space-y-2">
        <Label>
          {label} {required && "*"}
        </Label>
        <div className="p-3 border rounded-md bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-2">
            <Key className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                No API keys configured
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Please add an API key in settings to use AI features
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && "*"}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedKey ? (
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${providerColors[selectedKey.provider as keyof typeof providerColors]}`}
                >
                  {selectedKey.provider.toUpperCase()}
                </span>
                <span>{selectedKey.key_name}</span>
                {selectedKey.isDefault && (
                  <span className="text-xs bg-lime-100 text-lime-800 px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
            ) : (
              "Select an API key..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search API keys..." />
            <CommandList>
              <CommandEmpty>No API key found.</CommandEmpty>
              <CommandGroup>
                {apiKeys.map((key) => (
                  <CommandItem
                    key={key.id}
                    value={`${key.provider} ${key.key_name}`}
                    onSelect={() => handleSelect(key)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedKey?.id === key.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${providerColors[key.provider as keyof typeof providerColors]}`}
                        >
                          {key.provider.toUpperCase()}
                        </span>
                        <span>{key.key_name}</span>
                      </div>
                      {key.isDefault && (
                        <span className="text-xs bg-lime-100 text-lime-800 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500">
        Choose which API key to use for generation
      </p>
    </div>
  );
}
