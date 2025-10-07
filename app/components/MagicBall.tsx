'use client';
import React, { useState, useEffect, useRef } from 'react';
import { NameGenerator, NAME_PATTERNS, NamePattern } from '../lib/nameGenerator';

interface FloatingName {
  id: string;
  name: string;
  pattern: NamePattern;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  scale: number;
  generation: number; // Track which batch this name belongs to
}

interface MagicBallProps {
  wordBag: string[];
  onSaveName: (name: string) => void;
  className?: string;
}

export default function MagicBall({ wordBag, onSaveName, className = '' }: MagicBallProps) {
  const [generator] = useState(() => new NameGenerator(wordBag));
  const [floatingNames, setFloatingNames] = useState<FloatingName[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [ballGlow, setBallGlow] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (wordBag.length === 0) return;

    const animate = () => {
      setFloatingNames(prev => {
        let updatedNames = prev.map(name => {
          let newX = name.x + name.vx;
          let newY = name.y + name.vy;
          let newVx = name.vx;
          let newVy = name.vy;

          // Bounce off edges
          if (newX <= 0 || newX >= 480) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(480, newX));
          }
          if (newY <= 0 || newY >= 480) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(480, newY));
          }

          return {
            ...name,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            opacity: Math.max(0, name.opacity - 0.0005) // Much slower fade
          };
        });

        // Collision detection and separation (only within same generation)
        for (let i = 0; i < updatedNames.length; i++) {
          for (let j = i + 1; j < updatedNames.length; j++) {
            const name1 = updatedNames[i];
            const name2 = updatedNames[j];
            
            // Only apply collision detection if names are from the same generation
            if (name1.generation !== name2.generation) continue;
            
            // Calculate distance between centers
            const dx = name2.x - name1.x;
            const dy = name2.y - name1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Minimum distance to avoid overlap (adjust based on text length)
            const minDistance = Math.max(60, Math.max(name1.name.length, name2.name.length) * 8);
            
            if (distance < minDistance && distance > 0) {
              // Calculate separation force
              const overlap = minDistance - distance;
              const separationForce = overlap * 0.05; // Much gentler separation force
              
              // Normalize direction vector
              const dirX = dx / distance;
              const dirY = dy / distance;
              
              // Apply separation forces
              const force1X = -dirX * separationForce;
              const force1Y = -dirY * separationForce;
              const force2X = dirX * separationForce;
              const force2Y = dirY * separationForce;
              
              // Update positions
              updatedNames[i] = {
                ...name1,
                x: Math.max(0, Math.min(480, name1.x + force1X)),
                y: Math.max(0, Math.min(480, name1.y + force1Y)),
                vx: name1.vx + force1X * 0.1, // Much gentler velocity changes
                vy: name1.vy + force1Y * 0.1
              };
              
              updatedNames[j] = {
                ...name2,
                x: Math.max(0, Math.min(480, name2.x + force2X)),
                y: Math.max(0, Math.min(480, name2.y + force2Y)),
                vx: name2.vx + force2X * 0.1, // Much gentler velocity changes
                vy: name2.vy + force2Y * 0.1
              };
            }
          }
        }

        return updatedNames.filter(name => name.opacity > 0.05); // Remove faded names
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [wordBag]);

  const generateFloatingName = () => {
    const result = generator.generateName(selectedPattern || undefined);
    if (!result) return;

    // Try to find a position that doesn't overlap with existing names
    let attempts = 0;
    let validPosition = false;
    let spawnX: number, spawnY: number;

    do {
      spawnX = Math.random() * 400 + 40;
      spawnY = Math.random() * 400 + 40;
      
      // Check if this position overlaps with existing names from the same generation
      validPosition = !floatingNames.some(existingName => {
        // Only check collision with names from the current generation
        if (existingName.generation !== currentGeneration) return false;
        
        const dx = spawnX - existingName.x;
        const dy = spawnY - existingName.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = Math.max(60, Math.max(result.name.length, existingName.name.length) * 8);
        return distance < minDistance;
      });
      
      attempts++;
    } while (!validPosition && attempts < 10); // Try max 10 times

    const newName: FloatingName = {
      id: Math.random().toString(36).substr(2, 9),
      name: result.name,
      pattern: result.pattern,
      x: spawnX,
      y: spawnY,
      vx: (Math.random() - 0.5) * 0.8, // Much slower movement
      vy: (Math.random() - 0.5) * 0.8, // Much slower movement
      opacity: 1,
      scale: 1.0 + Math.random() * 0.3, // Bigger base size
      generation: currentGeneration
    };

    setFloatingNames(prev => [...prev, newName]);
  };

  const shakeBall = () => {
    setIsShaking(true);
    setBallGlow(true);
    
    // Increment generation for new batch of names
    setCurrentGeneration(prev => prev + 1);
    
    // Generate multiple names
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => generateFloatingName(), i * 200);
      }
    }, 300);

    setTimeout(() => {
      setIsShaking(false);
      setBallGlow(false);
    }, 800);
  };

  const handleNameClick = (name: FloatingName) => {
    onSaveName(name.name);
    
    // Remove the clicked name with a nice effect
    setFloatingNames(prev => 
      prev.map(n => 
        n.id === name.id 
          ? { ...n, opacity: 0, scale: n.scale * 1.5 }
          : n
      )
    );

    // Show feedback
    setBallGlow(true);
    setTimeout(() => setBallGlow(false), 300);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Control Panel */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Name Pattern (leave empty for random):
          </label>
          <select 
            value={selectedPattern} 
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">Random Pattern</option>
            {NAME_PATTERNS.map(pattern => (
              <option key={pattern.id} value={pattern.id}>
                {pattern.name} - {pattern.description}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={shakeBall}
            disabled={isShaking}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isShaking ? 'Generating...' : 'Shake the Crystal Ball'}
          </button>
          
          <button
            onClick={() => generator.resetUsedWords()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Reset Word Pool
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Words remaining: {generator.getRemainingWordsCount()} / {wordBag.length}
        </div>
      </div>

      {/* Magic Crystal Ball */}
      <div 
        ref={containerRef}
        className="relative w-[500px] h-[500px] mx-auto"
      >
        {/* Crystal Ball */}
        <div className={`
          absolute inset-0 rounded-full 
          bg-gradient-to-br from-purple-200 via-blue-200 to-purple-300
          border-4 border-purple-400
          shadow-2xl
          transition-all duration-300
          ${isShaking ? 'animate-bounce' : ''}
          ${ballGlow ? 'shadow-purple-400/50 shadow-2xl ring-4 ring-purple-300' : ''}
        `}>
          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent" />
          
          {/* Center sparkle */}
          <div className="absolute inset-1/2 w-6 h-6 -translate-x-3 -translate-y-3">
            <div className={`w-full h-full bg-white rounded-full ${ballGlow ? 'animate-ping' : 'animate-pulse'}`} />
          </div>
        </div>

        {/* Floating Names */}
        {floatingNames.map(name => (
          <div
            key={name.id}
            className="absolute cursor-pointer transition-transform hover:scale-110"
            style={{
              left: `${name.x}px`,
              top: `${name.y}px`,
              opacity: name.opacity,
              transform: `scale(${name.scale})`,
              zIndex: 10
            }}
            onClick={() => handleNameClick(name)}
          >
            <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full shadow-xl border-2 border-purple-300 hover:bg-purple-50 transition-colors">
              <span className="text-lg font-bold text-purple-900">
                {name.name}
              </span>
            </div>
          </div>
        ))}

        {/* Instructions */}
        {floatingNames.length === 0 && !isShaking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-purple-600 bg-white/80 p-4 rounded-lg">
              <p className="font-medium">Click "Shake the Crystal Ball"</p>
              <p className="text-sm">to generate magical band names!</p>
            </div>
          </div>
        )}
      </div>

      {/* Pattern Info */}
      {selectedPattern && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <div className="text-sm">
            <strong>Selected Pattern:</strong> {NAME_PATTERNS.find(p => p.id === selectedPattern)?.name}
            <br />
            <span className="text-gray-600">
              {NAME_PATTERNS.find(p => p.id === selectedPattern)?.description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}