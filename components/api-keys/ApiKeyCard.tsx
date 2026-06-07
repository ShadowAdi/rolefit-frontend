import { ApiKey } from "@/types/api_keys.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Key, Calendar, Activity } from "lucide-react";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";


interface ApiKeyCardProps {
  apiKey: ApiKey;
  onEdit: (key: ApiKey) => void;
  onDelete: (key: ApiKey) => void;
  onToggleActive: (key: ApiKey, isActive: boolean) => void;
}

const providerColors = {
  groq: "bg-green-100 text-green-800",
  openai: "bg-purple-100 text-purple-800",
  anthropic: "bg-blue-100 text-blue-800",
  google: "bg-red-100 text-red-800",
  cohere: "bg-yellow-100 text-yellow-800",
  mistral: "bg-indigo-100 text-indigo-800",
  other: "bg-gray-100 text-gray-800",
};

export function ApiKeyCard({ apiKey, onEdit, onDelete, onToggleActive }: ApiKeyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-lime-600" />
            <CardTitle className="text-lg">{apiKey.key_name}</CardTitle>
          </div>
          <Badge className={providerColors[apiKey.provider]}>
            {apiKey.provider.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Requests: {apiKey.total_requests}
            </span>
          </div>
          {apiKey.last_used_at && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Last used: {formatDistanceToNow(new Date(apiKey.last_used_at), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
        
        {apiKey.expires_at && (
          <div className="text-sm text-gray-600">
            Expires: {new Date(apiKey.expires_at).toLocaleDateString()}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Switch
              id={`active-${apiKey.id}`}
              checked={apiKey.is_active}
              onCheckedChange={(checked) => onToggleActive(apiKey, checked)}
            />
            <Label htmlFor={`active-${apiKey.id}`} className="text-sm">
              {apiKey.is_active ? "Active" : "Inactive"}
            </Label>
          </div>
          {apiKey.isDefault && (
            <Badge variant="secondary" className="bg-lime-100 text-lime-800">
              Default
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(apiKey)}
          className="border-lime-200 hover:bg-lime-50"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(apiKey)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}