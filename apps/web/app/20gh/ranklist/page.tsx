'use client'
import { LogOut } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { getHeads, getPoints, kvkContributionPercent } from "@/utils/20ghRankLogic"
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core"

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"
import { AppSidebar } from '@/components/AppSidebar';
import { Suspense } from 'react';

type Player = {
  id: string
  name: string
  desiredRank: number
  commander: string
  skills: string
  main: string
  spend: string
  kvkContribution: number
  rg?: string[]
  eq?: string
  purpose?: string
  ghHave?: number 
  points?: string
}
const badge = "px-3 py-1 rounded-md text-xs font-semibold border"
function Row({ player, rank, setPlayers, totalPlayers }: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: player.id })
  const stop = (e:any) => e.stopPropagation()
const rg: string[] = player.rg || []
const [showRg,setShowRg] = useState(false)
const rgRef = useRef<any>(null)
const eqRef = useRef<any>(null)

const eq = player.eq || "N/A"
const [showEq,setShowEq] = useState(false)

  const defaultPoints = player.points || getPoints(rank, totalPlayers)
const [value,setValue] = useState(defaultPoints)
 
const [editing,setEditing] = useState(false)
  
useEffect(() => {
  setValue(getPoints(rank, totalPlayers))
}, [rank, totalPlayers])
  
  
  useEffect(() => {

  function handleClickOutside(e:any) {

    if (rgRef.current && !rgRef.current.contains(e.target)) {
      setShowRg(false)
    }

    if (eqRef.current && !eqRef.current.contains(e.target)) {
      setShowEq(false)
    }

  }

  document.addEventListener("mousedown", handleClickOutside)

  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }

}, [])
  


  
  
  const rgOptions = [
  { label: "Garrison", value:"Garrison", color: "green" },
  { label: "Rally", value:"Rally", color: "green" },
  { label: "Both", value:"Both", color: "green" },
  { label: "R4", value:"R4", color: "green" },
  { label: "R5", value:"R5", color: "green" },

  { label: "Garrison", value:"Garrison-Y", color: "yellow" },
  { label: "Rally", value:"Rally-Y", color: "yellow" },

  { label: "No", value:"No", color: "red" }
]

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

