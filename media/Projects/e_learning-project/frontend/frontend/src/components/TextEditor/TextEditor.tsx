import React, { useState, useRef, useCallback } from 'react';
import { textApi } from '../../api/client';
import { useDataStore, useThemeStore } from '../../store';

interface TextEditorProps {
  onSuccess?: () => void;
  initialData?: {
    id?: number;
    title: string;
    content: string;
    font_family: 'serif' | 'sans-serif';
  };
}

// Available font families
const FONT_FAMILIES = [
  { value: 'serif', label: 'Serif', preview: 'Georgia, serif' },
  { value: 'sans-serif', label: 'Sans Serif', preview: 'Arial, sans-serif' },
  { value: 'monospace', label: 'Monospace', preview: 'Courier New, monospace' },
  { value: 'cursive', label: 'Cursive', preview: 'cursive' },
  { value: 'fantasy', label: 'Fantasy', preview: 'fantasy' },
];

// Font sizes
const FONT_SIZES = [
  { value: '12', label: '12px' },
  { value: '14', label: '14px' },
  { value: '16', label: '16px' },
  { value: '18', label: '18px' },
  { value: '20', label: '20px' },
  { value: '24', label: '24px' },
  { value: '32', label: '32px' },
  { value: '36', label: '36px' },
  { value: '48', label: '48px' },
];

// Text colors
const TEXT_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#000080',
  '#FFC0CB', '#FFD700', '#C0C0C0', '#808080', '#000', '#A52A2A',
];

// Background colors
const BG_COLORS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#000080',
  '#FFC0CB', '#FFD700', '#F5F5DC', '#D2B48C', '#E6E6FA', '#98FB98',
];

