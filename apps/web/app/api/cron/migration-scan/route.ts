import { google } from "googleapis"

function latestLilithDay(){
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0,10)
}

export async function GET(){

  const base = "https://rok-quinn.vercel.app"
  const latest = latestLilithDay()

  console.log("Latest Lilith day:", latest)

  // 🔑 GOOGLE AUTH
  const auth = new google.auth.GoogleAuth({
    credentials:{
      client_email:process.env.GOOGLE_CLIENT_EMAIL,
      private_key:process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
    },
    scopes:["https://www.googleapis.com/auth/spreadsheets"]
  })

  const sheets = google.sheets({version:"v4",auth})
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!

  const kingdoms = [2500,2554,3237]

  // 🔥 GET LAST PROCESSED FROM SHEETS
  let lastProcessed:string | null = null

  for(const kd of kingdoms){

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:`${kd}!G2:G`
    })

    const values = res.data.values || []

    for(const row of values){
      const date = row[0]
      if(!date) continue

      if(!lastProcessed || date > lastProcessed){
        lastProcessed = date
      }
    }
  }

  console.log("Last processed from sheets:", lastProcessed)

  if(!lastProcessed){
    const d = new Date(latest)
    d.setUTCDate(d.getUTCDate() - 1)
    lastProcessed = d.toISOString().slice(0,10)
  }

  // 🔁 LOOP DAYS
  let current = new Date(lastProcessed)
  current.setUTCDate(current.getUTCDate() + 1)

  while(current.toISOString().slice(0,10) <= latest){

    const day = current.toISOString().slice(0,10)

    console.log("Processing day:", day)

    for(const kingdom of kingdoms){

      const url =
      `https://plat-rok-gametools-global-api.lilithgames.com/api/kindomMember?start=${day}&end=${day}&search=&server_id=${kingdom}`

      let data:any = null

      for(let i = 0; i < 10; i++){

        const r = await fetch(url,{
          headers:{
            pauthorization:process.env.PAUTH!,
            bauthorization:process.env.BAUTH!,
            lang:"en_US"
          }
        })

        const text = await r.text()

        try {
          data = JSON.parse(text)
        } catch {
          console.error("Lilith HTML:", text.slice(0,100))
          data = null
        }

        if(data?.data?.length > 0){
          console.log("Snapshot ready:", kingdom, data.data.length)
          break
        }

        console.log("Retry:", kingdom, day)
        await new Promise(r => setTimeout(r,60000))
      }

      await fetch(`${base}/api/migration-sync`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          members:data?.data || [],
          date:day,
          kingdom
        })
      })

    }

    current.setUTCDate(current.getUTCDate() + 1)
  }

  console.log("Done up to:", latest)

  return Response.json({ success:true })
}
