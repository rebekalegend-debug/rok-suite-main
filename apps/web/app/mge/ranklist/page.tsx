'use client'

import { useEffect, useState } from "react"
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

export default function MgeRanklistPage() {
function Row({ player, rank }: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: player.id })
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
      {...listeners}
      className="border-t border-zinc-800 hover:bg-zinc-900 cursor-grab"
    >

      <td className="p-3">{getHeads(rank)}</td>
     <td className="p-3">

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
      <td className="p-3">{player.desiredRank}</td>
      <td className="p-3 font-semibold">{player.name}</td>
      <td className="p-3">{player.commander}</td>
      <td className="p-3">N/A</td>
     <td className="p-3">
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
     <td className="p-3">
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
      <td className="p-3">N/A</td>
      <td className="p-3">{player.skills}</td>
      <td className="p-3">{player.main}</td>

    </tr>
  )
}
  const [players,setPlayers] = useState<Player[]>([])
  const [loading,setLoading] = useState(true)
function handleDragEnd(event:any){

  const {active,over} = event

  if(!over) return

  if(active.id !== over.id){

    setPlayers(players => {

      const oldIndex = players.findIndex(p => p.id === active.id)
      const newIndex = players.findIndex(p => p.id === over.id)

      return arrayMove(players, oldIndex, newIndex)

    })

  }

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📊 MGE Ranklist
        </h1>
        <p className="text-sm opacity-60">
          Drag players to reorder ranking
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-700">

    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

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
