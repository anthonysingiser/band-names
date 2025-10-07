'use client';
import React from 'react';
import useNames from './hooks/useNames';
import { remix } from './lib/remix';

export default function Home() {
  const {names, loading} = useNames();

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Band-Name-Shuffle</h1>

      <ul className="list-disc pl-6">
        {names.map((n, i) => (
          <li key={i} className="hover:underline cursor-pointer"
              onClick={() => alert(remix(n))}>
            {n}
          </li>
        ))}
      </ul>

      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={() => {
          const random = names[Math.floor(Math.random() * names.length)];
          alert(remix(random));
        }}>
        Remix random name
      </button>
    </main>
  )
}