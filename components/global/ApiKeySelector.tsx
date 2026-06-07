// components/ApiKeySelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ApiKey } from "@/types/api_keys.types";
import { ApiKeyGetAllAction } from "@/action/apiKeys/api_keys.action";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2, Key } from "lucide-react";

interface ApiKeySelectorProps {
  onApiKeySelect: (apiKeyId: string) => void;
  selectedApiKeyId?: string;
  required?: boolean;
  label?: string;
}

export function ApiKeySelector({ 
  onApiKeySelect, 
  selectedApiKeyId, 
  required = true,
  label = "Select API Key"
}: ApiKeySelectorProps) {
  const { token } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApiKeys();
  }, [token]);

  const fetchApiKeys = async () => {
    if (!token) return;
    
    try {
      const response = await ApiKeyGetAllAction(token);
      if (response.success && response.data) {
        const activeKeys = response.data.filter(key => key.is_active);
        setApiKeys(activeKeys);
        
        // Auto-select default key if available
        if (!selectedApiKeyId && activeKeys.length > 0) {
          const defaultKey = activeKeys.find(key => key.isDefault);
          if (defaultKey) {
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

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>{label} {required && "*"}</Label>
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
        <Label>{label} {required && "*"}</Label>
        <div className="p-3 border rounded-md bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-2">
            <Key className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">No API keys configured</p>
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
      <Label>{label} {required && "*"}</Label>
      <Select value={selectedApiKeyId} onValueChange={onApiKeySelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an API key" />
        </SelectTrigger>
        <SelectContent>
          {apiKeys.map((key) => (
            <SelectItem key={key.id} value={key.id}>
              <div className="flex items-center justify-between w-full gap-4">
                <span className="font-medium capitalize">{key.provider}</span>
                <span className="text-sm text-gray-500">{key.key_name}</span>
                {key.isDefault && (
                  <span className="text-xs bg-lime-100 text-lime-800 px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        Choose which API key to use for generation
      </p>
    </div>
  );
}