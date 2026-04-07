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
console.log("Tokens refreshed:", {
  pauth: pauth.slice(0,20),
  bauth: bauth.slice(0,20)
})
  
}

export async function GET(){
let alertSent = false
 let lastSuccessfulDay: string | null = null
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

let data: any = null
let success = false
let refreshCount = 0
let text = "" // ✅ move outside

for(let i = 0; i < 10; i++){

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  let r: Response | null = null

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

  console.log("STATUS:", r.status)

  text = await r.text()

  console.log("RESPONSE PREVIEW:", text.slice(0,300))

  // 🚫 Detect blocking
  if(text.includes("<html") || text.includes("cloudflare")){
    console.error("🚫 BLOCKED BY CLOUDFLARE")

    if(!alertSent){
      alertSent = true
      await sendDiscordAlert("🚫 API BLOCKED (Cloudflare / Bot Protection)")
    }

    break
  }

  // 🔐 AUTH HANDLING
  if(text.includes("Unauthorized") || text.includes("401")){
    if(refreshCount < 2){
      console.error("Auth error → refreshing tokens")

      await refreshTokens()
      refreshCount++

      i--
      continue
    } else {
      console.error("Auth failed after refresh", {
        status: r.status,
        body: text.slice(0,200)
      })

      if(!alertSent){
        alertSent = true
        await sendDiscordAlert("🔐 AUTH ERROR - token refresh failed")
      }

      break
    }
  }

  // ✅ PARSE
  try {
    data = JSON.parse(text)
  } catch {
    console.error("Invalid JSON:", text.slice(0,100))
    data = null
  }

  // ✅ SUCCESS
  if(data?.data?.length > 0){
    console.log("Snapshot ready:", kingdom, data.data.length)
    success = true
    lastSuccessfulDay = day
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

console.log("Done up to:", lastSuccessfulDay || "nothing")

await sendDiscordAlert(
  `Done up to ${lastSuccessfulDay || "nothing"}`,
  true
)

return Response.json({ success: true })
}
