import { google } from "googleapis";

export async function GET(req:Request){

const { searchParams } = new URL(req.url)

const kingdom = searchParams.get("kingdom")

if(!kingdom){
return Response.json({error:"Missing kingdom"}, {status:400})
}

const auth = new google.auth.GoogleAuth({
credentials:{
client_email:process.env.GOOGLE_CLIENT_EMAIL,
private_key:process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
},
scopes:["https://www.googleapis.com/auth/spreadsheets.readonly"]
})

const sheets = google.sheets({version:"v4",auth})

const spreadsheetId = process.env.GOOGLE_SHEET_ID!

const range = `'${kingdom}'!A2:G`

const res = await sheets.spreadsheets.values.get({
spreadsheetId,
range
})

const rows = res.data.values || []

const data = rows.map(r => ({
 id: r[0],
 name: r[1],
 power: Number(r[2] || 0),
 prevNames: r[3] ? r[3].split(",") : [],
 migratedOut: r[4] || null,
 migratedIn: r[5] || null,
 lastSeen: r[6] || null
}))

return Response.json(data)

}
