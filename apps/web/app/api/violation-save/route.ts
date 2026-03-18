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

  // 🔥 CLEAN HELPERS (STRICT)
  const stripQuote = (v: any) =>
    String(v ?? "").replace(/^'+/, "").trim();

  const toNumber = (v: any) => {
    const cleaned = stripQuote(v)
      .replace(/[, ]/g, "")     // remove commas/spaces
      .replace(/[^0-9]/g, "");  // keep only digits

    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // 📥 read existing rows
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];

  const index = body.rowIndex ? body.rowIndex - 2 : -1;

  // ✅ CLEAN + NORMALIZE ROW
  const newRow = [
    stripQuote(body.name),

    toNumber(body.id),     // ✅ NO ' EVER
    toNumber(body.power),  // ✅ NO ' EVER

    stripQuote(body.violation),
    stripQuote(body.handled),
    stripQuote(body.notes),
  ];

  // DELETE
  if (body.delete) {
    if (index >= 0) rows.splice(index, 1);
  }

  // UPDATE
  else if (index >= 0) {
    rows[index] = newRow;
  }

  // ADD
  else {
    rows.push(newRow);
  }

  // ✍️ WRITE BACK
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
