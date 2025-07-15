import { Button } from "./ui/button";
import { FolderPlus, Plus } from "lucide-react";
import { useDialog } from "@/context/DialogContext";
export const Header = () => {
  const { setFolderDialogOpen, setLinkDialogOpen } = useDialog();

  return (
    <header className="flex flex-row items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Link Search</h1>
        <p className="text-muted-foreground">Organize and search your links</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
        <Button variant="outline" onClick={() => setFolderDialogOpen(true)}>
          <FolderPlus className="w-4 h-4 mr-2" />
          New Folder
        </Button>
        <Button
          variant="outline"
          onClick={() => setLinkDialogOpen(true)}
          className="bg-black text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>
    </header>
  );
};
