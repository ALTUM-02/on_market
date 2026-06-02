import React, { useState, useRef } from 'react';
import { fileApi } from '../../api/client';
import { useDataStore, useThemeStore } from '../../store';

type FileType = 'image' | 'animation' | 'audio' | 'video';

interface FileUploadProps {
  onSuccess?: () => void;
}

export function FileUpload({ onSuccess }: FileUploadProps) {
  const { darkMode } = useThemeStore();
  const { addFile } = useDataStore();
  const [fileType, setFileType] = useState<FileType>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('filename', selectedFile.name);
      formData.append('file_type', fileType);
      formData.append('description', description);

      const result = await fileApi.upload(formData);
      addFile(result);
      setSelectedFile(null);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const fileTypeLabels: Record<FileType, string> = {
    image: 'Image',
    animation: 'Animation',
    audio: 'Audio (Voice)',
    video: 'Video (JPEG)',
  };

  const fileTypeColors: Record<FileType, string> = {
    image: 'bg-blue-500',
    animation: 'bg-purple-500',
    audio: 'bg-green-500',
    video: 'bg-orange-500',
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Upload File
      </h3>

      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            File Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(fileTypeLabels) as FileType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFileType(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  fileType === type
                    ? `${fileTypeColors[type]} text-white`
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {fileTypeLabels[type]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Select File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept={
              fileType === 'image' ? 'image/*' :
              fileType === 'animation' ? '.gif,.webp,.apng' :
              fileType === 'audio' ? 'audio/*' :
              'video/*,.jpeg,.jpg'
            }
            className={`w-full px-3 py-2 border rounded-lg ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={`w-full px-3 py-2 border rounded-lg ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Add a description..."
          />
        </div>

        {selectedFile && (
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            uploading || !selectedFile
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
