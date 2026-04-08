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

    // Read existing sheet
    const sheet = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "MGE Apply Members!A2:B"   // ✅ 20GH tab
    })

    const rows = sheet.data.values || []

    const idMap = new Map<string, number>()
    rows.forEach((r, i) => {
      const id = String(r[0])
      idMap.set(id, i + 2)
    })

    const updates:any[] = []
    const inserts:any[] = []

    for (const m of members) {
      const id = String(m[0])
      const name = m[1]

      if (idMap.has(id)) {
        const row = idMap.get(id)!
        updates.push({
          range:`MGE Apply Members!A${row}:B${row}`,   // ✅ 20GH tab
          values:[[id,name]]
        })
      } else {
        inserts.push([id,name])
      }
    }

    if(updates.length > 0){
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody:{
          valueInputOption:"RAW",
          data:updates
        }
      })
    }

    if(inserts.length > 0){
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range:"MGE Apply Members!A:B",   // ✅ 20GH tab
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
const ghFile = formData.get("ghImage") as File | null
const currentGH = formData.get("currentGH") as string
 const parsedGH = Number(currentGH)

if (!currentGH || isNaN(parsedGH)) {
  console.warn("Invalid GH value:", currentGH)
}
  
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

  async function uploadFile(file: File | null, userId: string, folder: string) {
  if (!file) return ""

  const buffer = Buffer.from(await file.arrayBuffer())
const allowed = ["png","jpg","jpeg","webp"]
const fileExt = allowed.includes(file.name.split('.').pop()?.toLowerCase() || "")
  ? file.name.split('.').pop()?.toLowerCase()
  : "png"

  const filePath = `${folder}/20gh_${userId}_${Date.now()}.${fileExt}`

  const { error } = await supabase.storage
    .from("mge-screenshots")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true
    })

  if (error) throw error

  const { data } = supabase.storage
    .from("mge-screenshots")
    .getPublicUrl(filePath)

  return `${data.publicUrl}?t=${Date.now()}`
}
 const gearUrl = await uploadFile(gearFile, id, "equipment")
const ghUrl = await uploadFile(ghFile, id, "gh") // 🔥 NEW

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

  // Read header row
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "20GH Apply!1:1"   // ✅ 20GH tab
  })

  const headers = headerRes.data.values?.[0] || []
 const col = (name: string) => {
  const index = headers.indexOf(name)
  if (index === -1) {
    throw new Error(`Column "${name}" not found in sheet`)
  }
  return index
}

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
  row[col("Current GH")] = isNaN(parsedGH) ? "" : parsedGH
  row[col("GH IMG")] = ghUrl
  row[col("Skills")] = skills
  row[col("Equipment")] = gearUrl
  row[col("Commander Purpose")] = purpose
  row[col("Desired Rank")] = rank
  row[col("KvK Spending")] = kvkSpending
  row[col("Main Troop Type")] = troopType
  row[col("Commander Pair")] = pair
  row[col("Comment")] = comment

  // Check if player already applied
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "20GH Apply!A2:Z"   // ✅ 20GH tab
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

  if(existingRow !== -1){
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range:`20GH Apply!A${existingRow}`,   // ✅ 20GH tab
      valueInputOption:"USER_ENTERED",
      requestBody:{ values:[row] }
    })
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range:"20GH Apply!A1",   // ✅ 20GH tab
      valueInputOption:"USER_ENTERED",
      requestBody:{ values:[row] }
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
    range:"MGE Apply Members!A2:B"   // ✅ 20GH tab
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

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range:"20GH Apply!1:1"   // ✅ 20GH tab
  })

  const headers = headerRes.data.values?.[0] || []
  const idIndex = headers.indexOf("ID")

  if(idIndex === -1){
    return Response.json({ error:"ID column not found" },{status:500})
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range:"20GH Apply!A2:Z"   // ✅ 20GH tab
  })

  const rows = res.data.values || []

  const ids = rows
    .filter(r => r[idIndex])
    .map(r => ({ id:String(r[idIndex]) }))

  return Response.json(ids)
}
