'use client'

import { AppSidebar } from '@/components/AppSidebar'
import { useEffect, useState } from "react"
import { kvkContributionPercent } from "@/utils/mgeRankLogic"

type Player = {
  id: string
  name: string
  kvkContribution: number
}

export default function GH20RulesPage() {

  const [players, setPlayers] = useState<Player[]>([])
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const res = await fetch("/api/kvk-only")
      const json = await res.json()

      if (!json.success) return

      setPlayers(json.data)

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function normalize(str: string) {
    return str.toLowerCase().replace(/\s+/g, "")
  }

  useEffect(() => {
    if (!search.trim()) return setResults([])

    const q = normalize(search)

    setResults(
      players
        .filter(p => normalize(p.name).includes(q))
        .slice(0, 10)
    )
  }, [search, players])

  return (
    <AppSidebar>
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        <h1 className="text-4xl font-bold text-center">🏆 20GH Rules</h1>

        <input
          placeholder="Search player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
        />

        {loading && <p>Loading...</p>}

        {results.map(p => {
          const kvk = kvkContributionPercent(p.kvkContribution)

          return (
            <div key={p.id} className="p-3 bg-white/5 rounded-xl">

              <div className="flex justify-between">
                <div>
                  <div>{p.name}</div>
                  <div className="text-xs">
                    {p.kvkContribution.toLocaleString()} KP
                  </div>
                </div>

                <span>{kvk.label}</span>
              </div>

              {p.kvkContribution < 100_000_000 && (
                <div className="text-red-400 text-xs">
                  🚨 Will be fined
                </div>
              )}

            </div>
          )
        })}

      </div>
    </AppSidebar>
  )
}
