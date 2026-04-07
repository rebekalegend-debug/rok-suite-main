import { google } from "googleapis"
const base = "https://rok-quinn.vercel.app"
function latestLilithDay(){
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0,10)
}
async function sendDiscordAlert(message: string, success = false) {
  await fetch("https://discord.com/api/webhooks/1490842853784682497/rk1fpHVh_B5nS1ecgF0JKCirG8m5jAduRH-6oTrll8nqEiLbFU0Q1EBiISe2J2m32Fjg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      embeds: [
        {
          title: success ? "✅ Migration Scan Done" : "🚨 Migration Scan Failed",
          description: message,
          color: success ? 65280 : 16711680
        }
      ]
    })
  })
}
let pauth = ""
let bauth = ""

async function refreshTokens(){
  const res = await fetch(`${base}/api/tokens`)
  const data = await res.json()

  pauth = data.pauth
  bauth = data.bauth

  console.log("Tokens refreshed")
}

export async function GET(){
let alertSent = false
 
  const latest = latestLilithDay()
await refreshTokens()
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
let success = false
let refreshCount = 0
for(let i = 0; i < 10; i++){

const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 15000) // 15s

let r

try {
  r = await fetch(url,{
    headers:{
     pauthorization: pauth,
bauthorization: bauth,
      lang:"en_US"
    },
    signal: controller.signal
  })
} catch (err) {
  console.error("Fetch failed or timed out")

  if(!alertSent){
    alertSent = true
    await sendDiscordAlert(`🌐 API TIMEOUT\nThe Lilith API is not responding.`)
  }

  break
} finally {
  clearTimeout(timeout)
}

  if(!r) break
const text = await r.text()
if(text.includes("Unauthorized") || text.includes("401")){
  if(refreshCount < 2){
    console.error("Auth error → refreshing tokens")

    await refreshTokens()
    refreshCount++

    i--
    continue
  } else {
    console.error("Auth failed even after refresh")

    if(!alertSent){
      alertSent = true
      await sendDiscordAlert("🔐 AUTH ERROR - token refresh failed")
    }

    break
  }
}
}
  try {
    data = JSON.parse(text)
  } catch {
    console.error("Lilith HTML:", text.slice(0,100))
    data = null
  }

  if(data?.data?.length > 0){
    console.log("Snapshot ready:", kingdom, data.data.length)
    success = true
    break
  }

  console.log("Retry:", kingdom, day)

  await new Promise(r => setTimeout(r,60000))
}

if(!success && !alertSent){
  alertSent = true

  await sendDiscordAlert(
    `🚨 Migration Scan FAILED
Date: ${day}
Kingdom: ${kingdom}
Likely cause: invalid tokens in Vercel environment variables.`
  )
}
if(!success){
  continue
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
await sendDiscordAlert(`Done up to ${latest}`, true)
  return Response.json({ success:true })
}
