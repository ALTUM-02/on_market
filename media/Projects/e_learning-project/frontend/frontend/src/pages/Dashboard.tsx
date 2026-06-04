import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore, useDataStore } from '../store';
import API_BASE_URL, { dashboardApi, fileApi, textApi } from '../api/client';
import { Navbar } from '../components/Navbar/Navbar';
import { FileUpload } from '../components/FileUpload/FileUpload';
import { TextEditor } from '../components/TextEditor/TextEditor';
import { FolderManager } from '../components/FolderManager/FolderManager';

type Tab = 'dashboard' | 'upload' | 'text' | 'folders' | 'myfiles';
type UploadedFile = {
  id: number;
  file_type: 'image' | 'animation' | 'audio' | 'video';
  file?: string;
  file_url?: string | null;
  filename: string;
  description?: string;
  created_at: string;
};
type TextDocument = {
  id: number;
  title: string;
  content: string;
  font_family: string;
  created_at: string;
};

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

function getFileUrl(file: UploadedFile) {
  const rawUrl = file.file_url || file.file;
  if (!rawUrl) return '';
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
  return `${API_ORIGIN}${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, setLoading: setAuthLoading } = useAuthStore();
  const { darkMode } = useThemeStore();
  const { setFolders, setFiles, setTexts, files, texts } = useDataStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [viewerFile, setViewerFile] = useState<UploadedFile | null>(null);
  const [viewerText, setViewerText] = useState<TextDocument | null>(null);
  const [stats, setStats] = useState({ total_folders: 0, total_files: 0, total_texts: 0 });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await dashboardApi.getDashboard();
        if (response.authenticated) {
          setUser(response.user);
          setStats(response.stats);
          setFolders(response.recent_folders);
          setFiles(response.recent_files);
          setTexts(response.recent_texts);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false);
        setAuthLoading(false);
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    } else {
      setLoading(false);
      setAuthLoading(false);
    }
  }, [isAuthenticated]);

  const refreshData = async () => {
    try {
      const response = await dashboardApi.getDashboard();
      setStats(response.stats);
      setFolders(response.recent_folders);
      setFiles(response.recent_files);
      setTexts(response.recent_texts);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const loadLibrary = async () => {
    setLibraryLoading(true);
    try {
      const [allFiles, allTexts] = await Promise.all([fileApi.list(), textApi.list()]);
      setFiles(allFiles);
      setTexts(allTexts);
    } catch (error) {
      console.error('Failed to load library:', error);
    } finally {
      setLibraryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'myfiles' && isAuthenticated) {
      loadLibrary();
    }
  }, [activeTab, isAuthenticated]);

  const renderFilePreview = (file: UploadedFile) => {
    const fileUrl = getFileUrl(file);

    if (!fileUrl) {
      return (
        <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          File URL is missing.
        </div>
      );
    }

    if (file.file_type === 'image' || file.file_type === 'animation') {
      return (
        <img
          src={fileUrl}
          alt={file.filename}
          className="max-h-[70vh] w-full rounded-lg object-contain"
        />
      );
    }

    if (file.file_type === 'audio') {
      return (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <audio src={fileUrl} controls className="w-full" />
        </div>
      );
    }

    return (
      <video
        src={fileUrl}
        controls
        playsInline
        className="max-h-[70vh] w-full rounded-lg bg-black"
      />
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'upload', label: 'Upload Files', icon: '📁' },
    { id: 'text', label: 'Text Editor', icon: '📝' },
    { id: 'folders', label: 'Folders', icon: '📂' },
    { id: 'myfiles', label: 'My Files', icon: '🗂️' },
  ] as const;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Welcome, {user?.username}!
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your files, texts, and folders
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-animate-button ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Folders</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {stats.total_folders}
                    </p>
                  </div>
                  <span className="text-4xl">📂</span>
                </div>
              </div>
              <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Files</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {stats.total_files}
                    </p>
                  </div>
                  <span className="text-4xl">📁</span>
                </div>
              </div>
              <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Texts</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {stats.total_texts}
                    </p>
                  </div>
                  <span className="text-4xl">📝</span>
                </div>
              </div>
            </div>

            {/* Recent Files */}
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Recent Files
              </h2>
              {files.length === 0 ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No files uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.slice(0, 6).map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => setViewerFile(file)}
                      className={`p-4 rounded-lg text-left ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {file.file_type === 'image' ? '🖼️' :
                           file.file_type === 'animation' ? '🎨' :
                           file.file_type === 'audio' ? '🎤' : '🎬'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {file.filename}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(file.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Texts */}
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Recent Texts
              </h2>
              {texts.length === 0 ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No texts created yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {texts.slice(0, 5).map((text) => (
                    <div
                      key={text.id}
                      className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {text.title}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {text.font_family} • {new Date(text.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            text.font_family === 'serif' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          }`}
                          style={{ fontFamily: text.font_family === 'serif' ? 'Georgia, serif' : 'Arial, sans-serif' }}
                        >
                          {text.font_family}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <FileUpload onSuccess={refreshData} />
        )}

        {/* Text Editor Tab */}
        {activeTab === 'text' && (
          <TextEditor onSuccess={refreshData} />
        )}

        {/* Folders Tab */}
        {activeTab === 'folders' && (
          <FolderManager onSuccess={refreshData} />
        )}

        {/* My Files Tab - View All Uploaded Files */}
        {activeTab === 'myfiles' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                All Uploaded Files
              </h2>
              {files.length === 0 ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No files uploaded yet. Go to Upload Files to add files.
                </p>
              ) : libraryLoading ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Loading your files...
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => setViewerFile(file)}
                      className={`p-4 rounded-lg text-left ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors cursor-pointer`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">
                          {file.file_type === 'image' ? '🖼️' :
                           file.file_type === 'animation' ? '🎨' :
                           file.file_type === 'audio' ? '🎤' : '🎬'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {file.filename}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {file.file_type} • {new Date(file.created_at).toLocaleDateString()}
                          </p>
                          {file.description && (
                            <p className={`text-xs mt-1 truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {file.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* All Texts */}
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                All Text Documents
              </h2>
              {texts.length === 0 ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No text documents created yet. Go to Text Editor to create one.
                </p>
              ) : libraryLoading ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Loading your text documents...
                </p>
              ) : (
                <div className="space-y-3">
                  {texts.map((text) => (
                    <button
                      key={text.id}
                      type="button"
                      onClick={() => setViewerText(text)}
                      className={`w-full p-4 rounded-lg text-left ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors cursor-pointer`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {text.title}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {text.font_family} • {new Date(text.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            text.font_family === 'serif' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          }`}
                          style={{ fontFamily: text.font_family === 'serif' ? 'Georgia, serif' : 'Arial, sans-serif' }}
                        >
                          {text.font_family}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {(viewerFile || viewerText) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className={`max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between gap-4 border-b px-4 py-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="min-w-0">
                <h2 className={`truncate text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {viewerFile?.filename || viewerText?.title}
                </h2>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {viewerFile
                    ? `${viewerFile.file_type} • ${new Date(viewerFile.created_at).toLocaleString()}`
                    : `${viewerText?.font_family} • ${viewerText ? new Date(viewerText.created_at).toLocaleString() : ''}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {viewerFile && getFileUrl(viewerFile) && (
                  <a
                    href={getFileUrl(viewerFile)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    Open
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setViewerFile(null);
                    setViewerText(null);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    darkMode
                      ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[78vh] overflow-auto p-4">
              {viewerFile && (
                <div className="space-y-4">
                  {renderFilePreview(viewerFile)}
                  {viewerFile.description && (
                    <p className={`rounded-lg p-3 text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {viewerFile.description}
                    </p>
                  )}
                </div>
              )}

              {viewerText && (
                <article
                  className={`min-h-[320px] rounded-lg p-6 leading-7 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}
                  style={{ fontFamily: viewerText.font_family === 'serif' ? 'Georgia, serif' : 'Arial, sans-serif' }}
                  dangerouslySetInnerHTML={{ __html: viewerText.content }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
