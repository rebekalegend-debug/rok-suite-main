'use client'

import { useEffect, useState, useRef } from "react"
import { getHeads, getPoints, kvkContributionPercent } from "@/utils/mgeRankLogic"
import { autoRankPlayers } from "@/utils/mgeAutoRank"
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
}
const badge = "px-3 py-1 rounded-md text-xs font-semibold border"
function Row({ player, rank, setPlayers }: any) {

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

  const defaultPoints = getPoints(rank)

const initial =
  defaultPoints === "∞"
    ? Infinity
    : Number(defaultPoints.replace("M",""))

const [value,setValue] = useState<number>(initial)
const [editing,setEditing] = useState(false)
  
  useEffect(() => {
  const pts = getPoints(rank)

  const newValue =
    pts === "∞"
      ? Infinity
      : Number(pts.replace("M",""))

  setValue(newValue)

}, [rank])
  
  
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
  className="border-t border-zinc-800 hover:bg-zinc-900"
>

 <td className="p-3" onPointerDown={stop}>
{(() => {

  const heads = getHeads(rank)

  return (
    <span
      className={`${badge} ${
        heads >= 90
          ? "border-green-500 text-green-400 bg-green-500/10"
          : heads >= 60
          ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
          : heads >= 30
          ? "border-orange-500 text-orange-400 bg-orange-500/10"
          : heads > 0
          ? "border-red-500 text-red-400 bg-red-500/10"
          : "border-zinc-500 text-zinc-400 bg-zinc-500/10"
      }`}
    >
      {heads}
    </span>
  )

})()}
</td>
     <td className="p-3" onPointerDown={stop}>

{editing ? (
  <input
    className="w-16 bg-zinc-800 border border-zinc-600 rounded px-1 text-center"
    autoFocus
    defaultValue={value}
    onBlur={(e)=>{
      const v = Number(e.target.value) || 0
      setValue(v)
      setEditing(false)
    }}
  />
) : (
  <span
    onClick={()=>setEditing(true)}
    className="cursor-pointer text-white hover:underline"
  >
    {value === Infinity ? "∞" : value + "M"}
  </span>
)}

</td>
      <td className="p-3 font-semibold">{rank}</td>
      <td className="p-3" onPointerDown={stop}>
 {(() => {

  const wr = Number(player.desiredRank)

  return (
    <span
      className={`${badge} ${
        wr <= 2
          ? "border-green-500 text-green-400 bg-green-500/10"
          : wr <= 5
          ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
          : wr <= 10
          ? "border-orange-500 text-orange-400 bg-orange-500/10"
          : "border-red-500 text-red-400 bg-red-500/10"
      }`}
    >
      {player.desiredRank}
    </span>
  )

})()}
</td>

<td
  className="p-3 font-semibold cursor-grab"
  {...listeners}
>
  {player.name}
</td>
     <td className="p-3" onPointerDown={stop}>{player.commander}</td>

<td className="p-3" onPointerDown={stop}>
{(() => {

  const p = player.purpose

  if(!p)
    return <span className="text-zinc-400 text-xs">N/A</span>

  return (
    <span
      className={`${badge} ${
        p === "Meta R/G Leader"
          ? "border-green-500 text-green-400 bg-green-500/10"
        : p === "Non-Meta R/G Leader" || p === "Field fight"
          ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
        : p === "Own city garrison"
          ? "border-orange-500 text-orange-400 bg-orange-500/10"
        : "border-red-500 text-red-400 bg-red-500/10"
      }`}
    >
      {p}
    </span>
  )

})()}
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

<div className="absolute z-[9999] bottom-full left-0 mb-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-xs shadow-lg max-h-48 overflow-y-auto">

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
{
(() => {

const kvk = kvkContributionPercent(player.kvkContribution)

let color =
  kvk.color === "green"
    ? "border-green-500 text-green-400 bg-green-500/10"
    : kvk.color === "yellow"
    ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
    : kvk.color === "orange"
    ? "border-orange-500 text-orange-400 bg-orange-500/10"
    : "border-red-500 text-red-400 bg-red-500/10"

return (
  <span className={`${badge} ${color}`}>
    {kvk.label}
  </span>
)

})()
}
</td>
     <td className="p-3" onPointerDown={stop}>
{
  (() => {

    const map:any = {
      "F2P": "bg-red-600",
      "Only 50% Mine Boost": "bg-orange-500",
      "Only Crystal Quest": "bg-orange-500",
      "50% Boost + Crystal Quest": "bg-orange-500",
      "50% + C.Q. + Few pop up bundles": "bg-yellow-500",
      "Buy all, max tech!": "bg-green-600"
    }

    const color = map[player.spend] || "bg-zinc-600"

    return (
      <span
  className={`${badge} ${
    player.spend === "Buy all, max tech!"
      ? "border-green-500 text-green-400 bg-green-500/10"
      : player.spend.includes("Few")
      ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
      : player.spend.includes("Crystal")
      ? "border-orange-500 text-orange-400 bg-orange-500/10"
      : "border-red-500 text-red-400 bg-red-500/10"
  }`}
>
        {player.spend}
      </span>
    )

  })()
}
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

<div className="absolute z-[9999] bottom-full left-0 mb-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-xs shadow-lg max-h-48 overflow-y-auto">

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
      <td className="p-3" onPointerDown={stop}>{player.skills}</td>
      <td className="p-3" onPointerDown={stop}>{player.main}</td>

    </tr>
  )
}


