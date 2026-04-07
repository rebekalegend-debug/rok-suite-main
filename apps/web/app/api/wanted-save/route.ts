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
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.WANTED_SHEET_ID!,
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
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
