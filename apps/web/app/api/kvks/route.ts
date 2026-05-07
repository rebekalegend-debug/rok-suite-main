import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    })

    const sheets = google.sheets({
      version: "v4",
      auth,
    })

    const spreadsheetId = process.env.GOOGLE_SHEET_ID!

    // Read Honor sheet
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Honor!A1:Z1000",
    })

    const rows = res.data.values || []

    // first row = kingdom headers
    const headers = rows[0] || []

    const result: Record<string, string[]> = {}

    headers.forEach((header, colIndex) => {
      if (!header) return

      result[header] = []

      for (let row = 1; row < rows.length; row++) {
        const value = rows[row]?.[colIndex]

        if (value) {
          result[header].push(value)
        }
      }
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "failed" },
      { status: 500 }
    )
  }
}
