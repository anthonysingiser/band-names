import v from 'voca';

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function remix(name: string): string {
    const words = v.words(name); // split on spaces and punctuation
    const shuffled = shuffle(words); // shuffle the array
    return shuffled.join(' '); // join back into a string
}