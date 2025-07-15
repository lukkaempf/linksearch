// src/components/AddLinkDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLinks } from "@/context/LinkContext";
import { useDialog } from "@/context/DialogContext";

interface LinkFormValues {
  title: string;
  url: string;
  description: string;
  labels: string;
  folderId: string;
}

export const AddLinkDialog: React.FC = () => {
  const { folders, addLink, updateLink } = useLinks();
  const { isLinkDialogOpen, setLinkDialogOpen, editingLink, setEditingLink } =
    useDialog();

  const [form, setForm] = useState<LinkFormValues>({
    title: "",
    url: "",
    description: "",
    labels: "",
    folderId: "_none",
  });

  // Initialize or reset form on open/edit changes
  useEffect(() => {
    if (editingLink) {
      setForm({
        title: editingLink.title,
        url: editingLink.url,
        description: editingLink.description || "",
        labels: editingLink.labels.join(", "),
        folderId: editingLink.folderId ?? "_none",
      });
    } else if (isLinkDialogOpen) {
      setForm({
        title: "",
        url: "",
        description: "",
        labels: "",
        folderId: "_none",
      });
    }
  }, [editingLink, isLinkDialogOpen]);

  const handleSubmit = async () => {
    if (!form.title || !form.url) return;
    // Build payload without undefined folderId
    const payload: any = {
      title: form.title,
      url: form.url.startsWith("http") ? form.url : `https://${form.url}`,
      description: form.description || "",
      labels: form.labels
        ? form.labels
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean)
        : [],
      ...(form.folderId !== "_none" ? { folderId: form.folderId } : {}),
    };
    if (editingLink?.id) {
      await updateLink(editingLink.id, payload);
    } else {
      await addLink(payload);
    }
    setLinkDialogOpen(false);
    setEditingLink(undefined);
  };

  return (
    <Dialog
      open={isLinkDialogOpen}
      onOpenChange={(open) => {
        setLinkDialogOpen(open);
        if (!open) setEditingLink(undefined);
      }}
    >
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            {editingLink ? "Edit Link" : "Add New Link"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Enter link title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Brief description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="labels">Labels (comma-separated)</Label>
            <Input
              id="labels"
              value={form.labels}
              onChange={(e) =>
                setForm((f) => ({ ...f, labels: e.target.value }))
              }
              placeholder="react, documentation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <Select
              value={form.folderId}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, folderId: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a folder (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-white border-0">
                <SelectItem value="_none">No folder</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <div className={`${folder.color} w-3 h-3 rounded-full`} />
                      {folder.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!form.title || !form.url}
            className="w-full bg-black text-white hover:bg-gray-900"
          >
            {editingLink ? "Update Link" : "Add Link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
