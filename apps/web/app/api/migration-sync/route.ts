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
range:"2500!A2:G"
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
const power = m.power
  
apiIds.add(id)

if(!map[id]){

rows.push([
id,
name,
  power,
"",
"",
date,
date
])

continue
}

const row = map[id].data
row[2] = power
const oldName = row[1]
const prev = row[3] || ""
const migratedOut = row[4]
const migratedIn = row[5]

if(oldName !== name){

row[3] = prev ? prev + "," + oldName : oldName
row[1] = name

}

row[6] = date

if(migratedOut){

row[4] = ""
row[5] = date

}

}

rows.forEach(r=>{

const id = r[0]
const lastSeen = r[6]
const migratedOut = r[4]

if(apiIds.has(id)) return

if(migratedOut) return

const diff =
(new Date(date).getTime() -
new Date(lastSeen).getTime()) / 86400000

if(diff >= 2){

r[4] = date
r[5] = ""

}

})

await sheets.spreadsheets.values.update({

spreadsheetId,
range:"2500!A2",
valueInputOption:"RAW",
requestBody:{
values:rows
}

})

return Response.json({success:true})

}
