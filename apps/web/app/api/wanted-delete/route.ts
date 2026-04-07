import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  const { governorId } = await req.json();

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Get all rows
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: 'Wanted!A:F',
    });

    const rows = res.data.values || [];

    // 2. Find row index
    const index = rows.findIndex(row => row[0] == governorId);

    if (index === -1) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // ⚠️ +1 because sheet is 1-based and includes header
    const rowNumber = index + 1;

    // 3. Delete row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // ⚠️ we fix this below
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
