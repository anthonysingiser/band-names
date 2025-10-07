import { NextResponse } from 'next/server';

const SHEETDB_ENDPOINT = process.env.SHEETDB_ENDPOINT || 'https://sheetdb.io/api/v1/xdwcmr11otzgn';

export async function GET() {
  try {
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