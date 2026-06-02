import React, { createContext, useContext, useState } from 'react';

// Types
interface User {
  id: number;
  username: string;
  [key: string]: any;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (u: User | null) => void;
  setLoading: (v: boolean) => void;
  logout: () => void;
}

interface ThemeStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

interface DataStore {
  folders: any[];
  files: any[];
  texts: any[];
  setFolders: (arr: any[]) => void;
  setFiles: (arr: any[]) => void;
  setTexts: (arr: any[]) => void;
  addText: (t: any) => void;
  addFolder: (f: any) => void;
  removeFolder: (id: number) => void;
  addFile: (f: any) => void;
}

const AuthContext = createContext<AuthStore | undefined>(undefined);
const ThemeContext = createContext<ThemeStore | undefined>(undefined);
const DataContext = createContext<DataStore | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const authStore: AuthStore = {
    user,
    isAuthenticated: !!user,
    setUser,
    setLoading: setAuthLoading,
    logout: () => setUser(null),
  };

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const themeStore: ThemeStore = {
    darkMode,
    toggleDarkMode: () => setDarkMode((v) => !v),
  };

  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [texts, setTexts] = useState<any[]>([]);

  const dataStore: DataStore = {
    folders,
    files,
    texts,
    setFolders,
    setFiles,
    setTexts,
    addFolder: (f: any) => setFolders((s) => [f, ...s]),
    removeFolder: (id: number) => setFolders((s) => s.filter((x) => x.id !== id)),
    addFile: (f: any) => setFiles((s) => [f, ...s]),
    addText: (t: any) => setTexts((s) => [t, ...s]),
  };

  return (
    <AuthContext.Provider value={authStore}>
      <ThemeContext.Provider value={themeStore}>
        <DataContext.Provider value={dataStore}>{children}</DataContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
};

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within AppProvider');
  return ctx;
}

export function useThemeStore() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeStore must be used within AppProvider');
  return ctx;
}

export function useDataStore() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataStore must be used within AppProvider');
  return ctx;
}
