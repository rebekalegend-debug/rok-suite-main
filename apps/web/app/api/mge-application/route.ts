import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

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

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const members = searchParams.get("members")

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n"),
    },
    scopes:["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  const sheets = google.sheets({ version:"v4", auth });

  // MEMBERS SEARCH
  if (members) {

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "MGE Apply Members!A2:B"
    })

    const rows = res.data.values || []

    const list = rows.map(r => ({
      id: r[0],
      name: r[1]
    }))

    return Response.json(list)
  }

  // COMMANDERS DROPDOWN
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "MGE Commanders!A2:A"
  });

  const rows = res.data.values || [];

  const commanders = rows
    .map(r => r[0])
    .filter(Boolean);

  return Response.json(commanders);
}
