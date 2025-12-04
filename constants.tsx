import { FileSystemItem } from './types';

export const INITIAL_FILES: FileSystemItem[] = [
  {
    id: '1',
    parentId: null,
    type: 'folder',
    name: '我的设计',
    createdAt: '2023-10-01',
  },
  {
    id: '2',
    parentId: null,
    type: 'folder',
    name: '客户案例',
    createdAt: '2023-10-05',
  },
  {
    id: '3',
    parentId: null,
    type: 'file',
    name: '风景照测试',
    thumbnailUrl: 'https://picsum.photos/400/300?random=1',
    createdAt: '2025/11/30 20:22',
  },
  {
    id: '4',
    parentId: '1', // Inside "我的设计"
    type: 'file',
    name: '袜子设计 V1',
    thumbnailUrl: 'https://picsum.photos/400/300?random=2',
    createdAt: '2025/12/01 12:50',
  },
  {
    id: '5',
    parentId: null,
    type: 'file',
    name: '未命名项目',
    thumbnailUrl: 'https://picsum.photos/400/300?random=3',
    createdAt: '2025/12/03 23:48',
  },
];