// components/api-keys/DeleteApiKeyDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiKey } from "@/types/api_keys.types";

interface DeleteApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  apiKey: ApiKey | null;
  isLoading?: boolean;
}

export function DeleteApiKeyDialog({
  open,
  onOpenChange,
  onConfirm,
  apiKey,
  isLoading,
}: DeleteApiKeyDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the API key "{apiKey?.key_name}" for{" "}
            <span className="font-semibold">{apiKey?.provider?.toUpperCase()}</span>.
            {apiKey?.isDefault && (
              <span className="block mt-2 text-red-600 font-semibold">
                Warning: This is your default API key. You will need to set another default key.
              </span>
            )}
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}