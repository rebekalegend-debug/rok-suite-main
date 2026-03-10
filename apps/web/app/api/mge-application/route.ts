import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export const dynamic = "force-dynamic"
export async function POST(req: Request) {
const pauth = req.headers.get("pauthorization")
const bauth = req.headers.get("bauthorization")

if (pauth && bauth) {

  const { start, end } = getDateRange()
const pauth = req.headers.get("pauthorization")
const bauth = req.headers.get("bauthorization")

if (!pauth || !bauth) {
  return Response.json({ error: "Missing Lilith tokens" }, { status: 401 })
}

const lilith = await fetch(
  `https://plat-rok-gametools-global-api.lilithgames.com/api/kindomMember?server_id=2554&start=${start}&end=${end}`,
  {
    headers: {
      pauthorization: pauth,
      bauthorization: bauth,
      lang: "en_US"
    }
  }
)

  const data = await lilith.json()

  const members = (data?.data || []).map((p:any)=>[
    p.uid,
    p.nickname
  ])
console.log("Members fetched from Lilith:", members.length)
 
  const auth = new google.auth.GoogleAuth({
    credentials:{
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
    },
    scopes:["https://www.googleapis.com/auth/spreadsheets"]
  })

  const sheets = google.sheets({ version:"v4", auth })

await sheets.spreadsheets.values.clear({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: "MGE Apply Members!A2:B"
})

await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: "MGE Apply Members!A2",
  valueInputOption: "RAW",
  requestBody: {
    values: members
  }
})
  return Response.json({ success:true, count: members.length })
}
  const formData = await req.formData();

  // files
  const commanderFile = formData.get("commander") as File | null;
  const gearFile = formData.get("equipment") as File | null;

  // text fields
  const id = formData.get("id") as string;
  const commander = formData.get("commander") as string;
  const rank = formData.get("desiredRank") as string;
  const kvkSpending = formData.get("kvkSpending") as string;
  const purpose = formData.get("purpose") as string;
  const troopType = formData.get("troopType") as string;
  const pair = formData.get("pair") as string;
  const comment = formData.get("comment") as string;
  const skills = formData.get("skills") as string;

  async function uploadFile(file: File | null) {

    if (!file) return "";

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("mge-screenshots")
      .upload(fileName, buffer, {
        contentType: file.type
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("mge-screenshots")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  const commanderUrl = await uploadFile(commanderFile);
  const gearUrl = await uploadFile(gearFile);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "MGE Apply!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        new Date().toISOString(), // Timestamp
        id,
        commander,
        gearUrl,
        rank,
        kvkSpending,
        purpose,
        troopType,
        pair,
        comment,
        skills
      ]]
    }
  });

return Response.json({ success: true });
}
 

function getDateRange() {

  const today = new Date()

  const end = new Date()
  end.setDate(today.getDate() - 1)   // yesterday

  const start = new Date()
  start.setDate(today.getDate() - 3) // 3 days before yesterday

  const format = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2,"0")
    const day = String(d.getDate()).padStart(2,"0")
    return `${y}-${m}-${day}`
  }

  return {
    start: format(start),
    end: format(end)
  }

}
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
    range:"MGE Apply Members!A2:B"
  })

  const rows = res.data.values || []

  const members = rows.map((r:any)=>({
    id: r[0],
    name: r[1]
  }))

  return Response.json(members)
}
