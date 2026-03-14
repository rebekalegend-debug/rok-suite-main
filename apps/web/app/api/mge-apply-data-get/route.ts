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

    // --- MGE Apply sheet ---
    const applyRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "MGE Apply!A1:Z"
    })

    // --- KvK Contribution sheet ---
    const kvkRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "KvK C.!A1:B"
    })

    // --- Saved list sheet ---
const listRes = await sheets.spreadsheets.values.get({
  spreadsheetId,
  range: "List!A1:Z"
})

    
    const applyRows = applyRes.data.values || []
    const kvkRows = kvkRes.data.values || []
const listRows = listRes.data.values || []
    const headers = applyRows.shift() || []

    const kvkMap: Record<string, number> = {}

    kvkRows.slice(1).forEach(r => {
      const id = r[0]
      const kvk = Number(r[1]) || 0
      if (id) kvkMap[id] = kvk
    })
const listMap: Record<string, { rg: string[], eq: string }> = {}

listRows.slice(1).forEach(r => {

  const id = String(r[0] || "")   // column A (ID)
  const rg = r[7] || ""           // column H (R&G)
  const eq = r[10] || ""          // column K (EQ)

  if (id) {
    listMap[id] = {
      rg: rg ? rg.split(", ") : [],
      eq
    }
  }

})
    const data = applyRows.map(row => {

      const record: any = {}

      headers.forEach((h, i) => {
        record[h] = row[i]
      })
const id = record["ID"]
const list = listMap[String(id)] || { rg: [], eq: "" }

return {
  id,
  name: record["Name"],
  desiredRank: record["Desired Rank"],
  commander: record["Commander"],
  skills: record["Skills"],
  main: record["Main Troop Type"],
  spend: record["KvK Spending"],
  kvkContribution: kvkMap[id] || 0,
  rg: list.rg,
  eq: list.eq
}

    })

    return Response.json({ success: true, data })

  } catch (err) {

    console.error(err)

    return Response.json({
      success: false,
      error: "Failed to fetch MGE apply data"
    }, { status: 500 })

  }

}
