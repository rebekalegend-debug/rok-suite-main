import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: '3237!A:C', // ID | Name | Power
    });

    const rows = res.data.values || [];

    const data = rows.slice(1).map(row => ({
      ID: row[0],
      Name: row[1],
      Power: row[2]
    }));

  return NextResponse.json(data);

} catch (err: any) {
  console.error("GOOGLE API ERROR:", err);
  return NextResponse.json({ 
    error: err.message || 'Failed',
    details: err.toString()
  }, { status: 500 });
}
}
