export type ViewMode = 'home' | 'canvas';
export type GenMode = 'native' | 'agent' | null;

export interface FileSystemItem {
  id: string;
  parentId: string | null; // null represents root
  type: 'folder' | 'file';
  name: string;
  thumbnailUrl?: string; // Only for files
  createdAt: string;
}

export interface User {
  name: string;
  avatarUrl: string;
}
