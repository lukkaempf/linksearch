import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { FolderDialog } from "./components/FolderDialog";
import { AddLinkDialog } from "./components/AddLinkDialog";
import { useLinks } from "./context/LinkContext";
import React from "react";
import { LinkCard } from "./components/LinkCard";
import { SearchInput } from "./components/Search";

export function App() {
  const { links, selectedFolder, searchQuery } = useLinks();

  let result = React.useMemo(() => {
    let filtered =
      selectedFolder === "all"
        ? links
        : selectedFolder === "unorganized"
        ? links.filter((link) => !link.folderId)
        : links.filter((link) => link.folderId === selectedFolder);

    // 2️⃣ Such-Filter nur angewendet, wenn searchQuery nicht leer
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          (l.description?.toLowerCase().includes(q) ?? false) ||
          l.labels.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [selectedFolder, links, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Header />
        {/* Folder dialog for creating new folder, only mounted, but displayed via contexts */}
        <FolderDialog />
        {/* add link dialog for creating new folders, only mounted, but displayed via context */}
        <AddLinkDialog />
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 space-y-2 md:space-y-0">
          {/* Sidebar for folders */}
          <div className="col-span-1">
            <Sidebar />
          </div>
          {/* Main content area (Links + Search) */}

          <div className="col-span-3 flex flex-col space-y-2">
            <SearchInput />
            {result.map((link) =>
              link ? <LinkCard key={link.id} link={link} /> : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