export function TextEditor({ onSuccess, initialData }: TextEditorProps) {
  const { darkMode } = useThemeStore();
  const { addText } = useDataStore();
  const editorRef = useRef<HTMLDivElement>(null);
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [fontFamily, setFontFamily] = useState(initialData?.font_family || 'serif');
  const [fontSize, setFontSize] = useState('16');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState<'text' | 'bg' | null>(null);
  
  // History for undo/redo
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Get content from editor
  const getContent = useCallback(() => {
    return editorRef.current?.innerHTML || '';
  }, []);

  // Set content to editor
  const setContent = useCallback((html: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  }, []);

  // Save to history
  const saveToHistory = useCallback((content: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(content);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  // Handle content change
  const handleContentChange = () => {
    const content = getContent();
    saveToHistory(content);
  };

  // Format commands
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  // Insert link
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  // Insert image
  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  // Set text color
  const setTextColor = (color: string) => {
    execCommand('foreColor', color);
    setShowColorMenu(null);
  };

  // Set background color
  const setBgColor = (color: string) => {
    execCommand('backColor', color);
    setShowColorMenu(null);
  };

  // Get font family CSS
  const getFontFamilyCSS = () => {
    const font = FONT_FAMILIES.find(f => f.value === fontFamily);
    return font?.preview || 'Georgia, serif';
  };

  // Handle save
  const handleSave = async () => {
    const content = getContent();
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!content.trim() || content === '<br>') {
      setError('Please enter some content');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const data = { title, content, font_family: fontFamily };
      const result = await textApi.create(data);
      addText(result);
      setTitle('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      setFontFamily('serif');
      setHistory(['']);
      setHistoryIndex(0);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Toolbar button component
  const ToolbarButton = ({ 
    onClick, 
    active = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    active?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-colors cursor-animate-button ${
        active 
          ? 'bg-blue-500 text-white' 
          : darkMode 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );

  // Dropdown menu component
  const DropdownMenu = ({ 
    show, 
    onClose, 
    children 
  }: { 
    show: boolean; 
    onClose: () => void;
    children: React.ReactNode;
  }) => {
    if (!show) return null;
    return (
      <div className="absolute top-full left-0 mt-1 z-50">
        <div className={`rounded-lg shadow-lg p-2 ${
          darkMode ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-200'
        }`}>
          {children}
        </div>
        <div 
          className="fixed inset-0 z-40" 
          onClick={onClose}
        />
      </div>
    );
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Advanced Text Editor
      </h3>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter title..."
          />
        </div>

        {/* Toolbar */}
        <div className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex flex-wrap gap-1 mb-2">
            {/* Undo/Redo */}
            <ToolbarButton onClick={handleUndo} title="Undo">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={handleRedo} title="Redo">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </ToolbarButton>

            <div className="w-px h-8 bg-gray-400 mx-1" />

            {/* Text Formatting */}
            <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
              <span className="font-bold text-sm">B</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
              <span className="italic text-sm">I</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
              <span className="underline text-sm">U</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('strikeThrough')} title="Strikethrough">
              <span className="line-through text-sm">S</span>
            </ToolbarButton>

            <div className="w-px h-8 bg-gray-400 mx-1" />

            {/* Alignment */}
            <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Align Left">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4h16v2H2V4zm0 4h10v2H2V8zm0 4h14v2H2v-2zm0 4h8v2H2v-2z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Align Center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4h16v2H2V4zm4 4h8v2H6V8zm-2 4h12v2H4v-2zm-2 4h16v2H2v-2z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('justifyRight')} title="Align Right">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4h16v2H2V4zm6 4h10v2H8V8zm4 4h6v2h-6v-2zm-2 4h8v2h-8v-2z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('justifyFull')} title="Justify">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4h16v2H2V4zm0 4h16v2H2V8zm0 4h16v2H2v-2zm0 4h16v2H2v-2z" />
              </svg>
            </ToolbarButton>

            <div className="w-px h-8 bg-gray-400 mx-1" />

            {/* Lists */}
            <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4h2v2H4V4zm4 0h8v2H8V4zM4 9h2v2H4V9zm4 0h8v2H8V9zm-4 5h2v2H4v-2zm4 0h8v2H8v-2z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4h2v2H2V4zm3 0h8v2H5V4zm-3 5h2v2H2V9zm3 0h8v2H5V9zm-3 5h2v2H2v-2zm3 0h8v2H5v-2z" />
              </svg>
            </ToolbarButton>

            <div className="w-px h-8 bg-gray-400 mx-1" />

            {/* Link & Image */}
            <ToolbarButton onClick={insertLink} title="Insert Link">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={insertImage} title="Insert Image">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </ToolbarButton>

            <div className="w-px h-8 bg-gray-400 mx-1" />

            {/* Text Color */}
            <div className="relative">
              <ToolbarButton 
                onClick={() => setShowColorMenu(showColorMenu === 'text' ? null : 'text')} 
                title="Text Color"
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm">A</span>
                  <div className="w-3 h-3 rounded-full bg-linear-to-br from-red-500 via-green-500 to-blue-500" />
                </div>
              </ToolbarButton>
              <DropdownMenu show={showColorMenu === 'text'} onClose={() => setShowColorMenu(null)}>
                <div className="grid grid-cols-6 gap-1">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className="w-6 h-6 rounded border border-gray-400 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </DropdownMenu>
            </div>

            {/* Background Color */}
            <div className="relative">
              <ToolbarButton 
                onClick={() => setShowColorMenu(showColorMenu === 'bg' ? null : 'bg')} 
                title="Background Color"
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm">A</span>
                  <div className="w-3 h-3 rounded-full border border-gray-400" style={{ backgroundColor: '#FFFF00' }} />
                </div>
              </ToolbarButton>
              <DropdownMenu show={showColorMenu === 'bg'} onClose={() => setShowColorMenu(null)}>
                <div className="grid grid-cols-6 gap-1">
                  {BG_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      className="w-6 h-6 rounded border border-gray-400 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </DropdownMenu>
            </div>
          </div>

          {/* Font Family & Size */}
          <div className="flex flex-wrap gap-2">
            {/* Font Family Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                className={`px-3 py-1 rounded text-sm ${
                  darkMode 
                    ? 'bg-gray-600 text-white hover:bg-gray-500' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {FONT_FAMILIES.find(f => f.value === fontFamily)?.label} ▼
              </button>
              <DropdownMenu show={showFontMenu} onClose={() => setShowFontMenu(false)}>
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => {
                      setFontFamily(font.value as any);
                      execCommand('fontName', font.preview);
                      setShowFontMenu(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'
                    }`}
                    style={{ fontFamily: font.preview }}
                  >
                    {font.label}
                  </button>
                ))}
              </DropdownMenu>
            </div>

            {/* Font Size Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSizeMenu(!showSizeMenu)}
                className={`px-3 py-1 rounded text-sm ${
                  darkMode 
                    ? 'bg-gray-600 text-white hover:bg-gray-500' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {fontSize}px ▼
              </button>
              <DropdownMenu show={showSizeMenu} onClose={() => setShowSizeMenu(false)}>
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => {
                      setFontSize(size.value);
                      execCommand('fontSize', '7'); // We'll use CSS for actual sizing
                      setShowSizeMenu(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </DropdownMenu>
            </div>

            {/* Clear Formatting */}
            <button
              onClick={() => execCommand('removeFormat')}
              className={`px-3 py-1 rounded text-sm ${
                darkMode 
                  ? 'bg-gray-600 text-white hover:bg-gray-500' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Clear Format
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Content
          </label>
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            className={`w-full min-h-300px p-4 border rounded-lg overflow-auto ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            style={{ 
              fontFamily: getFontFamilyCSS(),
              fontSize: `${fontSize}px`
            }}
            dangerouslySetInnerHTML={{ __html: initialData?.content || '' }}
          />
        </div>

        {/* Preview */}
        <div
          className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
          <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Preview:
          </p>
          <div
            className={darkMode ? 'text-white' : 'text-gray-900'}
            style={{ fontFamily: getFontFamilyCSS() }}
            dangerouslySetInnerHTML={{ __html: getContent() || 'Your text will appear here...' }}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
            onClick={handleSave}
            disabled={saving}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {saving ? 'Saving...' : 'Save Text'}
        </button>
      </div>
    </div>
  );
}
