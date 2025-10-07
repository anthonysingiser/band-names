'use client';
import { useState, useEffect } from 'react';

const ENDPOINT = 'https://sheetdb.io/api/v1/xdwcmr11otzgn';

export  default function useNames() {
    const [names, setNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(ENDPOINT)
        .then((response) => response.json())
        .then((rows: any[]) => {
            const extractedNames: string[] = rows.flatMap((row: any) => {
                return Object.keys(row)
                    .filter((key) => key.startsWith('#'))
                    .map((key) => row[key])
                    .filter((name) => name.trim() !== '');
            });
            setNames(extractedNames);
        })
        .finally(() => setLoading(false));
    }, []);

    return { names, loading };
}