return (

<tr
  ref={setNodeRef}
  style={style}
  {...attributes}
  {...listeners}
  className="border-t border-zinc-800 hover:bg-zinc-900"
>

<td className="p-3" onPointerDown={stop}>
  <span
    className={`${badge} ${
      getHeads(rank) >= 20
        ? "border-green-500 text-green-400 bg-green-500/10"
        : getHeads(rank) >= 10
        ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
        : getHeads(rank) >= 5
        ? "border-orange-500 text-orange-400 bg-orange-500/10"
        : getHeads(rank) > 4
        ? "border-red-500 text-red-400 bg-red-500/10"
        : "border-zinc-500 text-zinc-400 bg-zinc-500/10"
    }`}
  >
    {getHeads(rank)}
  </span>
</td>
     <td className="p-3" onPointerDown={stop}>

{editing ? (
 <input
  className="w-20 bg-zinc-800 border border-zinc-600 rounded px-1 text-center"
  autoFocus
  value={value}
  onChange={(e)=>setValue(e.target.value)}
  onBlur={()=>{
  setPlayers((prev:any[]) =>
    prev.map(p =>
      p.id === player.id
        ? { ...p, points: value }
        : p
    )
  )
  setEditing(false)
}}
/>
) : (
  <span
    onClick={()=>setEditing(true)}
    className="cursor-pointer text-white hover:underline"
  >
 {value}
  </span>
)}

</td>
      <td className="p-3 font-semibold">{rank}</td>
     <td className="p-3" onPointerDown={stop}>
  <span
    className={`${badge} ${
      Number(player.desiredRank) <= 2
        ? "border-green-500 text-green-400 bg-green-500/10"
        : Number(player.desiredRank) <= 5
        ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
        : Number(player.desiredRank) <= 10
        ? "border-orange-500 text-orange-400 bg-orange-500/10"
        : "border-red-500 text-red-400 bg-red-500/10"
    }`}
  >
    {player.desiredRank}
  </span>
</td>
<td
  className="p-3 font-semibold cursor-grab"
>
  {player.name}
</td>
     <td className="p-3" onPointerDown={stop}>{player.commander}</td>

<td className="p-3" onPointerDown={stop}>
  {!player.purpose ? (
    <span className="text-zinc-400 text-xs">N/A</span>
  ) : (
    <span
      className={`${badge} ${
        player.purpose === "Meta R/G Leader"
          ? "border-green-500 text-green-400 bg-green-500/10"
        : player.purpose === "Non-Meta R/G Leader" || player.purpose === "Field fight"
          ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
        : player.purpose === "Own city garrison"
          ? "border-orange-500 text-orange-400 bg-orange-500/10"
        : "border-red-500 text-red-400 bg-red-500/10"
      }`}
    >
      {player.purpose}
    </span>
  )}
</td>

<td ref={rgRef} className="p-3 relative" onPointerDown={stop}>

<div
  className="flex flex-wrap gap-1 cursor-pointer"
  onClick={()=>setShowRg(!showRg)}
>

{rg.length === 0 && (
  <span className="text-zinc-400 text-xs">N/A</span>
)}

{rg.map(v=>{

  let color="bg-zinc-600"

  if(v==="Garrison" || v==="Rally" || v==="Both" || v==="R4" || v==="R5")
    color="bg-green-600"

  if(v.includes("-Y"))
    color="bg-yellow-500"

  if(v==="No")
    color="bg-red-600"

 return (
<span
  key={v}
  className={`${badge} ${
    v==="No"
      ? "border-red-500 text-red-400 bg-red-500/10"
      : v.includes("-Y")
      ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
      : "border-green-500 text-green-400 bg-green-500/10"
  }`}
>
  {v.replace("-Y","")}
</span>
)

})}

</div>

{showRg && (

<div className="absolute z-[9999] top-full left-0 mt-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-xs shadow-lg max-h-48 overflow-y-auto">

{rgOptions.map(o=>{

let color="text-white"

if(o.color==="green") color="text-green-400"
if(o.color==="yellow") color="text-yellow-400"
if(o.color==="red") color="text-red-400"

return (

<div
key={o.value}
className={`cursor-pointer px-2 py-1 rounded hover:bg-zinc-800 ${color}`}
onPointerDown={(e)=>e.stopPropagation()}
onClick={()=>{
setPlayers((prev:any[]) =>
  prev.map(p =>
    p.id === player.id
      ? {
          ...p,
          rg: rg.includes(o.value)
            ? rg.filter(x => x !== o.value)
            : [...rg, o.value]
        }
      : p
  )
)
}}
>
{o.label}
</div>

)

})}

</div>

)}

</td>
<td className="p-3" onPointerDown={stop}>
  <span
    className={`${badge} ${
      kvkContributionPercent(player.kvkContribution).color === "green"
        ? "border-green-500 text-green-400 bg-green-500/10"
        : kvkContributionPercent(player.kvkContribution).color === "yellow"
        ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
        : kvkContributionPercent(player.kvkContribution).color === "orange"
        ? "border-orange-500 text-orange-400 bg-orange-500/10"
        : "border-red-500 text-red-400 bg-red-500/10"
    }`}
  >
    {kvkContributionPercent(player.kvkContribution).label}
  </span>
</td>
 <td className="p-3" onPointerDown={stop}>
  <span
    className={`${badge} ${
      player.spend === "Buy all, max tech!"
        ? "border-green-500 text-green-400 bg-green-500/10"
        : (player.spend || "").includes("Few")
        ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
        : (player.spend || "").includes("Crystal")
        ? "border-orange-500 text-orange-400 bg-orange-500/10"
        : "border-red-500 text-red-400 bg-red-500/10"
    }`}
  >
    {player.spend}
  </span>
</td>

<td ref={eqRef} className="p-3 relative" onPointerDown={stop}>

<div
  className="cursor-pointer"
  onClick={()=>setShowEq(!showEq)}
>

{eq === "N/A" && (
  <span className="text-zinc-400 text-xs">N/A</span>
)}

{eq !== "N/A" && (

<span
className={`px-3 py-1 rounded-md text-xs font-semibold border ${
eq==="Legendary"
? "border-green-500 text-green-400 bg-green-500/10"
: eq==="Leg.Purple"
? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
: eq==="Purple"
? "border-orange-500 text-orange-400 bg-orange-500/10"
: "border-red-500 text-red-400 bg-red-500/10"
}`}
>
{eq}
</span>

)}

</div>

{showEq && (

<div className="absolute z-[9999] top-full left-0 mt-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-xs shadow-lg max-h-48 overflow-y-auto">

{["Legendary","Leg.Purple","Purple","Bad/Low"].map(v => {
  let color = "text-white"

  if (v === "Legendary") color = "text-green-400"
  if (v === "Leg.Purple") color = "text-yellow-400"
  if (v === "Purple") color = "text-orange-400"
  if (v === "Bad/Low") color = "text-red-400"

  return (
    <div
      key={v}
      className={`cursor-pointer px-2 py-1 rounded hover:bg-zinc-800 ${color}`}
      onClick={() => {
setPlayers((prev:any[]) =>
  prev.map(p =>
    p.id === player.id
      ? { ...p, eq: v }
      : p
  )
)
        setShowEq(false)
      }}
    >
      {v}
    </div>
  )
})}

  
</div>

)}

</td>

<td className="p-3" onPointerDown={stop}>
  <td className="p-3 text-center text-zinc-300">
  {player.ghHave ?? 0}
</td>
</td>
  
      <td className="p-3" onPointerDown={stop}>{player.skills}</td>
      <td className="p-3" onPointerDown={stop}>{player.main}</td>

    </tr>
 
  )
}


