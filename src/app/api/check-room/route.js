import { NextResponse } from 'next/server';
import { RoomServiceClient } from 'livekit-server-sdk';

export async function GET(req) {
  const url = new URL(req.url);
  const roomName = url.searchParams.get('room');

  if (!roomName) {
    return NextResponse.json({ error: 'Room name required' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitHost = process.env.NEXT_PUBLIC_LIVEKIT_URL?.replace(/^https?:\/\//, '');

  if (!apiKey || !apiSecret || !livekitHost) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  try {
    const client = new RoomServiceClient(livekitHost, apiKey, apiSecret);
    const rooms = await client.listRooms();
    const exists = rooms.some(room => room.name === roomName);
    
    return NextResponse.json({ exists });
  } catch (err) {
    return NextResponse.json({ 
      error: 'Failed to check room status',
      exists: false
    }, { status: 500 });
  }
}