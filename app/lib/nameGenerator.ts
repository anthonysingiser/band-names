import v from 'voca';

export interface NamePattern {
  id: string;
  name: string;
  description: string;
  generate: (words: string[]) => string;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function capitalize(word: string): string {
    return v.capitalize(word);
}

function getRandomWords(wordBag: string[], count: number, exclude: string[] = []): string[] {
    const availableWords = wordBag.filter(word => !exclude.includes(word));
    const shuffled = shuffle(availableWords);
    return shuffled.slice(0, count);
}

export const NAME_PATTERNS: NamePattern[] = [
    {
        id: 'single',
        name: 'Single Word',
        description: 'One powerful word',
        generate: (wordBag: string[]) => {
            const [word] = getRandomWords(wordBag, 1);
            return capitalize(word);
        }
    },
    {
        id: 'double',
        name: 'Two Words',
        description: 'Simple combination',
        generate: (wordBag: string[]) => {
            const [word1, word2] = getRandomWords(wordBag, 2);
            return `${capitalize(word1)} ${capitalize(word2)}`;
        }
    },
    {
        id: 'triple',
        name: 'Three Words',
        description: 'Complex combination',
        generate: (wordBag: string[]) => {
            const [word1, word2, word3] = getRandomWords(wordBag, 3);
            return `${capitalize(word1)} ${capitalize(word2)} ${capitalize(word3)}`;
        }
    },
    {
        id: 'the_single',
        name: 'The [Word]',
        description: 'Classic definitive style',
        generate: (wordBag: string[]) => {
            const [word] = getRandomWords(wordBag, 1);
            return `The ${capitalize(word)}`;
        }
    },
    {
        id: 'the_plural',
        name: 'The [Words]',
        description: 'Definitive with multiple words',
        generate: (wordBag: string[]) => {
            const [word1, word2] = getRandomWords(wordBag, 2);
            return `The ${capitalize(word1)} ${capitalize(word2)}`;
        }
    },
    {
        id: 'and_the',
        name: '[Word] and the [Words]',
        description: 'Lead singer and band style',
        generate: (wordBag: string[]) => {
            const [lead, word1, word2] = getRandomWords(wordBag, 3);
            return `${capitalize(lead)} and the ${capitalize(word1)} ${capitalize(word2)}`;
        }
    },
    {
        id: 'of_the',
        name: '[Word] of the [Word]',
        description: 'Possessive or descriptive style',
        generate: (wordBag: string[]) => {
            const [word1, word2] = getRandomWords(wordBag, 2);
            return `${capitalize(word1)} of the ${capitalize(word2)}`;
        }
    },
    {
        id: 'compound',
        name: '[Word][Word]',
        description: 'Merged compound word',
        generate: (wordBag: string[]) => {
            const [word1, word2] = getRandomWords(wordBag, 2);
            return capitalize(word1 + word2);
        }
    }
];

export class NameGenerator {
    private usedWords: Set<string> = new Set();
    private wordBag: string[];

    constructor(wordBag: string[]) {
        this.wordBag = [...wordBag];
    }

    generateName(patternId?: string): { name: string, pattern: NamePattern } | null {
        if (this.usedWords.size >= this.wordBag.length - 3) {
            // Reset if we've used most words
            this.resetUsedWords();
        }

        const availableWords = this.wordBag.filter(word => !this.usedWords.has(word));
        
        if (availableWords.length < 3) {
            return null; // Not enough words left
        }

        const pattern = patternId 
            ? NAME_PATTERNS.find(p => p.id === patternId) || NAME_PATTERNS[0]
            : NAME_PATTERNS[Math.floor(Math.random() * NAME_PATTERNS.length)];

        let generatedName = pattern.generate(availableWords);
        
        // Ensure name doesn't end with "the" (case insensitive)
        if (generatedName.toLowerCase().endsWith(' the')) {
            // Try generating again with a different pattern or words
            let attempts = 0;
            while (generatedName.toLowerCase().endsWith(' the') && attempts < 5) {
                generatedName = pattern.generate(availableWords);
                attempts++;
            }
            
            // If still ending with "the", try a different pattern
            if (generatedName.toLowerCase().endsWith(' the')) {
                const alternativePatterns = NAME_PATTERNS.filter(p => p.id !== pattern.id);
                if (alternativePatterns.length > 0) {
                    const altPattern = alternativePatterns[Math.floor(Math.random() * alternativePatterns.length)];
                    generatedName = altPattern.generate(availableWords);
                }
            }
        }
        
        // Mark words as used
        const wordsInName = v.words(generatedName.toLowerCase());
        wordsInName.forEach(word => {
            // Remove common articles/prepositions from tracking
            if (!['the', 'and', 'of'].includes(word)) {
                this.usedWords.add(word);
            }
        });

        return {
            name: generatedName,
            pattern
        };
    }

    resetUsedWords() {
        this.usedWords.clear();
    }

    getUsedWordsCount(): number {
        return this.usedWords.size;
    }

    getRemainingWordsCount(): number {
        return this.wordBag.length - this.usedWords.size;
    }
}

export function remixExistingName(name: string): string {
    const words = v.words(name);
    const shuffled = shuffle(words);
    return shuffled.map(capitalize).join(' ');
}