function parseRokMail(text:string, players:Player[]){

  let html = text

  const ranks = players.map((p,index)=>{

    const rank = index + 1
    const pts = p.points || getPoints(rank, players.length)
    const pointsText = pts === "∞" ? "Unlimited" : pts

    return `${rank}. ${p.name} - ${pointsText}`

  }).join("<br>")

  html = html.replace(/{{RANKS}}/g, ranks)

  html = html.replace(/<b>(.*?)<\/b>/g,"<strong>$1</strong>")

  html = html.replace(/<size=(\d+)>(.*?)<\/size>/g,
    (_,size,content)=>`<span style="font-size:${size}px">${content}</span>`
  )

 html = html.replace(
/<color=(.*?)>(.*?)<\/color>/g,
(_,color,content)=>{

const map:any = {
red:"#f87171",
green:"#4ade80",
yellow:"#facc15",
orange:"#fb923c",
purple:"#c084fc",
blue:"#60a5fa",
white:"#e5e7eb"
}

const c = map[color] || color

return `<span style="color:${c}">${content}</span>`

})

  return html
}
export default function MgeRanklistPage() {
const [error,setError] = useState(false)
const [mail,setMail] = useState("")
const editorRef = useRef<HTMLDivElement>(null)

const [players,setPlayers] = useState<Player[]>([])

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ""
const [checkedAuth, setCheckedAuth] = useState(false)
const [authorized, setAuthorized] = useState(false)
const [inputPass, setInputPass] = useState("")

useEffect(() => {
  const saved = localStorage.getItem("20gh_admin")

  if (saved === ADMIN_PASS) {
    setAuthorized(true)
  }

  setCheckedAuth(true)
}, [])


  
function handleLogin() {
  if (inputPass === ADMIN_PASS) {
    localStorage.setItem("20gh_admin", inputPass)
    setAuthorized(true)
    setError(false)
  } else {
    setError(true)
  }
}

function handleLogout() {
  localStorage.removeItem("20gh_admin")
  setAuthorized(false)
}
  
  
  
const [loading,setLoading] = useState(true)
const [loaded,setLoaded] = useState(false)

useEffect(() => {

  if (!loaded) return

  saveList(players)

}, [players])

  
function handleDragEnd(event:any){

  const {active,over} = event

  if(!over) return

  if(active.id !== over.id){

    setPlayers(players => {

      const oldIndex = players.findIndex(p => p.id === active.id)
      const newIndex = players.findIndex(p => p.id === over.id)

     const updated = arrayMove(players, oldIndex, newIndex)

localStorage.setItem("20gh_order", JSON.stringify(updated))


return updated

    })

  }

}
function copyMail(){

let raw = mail

const ranks = players.map((p,index)=>{

  const rank = index + 1
  const pts = p.points || getPoints(rank, players.length)
  const pointsText = pts === "∞" ? "Unlimited" : pts

  return `${rank}. ${p.name} - ${pointsText}`

}).join("\n")

raw = raw.replace(/{{RANKS}}/g, ranks)

navigator.clipboard.writeText(raw)

}
async function saveList(updated:any[]) {

  const rows = updated.map((p,index)=>{

    const rank = index+1

  return [
  p.id,
  getHeads(rank),
  p.points || getPoints(rank, updated.length),
  rank,
  p.desiredRank,
  p.name,
  p.commander,
  p.purpose || "",
  p.rg?.join(", ") || "",
  p.kvkContribution,
  p.spend,
  p.eq || "",
  p.ghHave || 0,
  p.skills,
  p.main
]

  })

  await fetch("/api/20gh-save-list",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({rows})
  })

}

  useEffect(()=>{
  const saved = localStorage.getItem("20gh_mail")
  if(saved) setMail(saved)
},[])

  
  useEffect(()=>{

  if(!editorRef.current) return

  const html = parseRokMail(mail, players)

  if(editorRef.current.innerHTML !== html){
    editorRef.current.innerHTML = html
  }

},[mail,players])

  useEffect(()=>{
  localStorage.setItem("20gh_mail",mail)
},[mail])

  useEffect(()=>{
    load()
  },[])


  
