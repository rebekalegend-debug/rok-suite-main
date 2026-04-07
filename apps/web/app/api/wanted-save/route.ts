import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  const body = await req.json();

  const {
    governorId,
    name,
    power,
    alliance,
    reason,
    zero
  } = body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // ✅ THIS LINE MUST EXIST
    const sheets = google.sheets({ version: 'v4', auth });

    // ✅ AND MUST BE INSIDE try
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: 'Wanted!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          governorId,
          name,
          power,
          alliance,
          reason,
          zero
        ]]
      }
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("SAVE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
