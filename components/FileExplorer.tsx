import React, { useState, useMemo } from 'react';
import { FileSystemItem } from '../types';
import { Folder, FolderInput, ChevronRight, FolderPlus, ArrowLeft, Trash2, Edit2, X, CheckCircle2 } from 'lucide-react';

interface FileExplorerProps {
  items: FileSystemItem[];
  setItems: React.Dispatch<React.SetStateAction<FileSystemItem[]>>;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ items, setItems }) => {
  const [currentPath, setCurrentPath] = useState<FileSystemItem[]>([]); // Stack of folder objects
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // Move functionality state
  const [movingItem, setMovingItem] = useState<FileSystemItem | null>(null);

  // Determine current Folder ID
  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;

  // Filter items for current view
  const currentItems = useMemo(() => {
    return items.filter(item => item.parentId === currentFolderId);
  }, [items, currentFolderId]);

  // Navigation Handlers
  const handleEnterFolder = (folder: FileSystemItem) => {
    setCurrentPath([...currentPath, folder]);
  };

  const handleNavigateUp = () => {
    if (currentPath.length === 0) return;
    setCurrentPath(currentPath.slice(0, -1));
  };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleGoRoot = () => {
    setCurrentPath([]);
  };

  // CRUD Handlers
  const handleCreateFolder = () => {
    const newFolder: FileSystemItem = {
      id: Date.now().toString(),
      parentId: currentFolderId,
      type: 'folder',
      name: '新建文件夹',
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [newFolder, ...prev]);
    // Automatically enter edit mode for new folder
    setEditingId(newFolder.id);
    setEditName(newFolder.name);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('确定要删除吗？如果是文件夹，里面的内容也会被删除。')) {
      setItems(prev => prev.filter(item => item.id !== id && item.parentId !== id));
    }
  };

  const startRename = (e: React.MouseEvent, item: FileSystemItem) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditName(item.name);
  };

  const saveRename = () => {
    if (editingId) {
      setItems(prev => prev.map(item => 
        item.id === editingId ? { ...item, name: editName } : item
      ));
      setEditingId(null);
    }
  };

  // Move Logic
  const openMoveModal = (e: React.MouseEvent, item: FileSystemItem) => {
    e.stopPropagation();
    setMovingItem(item);
  };

  const handleMoveConfirm = (targetFolderId: string | null) => {
    if (!movingItem) return;
    
    setItems(prev => prev.map(item => 
      item.id === movingItem.id ? { ...item, parentId: targetFolderId } : item
    ));
    setMovingItem(null);
  };

  // Helper to check if a folder is a valid destination (prevent circular moves)
  const getValidDestinations = () => {
    if (!movingItem) return [];

    const allFolders = items.filter(i => i.type === 'folder');
    
    // If moving a file, all folders are valid (except current parent, though redundant)
    if (movingItem.type === 'file') {
      return allFolders.filter(f => f.id !== movingItem.parentId);
    }

    // If moving a folder, destination cannot be itself or its descendants
    const isDescendant = (potentialParentId: string | null, targetId: string): boolean => {
       if (!potentialParentId) return false;
       if (potentialParentId === targetId) return true;
       const parent = items.find(i => i.id === potentialParentId);
       return parent ? isDescendant(parent.parentId, targetId) : false;
    };

    return allFolders.filter(f => {
      if (f.id === movingItem.id) return false; // Cannot move into self
      if (isDescendant(f.parentId, movingItem.id)) return false; // Cannot move into own child
      return true;
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[500px] flex flex-col animate-fade-in relative">
      {/* Header / Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800">
          我的项目
        </h2>
        
        <div className="flex items-center gap-2">
           <button 
            onClick={handleCreateFolder}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors"
          >
            <FolderPlus size={18} />
            新建文件夹
          </button>
        </div>
      </div>

      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg overflow-x-auto">
        <button 
          onClick={handleNavigateUp} 
          disabled={currentPath.length === 0}
          className={`p-1 rounded hover:bg-slate-200 ${currentPath.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <ArrowLeft size={16} />
        </button>
        <div className="h-4 w-[1px] bg-slate-300 mx-2"></div>
        
        <button 
          onClick={handleGoRoot}
          className={`hover:text-primary transition-colors ${currentPath.length === 0 ? 'font-bold text-slate-800' : ''}`}
        >
          全部项目
        </button>

        {currentPath.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <ChevronRight size={14} />
            <button 
              onClick={() => handleBreadcrumbClick(index)}
              className={`hover:text-primary whitespace-nowrap transition-colors ${index === currentPath.length - 1 ? 'font-bold text-slate-800' : ''}`}
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Grid Content */}
      <div className="flex-1">
        {currentItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FolderPlus size={32} className="text-slate-300" />
             </div>
             <p>此文件夹为空</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => item.type === 'folder' && handleEnterFolder(item)}
                className="group relative flex flex-col gap-2 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
              >
                {/* Visual Thumbnail */}
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center relative shadow-sm">
                  {item.type === 'folder' ? (
                    <Folder size={48} className="text-yellow-400 fill-yellow-100" />
                  ) : (
                     <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                  )}

                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                     <button 
                      onClick={(e) => startRename(e, item)}
                      title="重命名"
                      className="p-1.5 bg-white/90 rounded-full shadow-sm hover:text-blue-600 backdrop-blur-sm transition-transform hover:scale-110"
                    >
                        <Edit2 size={12} />
                     </button>
                     <button 
                      onClick={(e) => openMoveModal(e, item)}
                      title="移动"
                      className="p-1.5 bg-white/90 rounded-full shadow-sm hover:text-green-600 backdrop-blur-sm transition-transform hover:scale-110"
                    >
                        <FolderInput size={12} />
                     </button>
                     <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      title="删除"
                      className="p-1.5 bg-white/90 rounded-full shadow-sm hover:text-red-600 backdrop-blur-sm transition-transform hover:scale-110"
                    >
                        <Trash2 size={12} />
                     </button>
                  </div>
                </div>

                {/* Name / Input */}
                <div className="px-1">
                  {editingId === item.id ? (
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={saveRename}
                      onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-sm border border-blue-400 rounded px-1 py-0.5 outline-none bg-white"
                    />
                  ) : (
                    <h3 className="text-sm font-medium text-slate-700 truncate" title={item.name}>
                      {item.name}
                    </h3>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.type === 'folder' ? '文件夹' : '图片'} • {item.createdAt.split(' ')[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Move Item Modal */}
      {movingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FolderInput size={20} className="text-primary" />
                移动 "{movingItem.name}" 到...
              </h3>
              <button onClick={() => setMovingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-2 custom-scroll flex-1">
              <div className="space-y-1">
                {/* Root Option */}
                <button
                  onClick={() => handleMoveConfirm(null)}
                  disabled={movingItem.parentId === null}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    movingItem.parentId === null 
                      ? 'opacity-50 bg-slate-50 cursor-default' 
                      : 'hover:bg-blue-50 hover:text-blue-600 cursor-pointer text-slate-700'
                  }`}
                >
                  <div className="p-2 bg-slate-100 rounded-lg">
                     <Folder size={20} className="text-slate-500" />
                  </div>
                  <span className="font-medium">根目录 (所有项目)</span>
                  {movingItem.parentId === null && <span className="ml-auto text-xs text-slate-400">当前位置</span>}
                </button>

                {/* Folder Options */}
                {getValidDestinations().map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => handleMoveConfirm(folder.id)}
                    disabled={folder.id === movingItem.parentId}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      folder.id === movingItem.parentId 
                        ? 'opacity-50 bg-slate-50 cursor-default' 
                        : 'hover:bg-blue-50 hover:text-blue-600 cursor-pointer text-slate-700'
                    }`}
                  >
                    <div className="p-2 bg-yellow-50 rounded-lg">
                       <Folder size={20} className="text-yellow-500 fill-yellow-100" />
                    </div>
                    <span className="font-medium truncate">{folder.name}</span>
                    {folder.id === movingItem.parentId && <span className="ml-auto text-xs text-slate-400">当前位置</span>}
                  </button>
                ))}

                {getValidDestinations().length === 0 && movingItem.parentId === null && (
                   <div className="text-center py-8 text-slate-400 text-sm">
                     没有其他文件夹可移动
                   </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
               <button 
                 onClick={() => setMovingItem(null)}
                 className="px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors mr-2"
               >
                 取消
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FileExplorer;