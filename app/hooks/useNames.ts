'use client';
import { useState, useEffect } from 'react';
import v from 'voca';

const ENDPOINT = '/api/names'; // Use internal API route

export default function useNames() {
    const [names, setNames] = useState<string[]>([]);
    const [wordBag, setWordBag] = useState<string[]>([]);
    const [savedNames, setSavedNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load saved names from localStorage
        const saved = localStorage.getItem('savedBandNames');
        if (saved) {
            setSavedNames(JSON.parse(saved));
        }

        fetch(ENDPOINT)
        .then((response) => response.json())
        .then((rows: Record<string, string>[]) => {
            const extractedNames: string[] = rows.flatMap((row: Record<string, string>) => {
                return Object.keys(row)
                    .filter((key) => key.startsWith('#'))
                    .map((key) => row[key])
                    .filter((name) => name.trim() !== '');
            });
            
            // Create word bag from all names
            const allWords = extractedNames.flatMap(name => {
                const words = v.words(name.toLowerCase());
                return words.filter(word => {
                    // Filter out very short words and common articles/prepositions
                    return word.length > 2 && 
                           !['the', 'and', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by'].includes(word);
                });
            });
            
            // Remove duplicates and create unique word bag
            const uniqueWords = [...new Set(allWords)];
            
            setNames(extractedNames);
            setWordBag(uniqueWords);
        })
        .finally(() => setLoading(false));
    }, []);

    const saveGeneratedName = (name: string) => {
        const updatedSaved = [...savedNames, name];
        setSavedNames(updatedSaved);
        localStorage.setItem('savedBandNames', JSON.stringify(updatedSaved));
    };

    const removeSavedName = (index: number) => {
        const updatedSaved = savedNames.filter((_, i) => i !== index);
        setSavedNames(updatedSaved);
        localStorage.setItem('savedBandNames', JSON.stringify(updatedSaved));
    };

    return { 
        names, 
        wordBag, 
        savedNames, 
        loading, 
        saveGeneratedName, 
        removeSavedName 
    };
}