'use client'

import { useEffect, useState, useRef } from "react"
import { getHeads, getPoints, kvkContributionPercent } from "@/utils/mgeRankLogic"

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
}
const badge = "px-3 py-1 rounded-md text-xs font-semibold border"
function Row({ player, rank }: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: player.id })
  const stop = (e:any) => e.stopPropagation()
const [rg,setRg] = useState<string[]>([])
const [showRg,setShowRg] = useState(false)
const rgRef = useRef<any>(null)
const eqRef = useRef<any>(null)
const [eq,setEq] = useState("N/A")
const [showEq,setShowEq] = useState(false)
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
const defaultPoints = getPoints(rank)

const initial =
  defaultPoints === "∞"
    ? Infinity
    : Number(defaultPoints.replace("M",""))

const [value,setValue] = useState<number>(initial)
const [editing,setEditing] = useState(false)
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
  {player.desiredRank}
</td>

<td
  className="p-3 font-semibold cursor-grab"
  {...listeners}
>
  {player.name}
</td>
      <td className="p-3" onPointerDown={stop}>{player.commander}</td>
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

  return (

    <div
      key={o.value}
   className={`cursor-pointer
${o.color==="green" && "hover:text-green-400"}
${o.color==="yellow" && "hover:text-yellow-400"}
${o.color==="red" && "hover:text-red-400"}
`}
      onClick={()=>{
        if(rg.includes(o.value)){
          setRg(rg.filter(x=>x!==o.value))
        }else{
          setRg([...rg,o.value])
        }
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

const percent = Math.round(player.kvkContribution / 1_000_000)

let color =
  percent >= 300
    ? "border-green-500 text-green-400 bg-green-500/10"
    : percent >= 100
    ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
    : percent >= 50
    ? "border-orange-500 text-orange-400 bg-orange-500/10"
    : "border-red-500 text-red-400 bg-red-500/10"

return (
  <span className={`${badge} ${color}`}>
    {percent}%
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

<span className={`px-3 py-1 rounded-md text-xs font-semibold border
${eq==="Legendary" ? "border-yellow-500 text-yellow-400 bg-green-500/10"
: eq==="Leg.Purple" ? "border-purple-500 text-purple-400 bg-yellow-500/10"
: eq==="Purple" ? "border-purple-500 text-purple-400 bg-orange-500/10"
: "border-blue-500 text-blue-400 bg-red-500/10"}
`}>
{eq}
</span>

)}

</div>

{showEq && (

<div className="absolute z-[9999] bottom-full left-0 mb-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-xs shadow-lg max-h-48 overflow-y-auto">

{["Legendary","Leg.Purple","Purple","Bad/Low"].map(v => (

  <div
    key={v}
className={`cursor-pointer
${v==="Legendary" && "hover:text-green-400"}
${v==="Leg.Purple" && "hover:text-yellow-400"}
${v==="Purple" && "hover:text-orange-400"}
${v==="Bad/Low" && "hover:text-red-400"}
`}
    onClick={()=>{
      setEq(v)
      setShowEq(false)
    }}
  >
    {v}
  </div>

))}

</div>

)}

</td>
      <td className="p-3" onPointerDown={stop}>{player.skills}</td>
      <td className="p-3" onPointerDown={stop}>{player.main}</td>

    </tr>
  )
}

export default function MgeRanklistPage() {
const [mail,setMail] = useState("")
  const [players,setPlayers] = useState<Player[]>([])
  const [loading,setLoading] = useState(true)
 const [autoOrder,setAutoOrder] = useState(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("mge_auto")
    return saved === "false" ? false : true
  }
  return true
})
function handleDragEnd(event:any){

  const {active,over} = event

  if(!over) return

  if(active.id !== over.id){

    setPlayers(players => {

      const oldIndex = players.findIndex(p => p.id === active.id)
      const newIndex = players.findIndex(p => p.id === over.id)

     const updated = arrayMove(players, oldIndex, newIndex)

localStorage.setItem("mge_order", JSON.stringify(updated))

saveList(updated)

return updated

    })

  }

}
function copyRanks(){

const text = players.map((p,index)=>{

  const rank = index + 1
  const pts = getPoints(rank)

  const pointsText = pts === "∞" ? "Unlimited" : pts

  return `${rank}. ${p.name} - ${pointsText}`

}).join("\n")

navigator.clipboard.writeText(text)

}
async function saveList(updated:any[]) {

  const rows = updated.map((p,index)=>{

    const rank = index+1

    return [
      getHeads(rank),
      getPoints(rank),
      rank,
      p.desiredRank,
      p.name,
      p.commander,
      "", // R&G (we will add later)
      p.kvkContribution,
      p.spend,
      "", // EQ
      p.skills,
      p.main
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
  localStorage.setItem("mge_mail",mail)
},[mail])

  useEffect(()=>{
    load()
  },[])





  
async function load(){

const saved = localStorage.getItem("mge_order")

if(saved){
  const parsed = JSON.parse(saved)

  if(parsed.length > 0){
    setPlayers(parsed)
    setLoading(false)
    return
  }
}

  const res = await fetch("/api/mge-apply-data-get")
  const json = await res.json()

  if(json.success){
    const ordered = json.data.sort((a:any,b:any)=>{
      return a.rank - b.rank
    })
    setPlayers(ordered)
  }

  setLoading(false)
}

  if(loading){
    return (
      <div className="p-8 text-center text-gray-400">
        Loading MGE data...
      </div>
    )
  }

return (
<div className="max-w-6xl mx-auto p-4 md:p-8">

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

<table className="w-full text-sm relative z-0">

<thead className="bg-zinc-900 sticky top-0 z-20">
<tr className="text-left">
<th className="p-3">Heads</th>
<th className="p-3">Points</th>
<th className="p-3">Rank</th>
<th className="p-3">W.Rank</th>
<th className="p-3">Name</th>
<th className="p-3">Need</th>
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
onClick={copyRanks}
>
Copy: [Ranks]
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

<textarea
value={mail}
onChange={(e)=>setMail(e.target.value)}
className="w-full h-64 p-4 rounded-lg bg-transparent text-sm font-mono leading-relaxed resize-none outline-none text-zinc-200"
placeholder="Write your in-game mail..."
/>

</div>

</div>

{/* main card */}
</div>

{/* page container */}
</div>
)
}
