'use client';
import React, { useState } from 'react';

interface SavedNamesProps {
  savedNames: string[];
  onRemoveName: (index: number) => void;
  className?: string;
}

export default function SavedNames({ savedNames, onRemoveName, className = '' }: SavedNamesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  const filteredAndSortedNames = React.useMemo(() => {
    let filtered = savedNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case 'oldest':
        return filtered;
      case 'alphabetical':
        return [...filtered].sort((a, b) => a.localeCompare(b));
      case 'newest':
      default:
        return [...filtered].reverse();
    }
  }, [savedNames, searchTerm, sortBy]);

  const exportNames = () => {
    const dataStr = JSON.stringify(savedNames, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'band-names-collection.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyAllNames = () => {
    const namesList = savedNames.join('\n');
    navigator.clipboard.writeText(namesList);
  };

  if (savedNames.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h3 className="text-lg font-medium text-gray-600">No saved names yet</h3>
          <p className="text-sm text-gray-500">Generate some names and click on them to save!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Your Collection ({savedNames.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={copyAllNames}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Copy All
          </button>
          <button
            onClick={exportNames}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search your collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      {/* Names Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAndSortedNames.map((name, index) => {
          const originalIndex = savedNames.findIndex(savedName => savedName === name);
          return (
            <div
              key={`${name}-${originalIndex}`}
              className="group relative bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 min-h-[80px]"
            >
              <div className="pr-8">
                <h3 className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors break-words">
                  {name}
                </h3>
              </div>
              
              {/* Remove button - top right */}
              <button
                onClick={() => onRemoveName(originalIndex)}
                className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 transition-all duration-200 hover:scale-110 bg-white/80 rounded-full"
                title="Remove from collection"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Copy individual name - bottom right */}
              <button
                onClick={() => navigator.clipboard.writeText(name)}
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-purple-600 transition-all duration-200 bg-white/80 rounded-full shadow-sm hover:shadow-md"
                title="Copy name"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Search results info */}
      {searchTerm && filteredAndSortedNames.length !== savedNames.length && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredAndSortedNames.length} of {savedNames.length} names
        </div>
      )}
    </div>
  );
}