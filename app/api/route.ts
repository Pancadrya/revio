import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Udin Petot',
    age: 25,
    hobby: 'healing',
  });
}
