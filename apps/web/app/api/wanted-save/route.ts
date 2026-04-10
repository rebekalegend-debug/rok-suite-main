
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
    zero // 'yes' | 'left' | ''
  } = body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // ✅ 1. READ EXISTING DATA
    const read = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: 'Wanted!A:G',
    });

    const rows = read.data.values || [];

    // ✅ 2. FIND PLAYER
   const rowIndex = rows.findIndex(
  (r) => r?.[0] && String(r[0]) === String(governorId)
);

    // ✅ 3. IF EXISTS → UPDATE
    if (rowIndex !== -1) {
    const sheetRow = rowIndex + 2;

// ✅ map UI value → sheet value
const sheetValue =
  zero === 'Yes' ? 'Yes' :
  zero === 'left' ? 'left' :
  'no';

// ✅ update BOTH Zero + Zeroed columns
await sheets.spreadsheets.values.update({
  spreadsheetId: process.env.GOOGLE_SHEET_ID!,
  range: `Wanted!F${sheetRow}:G${sheetRow}`,
  valueInputOption: 'USER_ENTERED',
  requestBody: {
    values: [[sheetValue, sheetValue]]
  }
});

      return NextResponse.json({ success: true, type: 'updated' });
    }

const sheetValue =
  zero === 'Yes' ? 'Yes' :
  zero === 'left' ? 'left' :
  'no';

await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.GOOGLE_SHEET_ID!,
  range: 'Wanted!A:G',
  valueInputOption: 'USER_ENTERED',
  requestBody: {
    values: [[
      governorId,
      name,
      power,
      alliance,
      reason,
      sheetValue,
      sheetValue
    ]]
  }
});

    return NextResponse.json({ success: true, type: 'created' });

  } catch (err: any) {
    console.error("SAVE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
