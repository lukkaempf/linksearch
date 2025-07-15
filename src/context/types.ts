export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  labels: string[];
  folderId?: string;
  createdAt: Date;
}

export interface FolderType {
  id: string;
  name: string;
  color: string;
}