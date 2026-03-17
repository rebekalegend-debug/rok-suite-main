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

  let rows = res.data.values || [];

  // 🧠 normalize ID (IMPORTANT)
  const id = String(body.id);

  // 🔍 find existing row safely
  const rowIndex = rows.findIndex(r => String(r[1]) === id);

  // 🧠 normalize violation
  const violation =
    Array.isArray(body.violation)
      ? body.violation.join(",")
      : body.violation || "";

  const newRow = [
    body.name || "",
    id,
    body.power || "",
    violation,
    body.handled || "",
    body.notes || ""
  ];

  // ❌ DELETE
  if (body.delete) {
    if (rowIndex !== -1) {
      rows.splice(rowIndex, 1);
    }
  }

  // ✏️ UPDATE
  else if (rowIndex !== -1) {
    rows[rowIndex] = newRow;
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
