'use client';
import React, { useState } from 'react';

interface OriginalNamesProps {
  originalNames: string[];
  className?: string;
}

export default function OriginalNames({ originalNames, className = '' }: OriginalNamesProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNames = originalNames.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Original Band Names</h2>
        <div className="text-sm text-gray-600">
          {filteredNames.length} of {originalNames.length} names
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search original names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {filteredNames.map((name, index) => (
          <div
            key={index}
            className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors break-words">
                {name}
              </h3>
              
              {/* Copy button */}
              <button
                onClick={() => navigator.clipboard.writeText(name)}
                className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-blue-600 transition-all duration-200"
                title="Copy name"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNames.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          No names found matching &quot;{searchTerm}&quot;
        </div>
      )}

      {filteredNames.length === 0 && !searchTerm && (
        <div className="text-center py-8 text-gray-500">
          No original names loaded yet...
        </div>
      )}
    </div>
  );
}