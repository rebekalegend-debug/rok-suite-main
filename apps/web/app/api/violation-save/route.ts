import { google } from "googleapis";

export async function POST(req: Request) {
  const body = await req.json();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  const range = "Violation!A2:F";

  // 📥 read existing rows
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

 const rows = res.data.values || []

// find row by ID (column B = index 1)
const findIndex = rows.findIndex(r => String(r[1]) === String(body.id))

const newRow = [
  body.name || "",
  body.id || "",
  body.power || "",
  body.violation || "",
  body.handled || "",
  body.notes || ""
]

// ❌ DELETE
if (body.delete) {
  if (findIndex !== -1) {
    rows.splice(findIndex, 1) // ✅ REMOVE ROW CLEAN
  }
}

// ✏️ UPDATE
else if (findIndex !== -1) {
  rows[findIndex] = newRow
}

// ➕ ADD
else {
  rows.push(newRow)
}

  // 💾 WRITE BACK
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Violation!A2",
    valueInputOption: "RAW",
    requestBody: {
      values: rows,
    },
  });

  return Response.json({ success: true });
}
