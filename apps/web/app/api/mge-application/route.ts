import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export const dynamic = "force-dynamic"



export async function POST(req: Request) {

  const psheetAuth = req.headers.get("pauthorization")
  const bsheetAuth = req.headers.get("bauthorization")

  // ADMIN UPDATE
  if (psheetAuth && bsheetAuth) {

    

    const lilith = await fetch(
      `https://plat-rok-gametools-global-api.lilithgames.com/api/kindomMember?server_id=3237&page=1&limit=1000`,
      {
        headers:{
          pauthorization: psheetAuth,
          bauthorization: bsheetAuth,
          lang:"en_US"
        }
      }
    )

    const data = await lilith.json()
console.log("LILITH RESPONSE LENGTH:", data?.data?.length)
console.log("FIRST MEMBER:", data?.data?.[0])
const members = (data?.data || []).map((p:any)=>[
  p.id,
  p.name
])
console.log("Lilith raw data length:", data?.data?.length)
console.log("Lilith first row:", data?.data?.[0])

console.log("Members array length:", members.length)
console.log("First 5 members:", members.slice(0,5))
   const sheetAuth = new google.auth.GoogleAuth({
  credentials:{
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
  },
  scopes:["https://www.googleapis.com/auth/spreadsheets"]
})

const sheets = google.sheets({
  version:"v4",
  auth: sheetAuth
})
// 1️⃣ read existing sheet
const sheet = await sheets.spreadsheets.values.get({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: "MGE Apply Members!A2:B"
})

const rows = sheet.data.values || []

// 2️⃣ map existing IDs
const idMap = new Map<string, number>()

rows.forEach((r, i) => {
  const id = String(r[0])
  idMap.set(id, i + 2)
})

// 3️⃣ prepare updates / inserts
const updates:any[] = []
const inserts:any[] = []

for (const m of members) {

  const id = String(m[0])
  const name = m[1]

  if (idMap.has(id)) {

    const row = idMap.get(id)!

    updates.push({
      range:`MGE Apply Members!A${row}:B${row}`,
      values:[[id,name]]
    })

  } else {

    inserts.push([id,name])

  }

}

// 4️⃣ update existing rows
if(updates.length > 0){

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    requestBody:{
      valueInputOption:"RAW",
      data:updates
    }
  })

}

// 5️⃣ insert new rows
if(inserts.length > 0){

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range:"MGE Apply Members!A:B",
    valueInputOption:"RAW",
    requestBody:{ values: inserts }
  })

}

return Response.json({
  success:true,
  updated:updates.length,
  inserted:inserts.length
})

} // ← CLOSE ADMIN BLOCK



  // USER FORM SUBMISSION
  const formData = await req.formData()

 const gearFile = formData.get("equipment") as File | null

 const id = formData.get("id") as string
const name = formData.get("name") as string
const commander = formData.get("commander") as string
  const rank = formData.get("desiredRank") as string
  const kvkSpending = formData.get("kvkSpending") as string
  const purpose = formData.get("purpose") as string
  const troopType = formData.get("troopType") as string
  const pair = formData.get("pair") as string
  const comment = formData.get("comment") as string
  const skills = formData.get("skills") as string

  async function uploadFile(file: File | null) {
    if (!file) return ""

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("mge-screenshots")
      .upload(fileName, buffer, { contentType: file.type })

    if (error) throw error

    const { data } = supabase.storage
      .from("mge-screenshots")
      .getPublicUrl(fileName)

    return data.publicUrl
  }

 
  const gearUrl = await uploadFile(gearFile)

 const sheetAuth = new google.auth.GoogleAuth({
  credentials:{
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
  },
  scopes:["https://www.googleapis.com/auth/spreadsheets"]
})

const sheets = google.sheets({
  version:"v4",
  auth: sheetAuth
})

 // 1️⃣ Read header row
const headerRes = await sheets.spreadsheets.values.get({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: "MGE Apply!1:1"
})

const headers = headerRes.data.values?.[0] || []

// 2️⃣ Map header -> column index
const col = (name:string) => headers.indexOf(name)

// 3️⃣ Prepare row array
const row = new Array(headers.length).fill("")

row[col("Time UTC")] = new Date().toLocaleString("en-US",{
  month:"short",
  day:"numeric",
  hour:"2-digit",
  minute:"2-digit",
  hour12:false,
  timeZone:"UTC"
}).replace(",", " -")

row[col("ID")] = id
row[col("Name")] = name
row[col("Commander")] = commander
row[col("Skills")] = skills
row[col("Equipment")] = gearUrl
row[col("Commander Purpose")] = purpose
row[col("Desired Rank")] = rank
row[col("KvK Spending")] = kvkSpending
row[col("Main Troop Type")] = troopType
row[col("Commander Pair")] = pair
row[col("Comment")] = comment

// 4️⃣ Append row
// 4️⃣ Check if player already applied
const existing = await sheets.spreadsheets.values.get({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: "MGE Apply!A2:Z"
})

const rows = existing.data.values || []

const idIndex = headers.indexOf("ID")

let existingRow = -1

for(let i=0;i<rows.length;i++){
  if(rows[i][idIndex] === id){
    existingRow = i + 2
    break
  }
}

// 5️⃣ Update or insert
if(existingRow !== -1){

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range:`MGE Apply!A${existingRow}`,
    valueInputOption:"USER_ENTERED",
    requestBody:{
      values:[row]
    }
  })

}else{

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range:"MGE Apply!A1",
    valueInputOption:"USER_ENTERED",
    requestBody:{
      values:[row]
    }
  })

}

  return Response.json({ success:true })
}


export async function GET() {

  const sheetAuth = new google.auth.GoogleAuth({
    credentials:{
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
    },
    scopes:["https://www.googleapis.com/auth/spreadsheets.readonly"]
  })

  const sheets = google.sheets({
    version:"v4",
    auth: sheetAuth
  })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range:"MGE Apply Members!A2:B"
  })

  const rows = res.data.values || []

  const members = rows.map((r:any)=>({
    id: r[0],
    name: r[1]
  }))

  return Response.json(members)
}
export async function PUT() {

  const sheetAuth = new google.auth.GoogleAuth({
    credentials:{
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
    },
    scopes:["https://www.googleapis.com/auth/spreadsheets.readonly"]
  })

  const sheets = google.sheets({
    version:"v4",
    auth: sheetAuth
  })

  // 1️⃣ Read headers
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range:"MGE Apply!1:1"
  })

  const headers = headerRes.data.values?.[0] || []

  // 2️⃣ Find ID column index
  const idIndex = headers.indexOf("ID")

  if(idIndex === -1){
    return Response.json({ error:"ID column not found" },{status:500})
  }

  // 3️⃣ Read all rows
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range:"MGE Apply!A2:Z"
  })

  const rows = res.data.values || []

  // 4️⃣ Extract IDs dynamically
  const ids = rows
    .filter(r => r[idIndex])
    .map(r => ({ id:String(r[idIndex]) }))

  return Response.json(ids)
}
