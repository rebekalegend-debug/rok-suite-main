import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  const formData = await req.formData();

  const commanderFile = formData.get("commander") as File | null;
  const gearFile = formData.get("gear") as File | null;

  async function uploadFile(file: File | null) {

    if (!file) throw new Error("File missing");

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
      values: [[new Date().toISOString(), commanderUrl, gearUrl]]
    }
  });

  return Response.json({ success: true });
}
