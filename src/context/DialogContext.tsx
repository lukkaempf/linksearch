// src/context/DialogContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Link } from "@/context/types";

interface DialogContextValue {
  isFolderDialogOpen: boolean;
  setFolderDialogOpen: (open: boolean) => void;
  isLinkDialogOpen: boolean;
  setLinkDialogOpen: (open: boolean) => void;
  editingLink?: Link;
  setEditingLink: (link?: Link) => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isFolderDialogOpen, setFolderDialogOpen] = useState(false);
  const [isLinkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | undefined>();

  return (
    <DialogContext.Provider
      value={{
        isFolderDialogOpen,
        setFolderDialogOpen,
        isLinkDialogOpen,
        setLinkDialogOpen,
        editingLink,
        setEditingLink,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
}
