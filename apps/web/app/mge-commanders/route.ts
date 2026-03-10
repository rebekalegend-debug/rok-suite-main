import { google } from "googleapis";

export async function GET() {

  const auth = new google.auth.GoogleAuth({
    credentials:{
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
    },
    scopes:["https://www.googleapis.com/auth/spreadsheets.readonly"]
  })

  const sheets = google.sheets({ version:"v4", auth })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "MGE commanders!A2:A"
  })

  const commanders = (res.data.values || []).map((r:any)=>r[0])

  return Response.json(commanders)
}
