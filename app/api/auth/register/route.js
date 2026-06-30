import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    success: false, 
    error: 'Registration via local credentials is disabled. Onboard via Discord.' 
  }, { status: 403 });
}
