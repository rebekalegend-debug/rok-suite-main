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
    loadData()
  }, [])

  function clean(v: any) {
    return String(v || "")
      .replace(/'/g, "")
      .trim()
  }

  async function loadData() {
    try {
      const res = await fetch("/api/mge-apply-data-get")
      const json = await res.json()

      if (!json.success) return

      // 🔥 USE API AS PURE KVK DATASET
      const cleaned = json.data.map((p: any) => ({
        id: clean(p.id),
        name: p.name, // 👈 already exists from your sheet
        kvkContribution: Number(p.kvkContribution) || 0
      }))

      setPlayers(cleaned)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 🔎 SEARCH
  function normalize(str: string) {
    return str
      .toLowerCase()
      .replace(/\s+/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  }

  function getScore(name: string, query: string) {
    if (name === query) return 100
    if (name.startsWith(query)) return 80
    if (name.includes(query)) return 50

    let score = 0
    let i = 0

    for (let char of name) {
      if (char === query[i]) {
        score += 5
        i++
      }
    }

    return score
  }

  useEffect(() => {

    if (!search.trim()) {
      setResults([])
      return
    }

    const query = normalize(search)

    const filtered = players
      .map(p => ({
        ...p,
        score: getScore(normalize(p.name), query)
      }))
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    setResults(filtered)

  }, [search, players])

  return (
    <AppSidebar>
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        <h1 className="text-4xl font-bold text-center">🏆 20GH Rules</h1>

        <section className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 border border-purple-400/20 space-y-4">

          <h2 className="text-2xl font-semibold text-purple-300">
            🔎 Player KvK Lookup
          </h2>

          <input
            placeholder="Search player name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          {loading && (
            <p className="text-sm text-white/60">Loading...</p>
          )}

          <div className="space-y-2">
            {results.map((p) => {
              const kvk = kvkContributionPercent(p.kvkContribution)

              return (
                <div key={p.id} className="p-3 rounded-xl bg-white/5 border border-white/10">

                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-white/50">
                        {p.kvkContribution.toLocaleString()} KP
                      </div>
                    </div>

                    <span className="text-xs">{kvk.label}</span>
                  </div>

                  {p.kvkContribution < 100_000_000 && (
                    <div className="text-red-400 text-xs mt-1">
                      🚨 Will be fined in Top 10
                    </div>
                  )}

                </div>
              )
            })}
          </div>

        </section>

      </div>
    </AppSidebar>
  )
}
