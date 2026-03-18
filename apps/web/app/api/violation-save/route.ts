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
    const cleaned = String(v ?? "")
      .replace(/^'+/, "")
      .replace(/[, ]/g, "")
      .replace(/[^0-9]/g, "");

    return cleaned || "";
  };

  // 📥 read existing rows
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];

 const idToFind = toCleanStringNumber(body.id);

const index = rows.findIndex(r => {
  const rowId = String(r[1] ?? "").replace(/^'+/, "").replace(/[^0-9]/g, "");
  return rowId === idToFind;
});

  // ✅ CLEAN + NORMALIZE ROW
  const newRow = [
    stripQuote(body.name),

    toCleanStringNumber(body.id),     // ✅ ID (NO ')
    toCleanStringNumber(body.power),  // ✅ POWER (NO ')

    stripQuote(body.violation),
    stripQuote(body.handled),
    stripQuote(body.notes),
  ];

 // DELETE
if (body.delete) {
  const newRows = rows.filter(r => {
    const rowId = String(r[1] ?? "")
      .replace(/^'+/, "")
      .replace(/[^0-9]/g, "");

    return rowId !== idToFind;
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Violation!A2",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: newRows,
    },
  });

  return Response.json({ success: true });
}

// UPDATE / ADD
else {
  if (index >= 0) {
    rows[index] = newRow; // ✅ update
  } else {
    rows.push(newRow);    // ✅ add
  }
}
  

  // ✍️ WRITE BACK
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Violation!A2",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows,
    },
  });

  return Response.json({ success: true });
}
