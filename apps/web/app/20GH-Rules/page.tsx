'use client'

import { AppSidebar } from '@/components/AppSidebar';
import { useEffect, useState } from "react"
import { kvkContributionPercent } from "@/utils/mgeRankLogic"

type Player = {
  id: string
  name: string
  kvkContribution: number
}

export default function GH20RulesPage() {

  const [members, setMembers] = useState<Player[]>([])
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Player[]>([])
  const [loadingMembers, setLoadingMembers] = useState(true)

  useEffect(() => {
    loadMembers()
  }, [])

  async function loadMembers() {
    try {
      const res = await fetch("/api/mge-apply-data-get")
      const json = await res.json()

      if (!json.success) return

      const mapped = json.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        kvkContribution: Number(p.kvkContribution || 0)
      }))

      setMembers(mapped)

    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMembers(false)
    }
  }

  // 🔥 SMART SEARCH (same as your reg page)
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

    const filtered = members
      .map(p => ({
        ...p,
        score: getScore(normalize(p.name), query)
      }))
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    setResults(filtered)
  }, [search, members])

  return (
    <AppSidebar>
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">🏆 20GH Rules</h1>
          <p className="text-[var(--text-secondary)]">
            Top 10 is restricted. Everything else is free.
            <br />
            For any questions pm Harley Quinn!
          </p>
        </div>

        {/* 🔎 PLAYER LOOKUP */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 border border-purple-400/20 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-300">
            🔎 Player KvK Lookup
          </h2>

          <input
            placeholder="Search player name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-purple-400"
          />

          {loadingMembers && (
            <p className="text-sm text-white/60">Loading members...</p>
          )}

          <div className="space-y-2">

            {results.map((p) => {
              const kvk = kvkContributionPercent(p.kvkContribution)

              return (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col hover:bg-white/10 transition"
                >

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-white/50">
                        {p.kvkContribution.toLocaleString()} KP
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                        kvk.color === "green"
                          ? "border-green-500 text-green-400 bg-green-500/10"
                          : kvk.color === "yellow"
                          ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                          : kvk.color === "orange"
                          ? "border-orange-500 text-orange-400 bg-orange-500/10"
                          : "border-red-500 text-red-400 bg-red-500/10"
                      }`}
                    >
                      {kvk.label}
                    </span>
                  </div>

                  {/* 🔥 AUTO RULE CHECK */}
                  {p.kvkContribution < 100_000_000 && (
                    <div className="text-xs text-red-400 mt-1 font-semibold">
                      🚨 Will be fined if entering Top 10
                    </div>
                  )}

                </div>
              )
            })}

            {!loadingMembers && search && results.length === 0 && (
              <p className="text-sm text-red-400">
                No player found
              </p>
            )}

          </div>
        </section>

        {/* KEEP YOUR RULE SECTIONS BELOW */}

      </div>
    </AppSidebar>
  );
}
