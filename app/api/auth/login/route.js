import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    success: false, 
    error: 'Login via local credentials is disabled. Authenticate via Discord.' 
  }, { status: 403 });
}
