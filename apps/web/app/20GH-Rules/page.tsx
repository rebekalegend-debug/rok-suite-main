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
      <div className="max-w-4xl mx-auto p-6 space-y-10">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center">🏆 20GH Rules</h1>

        {/* 📜 RULES */}
        <section className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-2xl font-semibold text-yellow-300">
            📜 MGE Rules
          </h2>

          <ul className="space-y-2 text-sm text-white/80">

            <li>• Top 10 must follow assigned ranks</li>

            <li className="text-red-400">
              • Players under <b>100M KP</b> in KvK risk fines 🚨
            </li>

            <li>• No unauthorized push in ranking</li>

            <li>• Respect kingdom leadership decisions</li>

            <li className="text-purple-300">
              • KvK contribution directly impacts eligibility
            </li>

          </ul>
        </section>

        {/* 🔎 SEARCH */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 border border-purple-400/20 space-y-4">

          <h2 className="text-2xl font-semibold text-purple-300">
            🔎 Player KvK Lookup
          </h2>

          <input
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          {loading && (
            <p className="text-sm text-white/60">Loading...</p>
          )}

          <div className="space-y-2">
            {results.map(p => {
              const kvk = kvkContributionPercent(p.kvkContribution)

              return (
                <div key={p.id} className="p-3 bg-white/5 rounded-xl border border-white/10">

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
