import { google } from "googleapis"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  const { rows } = await req.json()

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n"),
    },
    scopes:["https://www.googleapis.com/auth/spreadsheets"]
  })

  const sheets = google.sheets({version:"v4",auth})

  const spreadsheetId = process.env.GOOGLE_SHEET_ID!

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range:"List!A2:M"
  })

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range:"List!A2",
    valueInputOption:"RAW",
    requestBody:{
      values:rows
    }
  })

  return Response.json({success:true})

}
