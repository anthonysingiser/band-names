import { NextResponse } from 'next/server';

const SHEETDB_ENDPOINT = process.env.SHEETDB_ENDPOINT;

export async function GET() {
  try {
    // Check if the environment variable exists
    if (!SHEETDB_ENDPOINT) {
      throw new Error('SHEETDB_ENDPOINT environment variable is not configured');
    }
    
    const response = await fetch(SHEETDB_ENDPOINT);
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching names:', error);
    return NextResponse.json(
      { error: 'Failed to fetch names' }, 
      { status: 500 }
    );
  }
}