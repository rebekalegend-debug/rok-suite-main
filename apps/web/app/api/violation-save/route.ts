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

  // 🔥 CLEAN HELPERS
  const stripQuote = (v: any) =>
    String(v ?? "").replace(/^'+/, "").trim();

  const toCleanStringNumber = (v: any) => {
    return String(v ?? "")
      .replace(/^'+/, "")
      .replace(/[, ]/g, "")
      .replace(/[^0-9]/g, "");
  };

  const idToFind = toCleanStringNumber(body.id);

  // 📥 read existing rows
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];

  // 🔍 find row by ID
  const index = rows.findIndex(r => {
    const rowId = String(r[1] ?? "")
      .replace(/^'+/, "")
      .replace(/[^0-9]/g, "");
    return rowId === idToFind;
  });

  // ✅ CLEAN ROW
  const newRow = [
    stripQuote(body.name),
    idToFind,
    toCleanStringNumber(body.power),
    stripQuote(body.violation),
    stripQuote(body.handled),
    stripQuote(body.notes),
  ];

  // =========================
  // ❌ DELETE (SAFE)
  // =========================
  if (body.delete) {
    if (index >= 0) {
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `Violation!A${index + 2}:F${index + 2}`,
      });
    }

    return Response.json({ success: true });
  }

  // =========================
  // ✏️ UPDATE (SAFE)
  // =========================
  if (index >= 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Violation!A${index + 2}:F${index + 2}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [newRow],
      },
    });

    return Response.json({ success: true });
  }

  // =========================
  // ➕ ADD (SAFE)
  // =========================
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Violation!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [newRow],
    },
  });

  return Response.json({ success: true });
}
