import { google } from "googleapis";

export async function GET() {

const auth = new google.auth.GoogleAuth({
credentials:{
client_email:process.env.GOOGLE_CLIENT_EMAIL,
private_key:process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
},
scopes:["https://www.googleapis.com/auth/spreadsheets.readonly"]
})

const sheets = google.sheets({version:"v4",auth})

const spreadsheetId = process.env.GOOGLE_SHEET_ID!

const res = await sheets.spreadsheets.values.get({
spreadsheetId,
range:"'Top 3237'!A2:B"
})

const rows = res.data.values || []

const data = rows.map(r => ({
id:r[0],
name:r[1]
}))

return Response.json(data)

}
