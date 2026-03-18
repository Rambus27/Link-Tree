'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LinkItem } from '@/types';

interface DraggableLinkItemProps {
  link: LinkItem;
  onUpdate: (id: string, updates: Partial<LinkItem>) => void;
  onDelete: (id: string) => void;
  primaryColor: string;
}

function SortableLinkItem({ link, onUpdate, onDelete, primaryColor }: DraggableLinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
      <div className="flex items-center gap-2 p-3">
        {/* Drag handle */}
        <button
          className="text-gray-400 cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 6zm0 6a2 2 0 10.001 4.001A2 2 0 007 12zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 4zm0 6a2 2 0 10-.001-4.001A2 2 0 0013 10zm0 6a2 2 0 10-.001-4.001A2 2 0 0013 16z" />
          </svg>
        </button>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{link.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{link.url}</p>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {isEditing && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-200 dark:border-gray-600 pt-2">
          <input
            type="text"
            value={link.title}
            onChange={(e) => onUpdate(link.id, { title: e.target.value })}
            placeholder="Link title"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="url"
            value={link.url}
            onChange={(e) => onUpdate(link.id, { url: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Button Color</label>
              <input
                type="color"
                value={link.backgroundColor || primaryColor}
                onChange={(e) => onUpdate(link.id, { backgroundColor: e.target.value })}
                className="w-full h-8 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Text Color</label>
              <input
                type="color"
                value={link.color || '#ffffff'}
                onChange={(e) => onUpdate(link.id, { color: e.target.value })}
                className="w-full h-8 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DraggableLinkListProps {
  links: LinkItem[];
  onUpdate: (id: string, updates: Partial<LinkItem>) => void;
  onDelete: (id: string) => void;
  primaryColor: string;
}

export default function DraggableLinkList({ links, onUpdate, onDelete, primaryColor }: DraggableLinkListProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <div className="text-3xl mb-2">🔗</div>
        <p className="text-sm">No links yet. Add your first link!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {links.map((link) => (
        <SortableLinkItem
          key={link.id}
          link={link}
          onUpdate={onUpdate}
          onDelete={onDelete}
          primaryColor={primaryColor}
        />
      ))}
    </div>
  );
}
