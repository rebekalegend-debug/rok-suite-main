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
      className="border-t border-zinc-800 hover:bg-zinc-900 cursor-grab"
    >

      <td className="p-3" onPointerDown={stop}>{getHeads(rank)}</td>
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
    className="cursor-pointer hover:text-yellow-400"
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
  className="p-3 font-semibold cursor-grab flex items-center gap-2"
  {...listeners}
>
  ⋮⋮ {player.name}
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
      className={`px-2 py-0.5 rounded text-xs text-white ${color}`}
    >
      {v.replace("-Y","")}
    </span>
  )

})}

</div>

{showRg && (

<div className="absolute z-50 bottom-full mb-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-xs shadow-lg max-h-48 overflow-y-auto">

{rgOptions.map(o=>{

  return (

    <div
      key={o.value}
      className="cursor-pointer hover:text-yellow-400"
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
    const kvk = kvkContributionPercent(player.kvkContribution)

    const colors:any = {
      green: "bg-green-600",
      yellow: "bg-yellow-500",
      orange: "bg-orange-500",
      red: "bg-red-600"
    }

    return (
      <span
        className={`px-2 py-1 rounded text-xs text-white ${colors[kvk.color]}`}
      >
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
      <span className={`px-2 py-1 rounded text-xs text-white ${color}`}>
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

<span className={`px-2 py-1 rounded text-xs text-white
${eq==="Legendary" ? "bg-yellow-500"
: eq==="Leg.Purple" ? "bg-purple-600"
: eq==="Purple" ? "bg-purple-500"
: "bg-blue-500"}
`}>
{eq}
</span>

)}

</div>

{showEq && (

<div className="absolute z-50 bottom-full mb-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-xs shadow-lg max-h-48 overflow-y-auto">

{["Legendary","Leg.Purple","Purple","Bad/Low"].map(v => (

  <div
    key={v}
    className="cursor-pointer hover:text-yellow-400"
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

  const [players,setPlayers] = useState<Player[]>([])
  const [loading,setLoading] = useState(true)
  const [autoOrder,setAutoOrder] = useState(true)
function handleDragEnd(event:any){

  const {active,over} = event

  if(!over) return

  if(active.id !== over.id){

    setPlayers(players => {

      const oldIndex = players.findIndex(p => p.id === active.id)
      const newIndex = players.findIndex(p => p.id === over.id)

      const updated = arrayMove(players, oldIndex, newIndex)

saveList(updated)

return updated

    })

  }

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
    load()
  },[])





  
  async function load(){
    const res = await fetch("/api/mge-apply-data-get")
    const json = await res.json()

    if(json.success){
      setPlayers(json.data)
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
    <div className="min-h-screen p-4 lg:p-8">

      {/* Header */}
     <div className="mb-6 flex items-center justify-between">

<div>
  <h1 className="text-2xl font-bold flex items-center gap-2">
    📊 MGE Ranklist
  </h1>

  <p className="text-sm opacity-60">
    Drag players to reorder ranking
  </p>
</div>

<button
className={`px-4 py-2 rounded text-sm font-semibold
${autoOrder ? "bg-green-600" : "bg-red-600"}`}
onClick={async ()=>{

const pass = prompt("Enter admin password")

if(!pass) return

const res = await fetch("/api/admin-check",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({password:pass})
})

const json = await res.json()

if(!json.success){
alert("Wrong password")
return
}

setAutoOrder(!autoOrder)

}}
>

{autoOrder ? "AUTO ORDER ON" : "AUTO ORDER OFF"}

</button>

</div>
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-700">

  <DndContext
collisionDetection={closestCenter}
onDragEnd={autoOrder ? handleDragEnd : undefined}
>

<SortableContext
  items={players.map(p => p.id)}
  strategy={verticalListSortingStrategy}
>

<table className="w-full text-sm">

  <thead className="bg-zinc-900">
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

    </div>
  )
}
