import { google } from "googleapis"

export async function POST(req:Request){

const { members, date } = await req.json()

const auth = new google.auth.GoogleAuth({
credentials:{
client_email:process.env.GOOGLE_CLIENT_EMAIL,
private_key:process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
},
scopes:["https://www.googleapis.com/auth/spreadsheets"]
})

const sheets = google.sheets({version:"v4",auth})

const spreadsheetId = process.env.GOOGLE_SHEET_ID!

const sheet = await sheets.spreadsheets.values.get({
spreadsheetId,
range:"2554!A2:F"
})

const rows = sheet.data.values || []

const map:any = {}

rows.forEach((r,i)=>{
map[r[0]] = {row:i+2,data:r}
})

const apiIds = new Set()

for(const m of members){

const id = String(m.id)
const name = m.name

apiIds.add(id)

if(!map[id]){

rows.push([
id,
name,
"",
"",
date,
date
])

continue
}

const row = map[id].data

const oldName = row[1]
const prev = row[2] || ""
const migratedOut = row[3]
const migratedIn = row[4]

if(oldName !== name){

row[2] = prev ? prev + "," + oldName : oldName
row[1] = name

}

row[5] = date

if(migratedOut){

row[3] = ""
row[4] = date

}

}

rows.forEach(r=>{

const id = r[0]
const lastSeen = r[5]
const migratedOut = r[3]

if(apiIds.has(id)) return

if(migratedOut) return

const diff =
(new Date(date).getTime() -
new Date(lastSeen).getTime()) / 86400000

if(diff >= 2){

r[3] = date
r[4] = ""

}

})

await sheets.spreadsheets.values.update({

spreadsheetId,
range:"2554!A2",
valueInputOption:"RAW",
requestBody:{
values:rows
}

})

return Response.json({success:true})

}
