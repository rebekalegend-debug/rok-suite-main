'use client'

import { useEffect, useState } from "react"
import { getHeads, getPoints } from "@/utils/mgeRankLogic"

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

  const [players,setPlayers] = useState<Player[]>([])
  const [loading,setLoading] = useState(true)

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

                <tr key={p.id} className="border-t border-zinc-800 hover:bg-zinc-900">

                  <td className="p-3">{getHeads(rank)}</td>
                  <td className="p-3">{getPoints(rank)}</td>
                  <td className="p-3 font-semibold">{rank}</td>
                  <td className="p-3">{p.desiredRank}</td>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.commander}</td>
                  <td className="p-3">N/A</td>
                  <td className="p-3">{p.kvkContribution}</td>
                  <td className="p-3">{p.spend}</td>
                  <td className="p-3">N/A</td>
                  <td className="p-3">{p.skills}</td>
                  <td className="p-3">{p.main}</td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

    </div>
  )
}