async function load(){

  const res = await fetch("/api/20gh-apply-data-get")
  const json = await res.json()

  if(!json.success){
    setLoading(false)
    return
  }

const sheetPlayers = json.data
.sort((a:any,b:any)=> a.rank - b.rank)
.map((p:any)=>({

  ...p,
ghHave: Number(p.ghHave || 0),
  main: p["Main Troop Type"] || p.main

}))
  const saved = localStorage.getItem("20gh_order")

if (saved) {

  const savedPlayers = JSON.parse(saved)

  const savedOrder = savedPlayers.map((p:any)=>p.id)

  const ordered = savedOrder
    .map((id:string)=>sheetPlayers.find((s:any)=>s.id === id))
    .filter(Boolean)

  const missing = sheetPlayers.filter((s:any)=>
    !savedOrder.includes(s.id)
  )

  const finalList = [...ordered, ...missing]

  setPlayers(finalList)

} else {

    setPlayers(sheetPlayers)

  }

  setLoading(false)
setLoaded(true)

}
if (!checkedAuth) return null
  if(loading){
    return (
      <div className="p-8 text-center text-gray-400">
        Loading 20GH data...
      </div>
    )
  }

return (
<AppSidebar>
    
  <Suspense fallback={<div className="p-8 text-gray-400">Loading...</div>}>

{/* ADMIN LOCK OVERLAY - offset so it doesn't cover sidebar */}
{!authorized && (
  <div
    className="fixed inset-0 z-[50] flex items-center justify-center"
    style={{ left: '260px' }}
  >
    <div className="bg-zinc-900/95 rounded-xl p-6 w-[320px] text-center flex flex-col gap-4 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      <div className="absolute inset-0 rounded-xl pointer-events-none border border-yellow-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)]" />
      <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent opacity-40" />
      <div className="font-semibold text-lg tracking-wide bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
        🔒 Admin Access
      </div>
      <input
        type="password"
        placeholder="Enter password..."
        value={inputPass}
        onChange={(e)=>{
          setInputPass(e.target.value)
          setError(false)
        }}
        className={`w-full px-3 py-2 rounded-md text-sm bg-zinc-800 border ${
          error
            ? "border-red-500 text-red-300"
            : "border-yellow-500/30 text-white"
        }`}
      />
      {error && <div className="text-red-400 text-xs">Wrong password</div>}
      <button
        onClick={handleLogin}
        className="bg-yellow-400 py-2 rounded-md font-semibold text-black"
      >
        Unlock
      </button>
    </div>
  </div>
)}

