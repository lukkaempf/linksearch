import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Link, FolderType } from "@/context/types";
import * as linkService from "@/services/linkService";
import * as folderService from "@/services/folderService";

interface LinkContextValue {
  links: Link[];
  folders: FolderType[];
  loading: boolean;
  selectedFolder: string;
  setSelectedFolder: (folderId: string) => void;
  addLink: (data: Omit<Link, "id" | "createdAt">) => Promise<void>;
  updateLink: (id: string, data: Partial<Link>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  addFolder: (data: Omit<FolderType, "id">) => Promise<void>;
  updateFolder: (id: string, data: Partial<FolderType>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const LinkContext = createContext<LinkContextValue | undefined>(undefined);

export function LinkProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadAll = async () => {
    setLoading(true);
    const [linkDocs, folderDocs] = await Promise.all([
      linkService.fetchLinks(),
      folderService.fetchFolders(),
    ]);
    setLinks(linkDocs);
    setFolders(folderDocs);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const addLink = async (data: Omit<Link, "id" | "createdAt">) => {
    await linkService.createLink(data);
    await loadAll();
  };

  const updateLink = async (id: string, data: Partial<Link>) => {
    await linkService.updateLink(id, data);
    await loadAll();
  };

  const deleteLink = async (id: string) => {
    await linkService.deleteLink(id);
    await loadAll();
  };

  const addFolder = async (data: Omit<FolderType, "id">) => {
    await folderService.createFolder(data);
    await loadAll();
  };

  const updateFolder = async (id: string, data: Partial<FolderType>) => {
    await folderService.updateFolder(id, data);
    await loadAll();
  };

  const deleteFolder = async (id: string) => {
    await folderService.deleteFolder(id);
    await loadAll();
  };

  return (
    <LinkContext.Provider
      value={{
        links,
        folders,
        loading,
        selectedFolder,
        setSelectedFolder,
        addLink,
        updateLink,
        deleteLink,
        addFolder,
        updateFolder,
        deleteFolder,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </LinkContext.Provider>
  );
}

export function useLinks() {
  const ctx = useContext(LinkContext);
  if (!ctx) throw new Error("useLinks must be used within LinkProvider");
  return ctx;
}
