'use client';
import React, { useState } from 'react';
import useNames from './hooks/useNames';
import MagicBall from './components/MagicBall';
import SavedNames from './components/SavedNames';
import OriginalNames from './components/LegacyRemixer';

export default function Home() {
  const { names, wordBag, savedNames, loading, saveGeneratedName, removeSavedName } = useNames();
  const [activeTab, setActiveTab] = useState<'generator' | 'collection' | 'remixer'>('generator');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading the mystical word repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🎭 Magical Band Name Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Harness the power of the crystal ball to generate unique band names from a mystical word bag. 
            Click floating names to save them to your collection!
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-purple-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{wordBag.length}</div>
              <div className="text-sm text-gray-600">Words in Mystical Bag</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{names.length}</div>
              <div className="text-sm text-gray-600">Original Names</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{savedNames.length}</div>
              <div className="text-sm text-gray-600">Saved to Collection</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-purple-200">
            {[
              { id: 'generator', label: '🔮 Generator', desc: 'Magic Ball' },
              { id: 'collection', label: '💎 Collection', desc: 'Saved Names' },
              { id: 'remixer', label: '📋 Original', desc: 'Source Names' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'generator' | 'collection' | 'remixer')}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'generator' && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-purple-200 shadow-xl">
              <MagicBall 
                wordBag={wordBag} 
                onSaveName={saveGeneratedName}
              />
            </div>
          )}

          {activeTab === 'collection' && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-purple-200 shadow-xl">
              <SavedNames 
                savedNames={savedNames} 
                onRemoveName={removeSavedName}
              />
            </div>
          )}

          {activeTab === 'remixer' && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-purple-200 shadow-xl">
              <OriginalNames 
                originalNames={names}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm"> 
          <p className="mt-2">
            Made with 💜 for musicians, and name enthusiasts
          </p>
        </div>
      </div>
    </div>
  );
}