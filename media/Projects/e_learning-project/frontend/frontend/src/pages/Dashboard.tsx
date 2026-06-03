import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore, useDataStore } from '../store';
import { dashboardApi } from '../api/client';
import { Navbar } from '../components/Navbar/Navbar';
import { FileUpload } from '../components/FileUpload/FileUpload';
import { TextEditor } from '../components/TextEditor/TextEditor';
import { FolderManager } from '../components/FolderManager/FolderManager';

type Tab = 'dashboard' | 'upload' | 'text' | 'folders';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, setUser, setLoading: setAuthLoading } = useAuthStore();
  const { darkMode } = useThemeStore();
  const { setFolders, setFiles, setTexts, files, texts } = useDataStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_folders: 0, total_files: 0, total_texts: 0 });

  useEffect(() => {
    const fetchDashboard = async () => {
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

    fetchDashboard();
  }, []);

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
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
                    <div
                      key={file.id}
                      className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
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
                    </div>
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
      </div>
    </div>
  );
}
