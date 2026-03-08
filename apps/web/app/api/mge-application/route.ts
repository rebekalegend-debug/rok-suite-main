import { google } from "googleapis";
 import { Readable } from "stream";
export async function POST(req: Request) {

  const formData = await req.formData();

  const commanderFile = formData.get("commander") as File;
  const gearFile = formData.get("gear") as File;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/spreadsheets"
    ]
  });

  const drive = google.drive({ version:"v3", auth });

 

async function uploadFile(file: File) {

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

 const res = await drive.files.create({
  requestBody: {
    name: file.name,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!]
  },
  media: {
    mimeType: file.type,
    body: stream
  },
  supportsAllDrives: true
});

  const fileId = res.data.id!;

 await drive.permissions.create({
  fileId: fileId,
  requestBody:{
    role:"reader",
    type:"anyone"
  },
  supportsAllDrives: true
});
  return `https://drive.google.com/file/d/${fileId}/view`;
}

  const commanderUrl = await uploadFile(commanderFile);
  const gearUrl = await uploadFile(gearFile);

  const sheets = google.sheets({version:"v4",auth});

  await sheets.spreadsheets.values.append({
    spreadsheetId:process.env.GOOGLE_SHEET_ID,
    range:"MGE!A1",
    valueInputOption:"USER_ENTERED",
    requestBody:{
      values:[[new Date().toISOString(), commanderUrl, gearUrl]]
    }
  });

  return Response.json({success:true});
}
