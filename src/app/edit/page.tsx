'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { v4 as uuidv4 } from 'uuid';
import { PageConfig, LinkItem } from '@/types';
import DraggableLinkList from '@/components/DraggableLinkList';
import PublicPage from '@/components/PublicPage';

const templateConfigs: Record<string, Partial<PageConfig>> = {
  minimal: {
    background: { type: 'color', value: '#ffffff' },
    primaryColor: '#6366f1',
    textColor: '#1f2937',
    buttonStyle: 'pill',
    font: 'Inter',
    theme: 'light',
  },
  gradient: {
    background: { type: 'gradient', value: '', gradient: { from: '#667eea', to: '#764ba2', direction: '135deg' } },
    primaryColor: '#ffffff',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    font: 'Poppins',
    theme: 'light',
  },
  dark: {
    background: { type: 'color', value: '#0f172a' },
    primaryColor: '#818cf8',
    textColor: '#e2e8f0',
    buttonStyle: 'rounded',
    font: 'Inter',
    theme: 'dark',
  },
  nature: {
    background: { type: 'gradient', value: '', gradient: { from: '#134e5e', to: '#71b280', direction: '135deg' } },
    primaryColor: '#ffffff',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    font: 'Poppins',
    theme: 'light',
  },
  sunset: {
    background: { type: 'gradient', value: '', gradient: { from: '#f7971e', to: '#ffd200', direction: '135deg' } },
    primaryColor: '#7c3aed',
    textColor: '#1f2937',
    buttonStyle: 'pill',
    font: 'Poppins',
    theme: 'light',
  },
  rose: {
    background: { type: 'gradient', value: '', gradient: { from: '#f43f5e', to: '#ec4899', direction: '135deg' } },
    primaryColor: '#ffffff',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    font: 'Playfair Display',
    theme: 'light',
  },
};

const defaultConfig: PageConfig = {
  title: 'Your Name',
  bio: 'Welcome to my page! 👋',
  profileImage: '',
  background: { type: 'color', value: '#ffffff' },
  links: [
    { id: uuidv4(), title: 'My Website', url: 'https://example.com', backgroundColor: '#6366f1', color: '#ffffff' },
    { id: uuidv4(), title: 'Follow on Twitter', url: 'https://twitter.com', backgroundColor: '#1da1f2', color: '#ffffff' },
  ],
  font: 'Inter',
  primaryColor: '#6366f1',
  textColor: '#1f2937',
  buttonStyle: 'pill',
  theme: 'light',
};

function EditPageContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  
  const [config, setConfig] = useState<PageConfig>(() => {
    if (templateId && templateConfigs[templateId]) {
      return { ...defaultConfig, ...templateConfigs[templateId] };
    }
    return defaultConfig;
  });
  
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'style' | 'music'>('profile');
  const [saving, setSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [showAddLink, setShowAddLink] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!username.trim() || username.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    
    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-username/${encodeURIComponent(username)}`);
        const data = await res.json();
        setUsernameStatus(data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [username]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = config.links.findIndex((l) => l.id === active.id);
      const newIndex = config.links.findIndex((l) => l.id === over.id);
      setConfig((prev) => ({ ...prev, links: arrayMove(prev.links, oldIndex, newIndex) }));
    }
  };

  const addLink = () => {
    if (!newLink.title || !newLink.url) return;
    const link: LinkItem = {
      id: uuidv4(),
      title: newLink.title,
      url: newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`,
      backgroundColor: config.primaryColor,
      color: '#ffffff',
    };
    setConfig((prev) => ({ ...prev, links: [...prev.links, link] }));
    setNewLink({ title: '', url: '' });
    setShowAddLink(false);
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    setConfig((prev) => ({
      ...prev,
      links: prev.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  };

  const deleteLink = (id: string) => {
    setConfig((prev) => ({ ...prev, links: prev.links.filter((l) => l.id !== id) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          username: username.trim() || undefined,
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        const fullUrl = `${window.location.origin}${data.url}`;
        setSavedUrl(fullUrl);
      } else {
        alert(data.error || 'Failed to save page');
      }
    } catch {
      alert('Failed to save page. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = () => {
    if (savedUrl) {
      navigator.clipboard.writeText(savedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      <div className="flex h-[calc(100vh-64px)]">
        {/* Editor Panel */}
        <div className="w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Your Page</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Changes preview in real-time →</p>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {(['profile', 'links', 'style', 'music'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="p-4 space-y-4">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-fade-in">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username (optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      placeholder="yourname"
                      className="w-full pl-8 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {usernameStatus !== 'idle' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameStatus === 'checking' && <span className="text-gray-400 text-xs">...</span>}
                        {usernameStatus === 'available' && <span className="text-green-500 text-xs">✓ Available</span>}
                        {usernameStatus === 'taken' && <span className="text-red-500 text-xs">✗ Taken</span>}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Creates a URL like: /u/yourname
                  </p>
                </div>
                
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={config.profileImage || ''}
                    onChange={(e) => setConfig((p) => ({ ...p, profileImage: e.target.value }))}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title / Name
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Your Name"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={config.bio}
                    onChange={(e) => setConfig((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell people about yourself..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            )}
            
            {/* Links Tab */}
            {activeTab === 'links' && (
              <div className="space-y-4 animate-fade-in">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext items={config.links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                    <DraggableLinkList
                      links={config.links}
                      onUpdate={updateLink}
                      onDelete={deleteLink}
                      primaryColor={config.primaryColor}
                    />
                  </SortableContext>
                </DndContext>
                
                {/* Add Link Form */}
                {showAddLink ? (
                  <div className="border border-indigo-200 dark:border-indigo-700 rounded-xl p-3 space-y-2 bg-indigo-50 dark:bg-indigo-900/20">
                    <input
                      type="text"
                      value={newLink.title}
                      onChange={(e) => setNewLink((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Link title"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex gap-2">
                      <button onClick={addLink} className="flex-1 bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors">
                        Add Link
                      </button>
                      <button onClick={() => setShowAddLink(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddLink(true)}
                    className="w-full py-2.5 border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    + Add New Link
                  </button>
                )}
              </div>
            )}
            
            {/* Style Tab */}
            {activeTab === 'style' && (
              <div className="space-y-4 animate-fade-in">
                {/* Background Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background</label>
                  <div className="flex gap-2 mb-3">
                    {(['color', 'gradient', 'image'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setConfig((p) => ({ ...p, background: { ...p.background, type } }))}
                        className={`flex-1 py-1.5 text-xs rounded-lg font-medium capitalize transition-colors ${
                          config.background.type === type
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  
                  {config.background.type === 'color' && (
                    <input
                      type="color"
                      value={config.background.value}
                      onChange={(e) => setConfig((p) => ({ ...p, background: { ...p.background, value: e.target.value } }))}
                      className="w-full h-10 rounded-xl cursor-pointer border border-gray-200 dark:border-gray-600"
                    />
                  )}
                  
                  {config.background.type === 'gradient' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">From</label>
                          <input
                            type="color"
                            value={config.background.gradient?.from || '#667eea'}
                            onChange={(e) => setConfig((p) => ({ ...p, background: { ...p.background, gradient: { ...p.background.gradient!, from: e.target.value } } }))}
                            className="w-full h-8 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">To</label>
                          <input
                            type="color"
                            value={config.background.gradient?.to || '#764ba2'}
                            onChange={(e) => setConfig((p) => ({ ...p, background: { ...p.background, gradient: { ...p.background.gradient!, to: e.target.value } } }))}
                            className="w-full h-8 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600"
                          />
                        </div>
                      </div>
                      <select
                        value={config.background.gradient?.direction || '135deg'}
                        onChange={(e) => setConfig((p) => ({ ...p, background: { ...p.background, gradient: { ...p.background.gradient!, direction: e.target.value } } }))}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="135deg">Diagonal ↘</option>
                        <option value="180deg">Top to Bottom ↓</option>
                        <option value="90deg">Left to Right →</option>
                        <option value="45deg">Diagonal ↗</option>
                      </select>
                    </div>
                  )}
                  
                  {config.background.type === 'image' && (
                    <input
                      type="url"
                      value={config.background.value}
                      onChange={(e) => setConfig((p) => ({ ...p, background: { ...p.background, value: e.target.value } }))}
                      placeholder="https://example.com/bg.jpg"
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
                
                {/* Colors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block font-medium">Primary Color</label>
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig((p) => ({ ...p, primaryColor: e.target.value }))}
                      className="w-full h-10 rounded-xl cursor-pointer border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block font-medium">Text Color</label>
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => setConfig((p) => ({ ...p, textColor: e.target.value }))}
                      className="w-full h-10 rounded-xl cursor-pointer border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                </div>
                
                {/* Font */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font</label>
                  <select
                    value={config.font}
                    onChange={(e) => setConfig((p) => ({ ...p, font: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>
                
                {/* Button Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Button Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['rounded', 'pill', 'square', 'outline'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setConfig((p) => ({ ...p, buttonStyle: style }))}
                        className={`py-2 text-sm font-medium capitalize transition-colors ${
                          config.buttonStyle === style
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } ${style === 'pill' ? 'rounded-full' : style === 'rounded' ? 'rounded-lg' : style === 'square' ? 'rounded-none' : 'rounded-lg border-2 border-current bg-transparent'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Music Tab */}
            {activeTab === 'music' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="text-2xl mb-2">🎵</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add background music to your page. Visitors can play/pause using the music player.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Music URL
                  </label>
                  <input
                    type="url"
                    value={config.music?.url || ''}
                    onChange={(e) => setConfig((p) => ({ 
                      ...p, 
                      music: { ...p.music, url: e.target.value, autoplay: p.music?.autoplay || false } 
                    }))}
                    placeholder="https://example.com/song.mp3"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Song Title (optional)
                  </label>
                  <input
                    type="text"
                    value={config.music?.title || ''}
                    onChange={(e) => setConfig((p) => ({ 
                      ...p, 
                      music: { ...p.music, url: p.music?.url || '', title: e.target.value, autoplay: p.music?.autoplay || false } 
                    }))}
                    placeholder="Song name - Artist"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Autoplay</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Plays when page loads (browser may block)</p>
                  </div>
                  <button
                    onClick={() => setConfig((p) => ({ ...p, music: { ...p.music, url: p.music?.url || '', autoplay: !p.music?.autoplay } }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${config.music?.autoplay ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${config.music?.autoplay ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
                
                {!config.music?.url && (
                  <button
                    onClick={() => setConfig((p) => ({ ...p, music: undefined }))}
                    className="w-full py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    Remove Music
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Save Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {savedUrl ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium">Page Published!</p>
                    <p className="text-xs text-green-600 dark:text-green-400 truncate">{savedUrl}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={copyUrl} className="flex-1 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors">
                    {copied ? '✓ Copied!' : 'Copy Link'}
                  </button>
                  <a href={savedUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center">
                    Open Page
                  </a>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving || usernameStatus === 'taken'}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : '✨ Save & Publish'}
              </button>
            )}
          </div>
        </div>
        
        {/* Live Preview */}
        <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-gray-100 dark:bg-gray-900">
          <div className="text-center mb-4 absolute top-20 left-1/2 -translate-x-1/4">
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">Live Preview</span>
          </div>
          {/* Phone mockup */}
          <div className="relative">
            <div className="w-72 h-[600px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10" />
              <div className="h-full overflow-y-auto">
                <PublicPage config={config} isPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="text-gray-500">Loading editor...</div></div>}>
      <EditPageContent />
    </Suspense>
  );
}