function parseRokMail(text:string, players:Player[]){

  let html = text

  const ranks = players.map((p,index)=>{

    const rank = index + 1
    const pts = getPoints(rank)
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

const [mail,setMail] = useState("")
const editorRef = useRef<HTMLDivElement>(null)

const [players,setPlayers] = useState<Player[]>([])
useEffect(() => {

  if (!loaded) return

  saveList(players)

}, [players])
  
  const [loading,setLoading] = useState(true)
const [loaded,setLoaded] = useState(false)
const [autoOrder,setAutoOrder] = useState(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("mge_auto")
    return saved === "false" ? false : true
  }
  return true
})

  useEffect(() => {

  if (!autoOrder) return

  setPlayers(prev => autoRankPlayers(prev))

}, [autoOrder, players.length])
  
function handleDragEnd(event:any){

  const {active,over} = event

  if(!over) return

  if(active.id !== over.id){

    setPlayers(players => {

      const oldIndex = players.findIndex(p => p.id === active.id)
      const newIndex = players.findIndex(p => p.id === over.id)

     const updated = arrayMove(players, oldIndex, newIndex)

localStorage.setItem("mge_order", JSON.stringify(updated))


return updated

    })

  }

}
function copyMail(){

let raw = mail

const ranks = players.map((p,index)=>{

  const rank = index + 1
  const pts = getPoints(rank)
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
  p.id,                      // A ID
  getHeads(rank),            // B Heads
  getPoints(rank),           // C Points
  rank,                      // D Rank
  p.desiredRank,             // E W.Rank
  p.name,                    // F Name
  p.commander,               // G Need
  p.purpose || "",           // H Purpose
  p.rg?.join(", ") || "",    // I R&G
  p.kvkContribution,         // J KvK C.
  p.spend,                   // K Spend
  p.eq || "",                // L EQ
  p.skills,                  // M Skill
  p.main                     // N Main
]

  })

  await fetch("/api/mge-save-list",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({rows})
  })

}


useEffect(()=>{
  localStorage.setItem("mge_auto", String(autoOrder))
},[autoOrder])

  useEffect(()=>{
  const saved = localStorage.getItem("mge_mail")
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
  localStorage.setItem("mge_mail",mail)
},[mail])

  useEffect(()=>{
    load()
  },[])





  
async function load(){

  const res = await fetch("/api/mge-apply-data-get")
  const json = await res.json()

  if(!json.success){
    setLoading(false)
    return
  }

const sheetPlayers = json.data
.sort((a:any,b:any)=> a.rank - b.rank)
.map((p:any)=>({

  ...p,

  main: p["Main Troop Type"] || p.main

}))
  const saved = localStorage.getItem("mge_order")

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

  if(loading){
    return (
      <div className="p-8 text-center text-gray-400">
        Loading MGE data...
      </div>
    )
  }

return (
<div className="max-w-[1800px] mx-auto p-4 md:p-8">

<div
className="p-6 rounded-lg border space-y-4 gold-glow"
style={{
  background: "var(--background-card)",
  borderColor: "var(--border)"
}}
>

<h2 className="mge-title border-b pb-2 mb-4">
.˳·˖✶𓆩MGE Ranklist𓆪✶˖·˳.
</h2>

{/* TABLE BOX */}
<div className="relative overflow-visible mt-6 rounded-lg border border-yellow-500/40 bg-[#0f141a] backdrop-blur-sm shadow-[0_0_20px_rgba(255,215,107,0.25)]">
<DndContext
collisionDetection={closestCenter}
onDragEnd={!autoOrder ? handleDragEnd : undefined}
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
  
<span
className="cursor-pointer"
onClick={()=>setAutoOrder(!autoOrder)}
>
Auto rank:
<span className={`ml-1 ${autoOrder ? "text-green-400" : "text-red-400"}`}>
[{autoOrder ? "ON" : "OFF"}]
</span>
</span>

</div>
</div>

<div className="border border-yellow-500/40 rounded-lg shadow-[0_0_20px_rgba(255,215,107,0.2)] bg-[#0f141a]">

<div
ref={editorRef}
contentEditable
suppressContentEditableWarning
className="w-full min-h-[260px] p-4 rounded-lg bg-[#070c12] text-sm leading-relaxed outline-none text-zinc-200 whitespace-pre-wrap"
onInput={(e)=>{
  const raw = e.currentTarget.innerText
  setMail(raw)
}}
>
</div>
{/* close mail box */}

</div>
{/* close mail container */}

</div>
{/* close MAIL SECTION */}

</div>
{/* close main card */}

{/* page container */}
</div>
)
}
