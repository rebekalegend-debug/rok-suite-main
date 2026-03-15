'use client'

import { useState } from "react"

function addDay(date:string){
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate()+1)
  return d.toISOString().slice(0,10)
}

function yesterdayUTC(){
  const d = new Date()
  d.setUTCDate(d.getUTCDate()-1)
  return d.toISOString().slice(0,10)
}

export default function MigrationScanner(){

const [pauth,setPauth] = useState("")
const [bauth,setBauth] = useState("")
const [start,setStart] = useState("")
const [running,setRunning] = useState(false)
const [log,setLog] = useState<string[]>([])

function addLog(t:string){
  setLog(prev=>[...prev,t])
}

async function run(){

if(!start || !pauth || !bauth) return

setRunning(true)

let s = start
let e = addDay(s)
const yesterday = yesterdayUTC()

addLog("Start scan")
addLog(`Stop date: ${yesterday}`)

while(e <= yesterday){

addLog(`Processing ${s}`)

const url =
`https://plat-rok-gametools-global-api.lilithgames.com/api/kindomMember?start=${s}&end=${e}&search=&server_id=3237`

const r = await fetch(url,{
headers:{
pauthorization:pauth,
bauthorization:bauth,
lang:"en_US"
}
})

const data = await r.json()

const members = data?.data || []

addLog(`API members: ${members.length}`)

await fetch("/api/migration-sync",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
members,
date:s
})
})

s = e
e = addDay(e)

await new Promise(r=>setTimeout(r,500))
}

addLog("Scan finished")

setRunning(false)

}

return (

<div style={{
maxWidth:700,
margin:"40px auto",
fontFamily:"sans-serif"
}}>

<h2>Migration Scanner</h2>

<div style={{display:"grid",gap:10}}>

<input
placeholder="PAUTH token"
value={pauth}
onChange={e=>setPauth(e.target.value)}
/>

<input
placeholder="BAUTH token"
value={bauth}
onChange={e=>setBauth(e.target.value)}
/>

<input
type="date"
value={start}
onChange={e=>setStart(e.target.value)}
/>

<button
onClick={run}
disabled={running}
>
{running ? "Running..." : "Start Scan"}
</button>

</div>

<div style={{
marginTop:20,
background:"#111",
color:"#0f0",
padding:10,
height:300,
overflow:"auto",
fontSize:12
}}>

{log.map((l,i)=>(
<div key={i}>{l}</div>
))}

</div>

</div>

)

}
