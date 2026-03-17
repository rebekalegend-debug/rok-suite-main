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

  const rows = res.data.values || [];

  // 🔥 FIXED: use rowIndex from frontend (NOT findIndex)
  const realIndex = body.rowIndex ? body.rowIndex - 2 : -1;

  const newRow = [
    body.name || "",
     body.id || body.governorId || "",
    body.power || "",
    body.violation || "",
    body.handled || "",
    body.notes || ""
  ];

  // ❌ DELETE (SAFE — no shifting bugs)
  if (body.delete) {
    if (realIndex >= 0) {
      rows[realIndex] = ["", "", "", "", "", ""]; // clear row
    }
  }

  // ✏️ UPDATE
  else if (realIndex >= 0) {
    rows[realIndex] = newRow;
  }

  // ➕ ADD NEW
  else {
    rows.push(newRow);
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
