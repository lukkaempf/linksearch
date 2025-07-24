import { useLinks } from "@/context/LinkContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Folder } from "lucide-react";
import { Separator } from "@radix-ui/react-select";



export const Sidebar = () => {
  const { links, selectedFolder, setSelectedFolder, folders } = useLinks();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Folders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={selectedFolder === "all" ? "default" : "ghost"}
          className={`w-full justify-start ${
            selectedFolder === "all" ? "bg-black text-white" : ""
          }`}
          onClick={() => setSelectedFolder("all")}
        >
          <Folder className="w-4 h-4 mr-2" />
          All Links ({links.length})
        </Button>
        <Button
          variant={selectedFolder === "unorganized" ? "default" : "ghost"}
          className={`w-full justify-start ${
            selectedFolder === "unorganized" ? "bg-black text-white" : ""
          }`}
          onClick={() => setSelectedFolder("unorganized")}
        >
          <Folder className="w-4 h-4 mr-2" />
          Unorganized ({links.filter((link) => !link.folderId).length})
        </Button>
        <Separator className="w-full h-px bg-black" />

    

        {folders.map((folder) => {
       
          return <Button
            key={folder.id}
            variant={selectedFolder === folder.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              selectedFolder === folder.id ? "bg-black text-white" : ""
            }`}
            onClick={() => setSelectedFolder(folder.id)}
          >
            <div 
              className={`w-4 h-4 rounded-full mr-2`}
              style={{ backgroundColor: folder.color || '#6B7280' }}
            />
            {folder.name} (
            {links.filter((link) => link.folderId === folder.id).length})
          </Button>
        })}
      </CardContent>
    </Card>
  );
};
