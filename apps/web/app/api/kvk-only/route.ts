import { google } from "googleapis"

export const dynamic = "force-dynamic"

export async function GET() {

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  })

  const sheets = google.sheets({ version: "v4", auth })
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!

  try {

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "KvK C.!A1:C" // 👈 ID | KvK | Name
    })

    const rows = res.data.values || []
    rows.shift() // remove header

    const data = rows.map(r => ({
      id: String(r[0] || "").replace(/'/g, "").trim(),
      kvkContribution: Number(r[1]) || 0,
      name: r[2] || "Unknown"
    }))

    return Response.json({ success: true, data })

  } catch (err) {
    console.error(err)
    return Response.json({ success: false }, { status: 500 })
  }
}