{/* MAIN CONTENT */}
<div className={!authorized ? "pointer-events-none select-none" : ""}>
  
<div className="max-w-[1800px] mx-auto p-4 md:p-8">

<div
className="p-6 rounded-lg border space-y-4 gold-glow"
style={{
  background: "var(--background-card)",
  borderColor: "var(--border)"
}}
>

<div className="relative flex items-center border-b border-yellow-500/30 pb-2 mb-4">
  
 <h2 className="mge-title absolute left-1/2 -translate-x-1/2">
    .˳·˖✶𓆩20G Ranklist𓆪✶˖·˳.
  </h2>

  {authorized && (
<button
  onClick={handleLogout}
  title="Log off"
  className="ml-auto text-red-400 hover:text-red-300 flex items-center justify-center w-9 h-9 rounded-md hover:bg-red-500/10 transition"
>
  <LogOut size={18} />
</button>
  )}

</div>

{/* TABLE BOX */}
<div className="relative overflow-visible mt-6 rounded-lg border border-yellow-500/40 bg-[#0f141a] backdrop-blur-sm shadow-[0_0_20px_rgba(255,215,107,0.25)]">
<DndContext
collisionDetection={closestCenter}
onDragEnd={handleDragEnd}
>

<SortableContext
items={players.map(p => p.id)}
strategy={verticalListSortingStrategy}
>

<table className="w-full text-sm relative z-0 table-auto">

<thead className="bg-zinc-900 sticky top-0 z-20 [&>tr>th:first-child]:rounded-tl-lg [&>tr>th:last-child]:rounded-tr-lg">
<tr className="text-left">
<th className="p-3">Heads</th>
<th className="p-3">Points</th>
<th className="p-3">Rank</th>
<th className="p-3">W.Rank</th>
<th className="p-3">Name</th>
<th className="p-3">Need</th>
  <th className="p-3">Purpose</th>
<th className="p-3">R&G</th>
<th className="p-3">KvK C.</th>
<th className="p-3">Spend</th>
<th className="p-3">EQ</th>
  <th className="p-3">GH Have</th> 
<th className="p-3">Skill</th>
<th className="p-3">Main</th>
</tr>
</thead>

<tbody>
{players.map((p,index)=>{

const rank = index + 1

return (
<Row
  key={p.id}
  player={p}
  rank={rank}
  setPlayers={setPlayers}
  totalPlayers={players.length}
/>
)

})}
</tbody>

</table>

</SortableContext>
</DndContext>

</div>
{/* END TABLE BOX */}

{/* DIVIDER LINE */}
<div className="my-8 border-t border-yellow-500/30"></div>

{/* MAIL SECTION */}
<div>

<div className="flex justify-between items-center text-sm text-zinc-300 mb-2">

<span className="font-semibold text-zinc-300">
Mail
</span>

<div className="flex gap-4 items-center">

<span
className="text-yellow-400 cursor-pointer hover:text-yellow-300"
onClick={copyMail}
>
Copy Mail
</span>

</div>
</div>

<div className="border border-yellow-500/40 rounded-lg shadow-[0_0_20px_rgba(255,215,107,0.2)] bg-[#0f141a]">

<div
ref={editorRef}
contentEditable
suppressContentEditableWarning
className="w-full min-h-[260px] p-4 rounded-lg bg-[#070c12] text-sm leading-relaxed outline-none text-zinc-200 whitespace-pre-wrap"
onInput={(e) => {
  const raw = (e.currentTarget as HTMLDivElement).innerText
  setMail(raw)
}}
>
</div> 
</div> 
</div>  

 </div> 
</div>
</div>

  </Suspense>
</AppSidebar>

)
}
