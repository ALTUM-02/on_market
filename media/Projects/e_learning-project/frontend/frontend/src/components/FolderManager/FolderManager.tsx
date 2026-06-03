import { useState } from 'react';
import { folderApi } from '../../api/client';
import { useDataStore, useThemeStore } from '../../store';

interface FolderManagerProps {
  onSuccess?: () => void;
}

export function FolderManager({ onSuccess }: FolderManagerProps) {
  const { darkMode } = useThemeStore();
  const { folders, addFolder, removeFolder } = useDataStore();
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setError('Please enter a folder name');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', newFolderName);
      const result = await folderApi.create(formData);
      addFolder(result);
      setNewFolderName('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create folder');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFolder = async (id: number) => {
    try {
      await folderApi.delete(id);
      removeFolder(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete folder');
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Folders
      </h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name..."
            className={`flex-1 px-3 py-2 border rounded-lg ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
          />
          <button
            onClick={handleCreateFolder}
            disabled={creating}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              creating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {folders.length === 0 ? (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No folders yet. Create one to organize your files.
            </p>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <span className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {folder.name}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ({folder.files_count} files, {folder.texts_count} texts)
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteFolder(folder.id)}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
