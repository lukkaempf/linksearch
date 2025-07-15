import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useLinks } from "@/context/LinkContext";
import { useDialog } from "@/context/DialogContext";

const folderColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

export const FolderDialog = () => {
  const [form, setForm] = useState({ name: "", color: folderColors[0] });
  const { isFolderDialogOpen, setFolderDialogOpen } = useDialog();
  const { addFolder } = useLinks();

  const handleCreate = async () => {
    if (!form.name) return;
    console.log("Creating folder:", form);
    await addFolder({ name: form.name, color: form.color });
    setForm({ name: "", color: folderColors[0] });
    setFolderDialogOpen(false);
  };

  return (
    <Dialog open={isFolderDialogOpen} onOpenChange={setFolderDialogOpen}>
      <DialogContent
        className=" bg-white border-0"
        aria-describedby="folder-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription></DialogDescription>
          <div>
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              className="mt-1"
              id="folder-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Enter folder name"
            />
          </div>
          <div className="mt-2">
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {folderColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color} ${
                    form.color === color
                      ? "ring-2 ring-offset-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => setForm({ ...form, color })}
                />
              ))}
            </div>
          </div>
          <Button
            className="mt-4 mr-2 w-40 bg-black text-white"
            variant="outline"
            onClick={handleCreate}
            disabled={!form.name}
          >
            Create Folder
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
