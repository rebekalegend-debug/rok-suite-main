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

  useEffect(() => {
    if (!search.trim()) {
      setResults([])
      return
    }

    const filtered = members
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
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
            className="w-full p-2 rounded-lg bg-black/30 border border-white/10"
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
                  className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center"
                >

                  <span className="font-semibold">{p.name}</span>

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
              )
            })}

            {!loadingMembers && search && results.length === 0 && (
              <p className="text-sm text-red-400">
                No player found
              </p>
            )}

          </div>
        </section>

        {/* TOP 10 RULES */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-[#FFD700]/10 via-[#FFC300]/5 to-[#FFB800]/10 border border-[#FFD700]/20 backdrop-blur-md shadow-[0_0_40px_rgba(255,215,0,0.08)] space-y-4">
          <h2 className="text-2xl font-semibold text-[#FFD700]">👑 Top 10 Rules</h2>

          <p>
            🔒 <b>Top 10 is LIMITED</b>
          </p>

          <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFE066]">
            ✅ <b>Requirement:</b> Minimum <b>100M KP in last KvK</b>
          </div>

          <p>
            ⚔️ Players <b>below 100M KP</b> who enter Top 10 will be fined.
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80">
            📌 <b>Everything outside Top 10 (Rank 11+)</b> is <b>FREE FOR ALL</b>
          </div>
        </section>

        {/* FINES */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-pink-500/10 border border-red-500/20 backdrop-blur-md shadow-[0_0_40px_rgba(239,68,68,0.1)] space-y-4">
          <h2 className="text-2xl font-semibold text-red-400">💰 Penalties & Fines</h2>

          <p className="text-sm text-white/80">
            ‼️ Fine in <b>GOLD per GH reward obtained</b>
          </p>

          <div className="space-y-2 text-[15px]">
            <p>🥇 1st offense → <b>25M gold / GH</b></p>
            <p>🥈 2nd offense → <b>50M gold / GH</b></p>
            <p>🥉 3rd offense → <b>100M gold / GH</b></p>
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 font-semibold">
            ❌ No 4th offense
          </div>

          <div className="text-sm space-y-1 text-white/80">
            <p>📌 <b>Minimum fine: 100M gold</b></p>
            <p>❌ Not paying = ZERO</p>
          </div>
        </section>

        {/* PAYMENT RULES */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-yellow-500/10 border border-orange-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(251,191,36,0.08)] space-y-4">
          <h2 className="text-2xl font-semibold text-orange-300">⏳ Payment Rules</h2>

          <p>
            📢 After fines are announced by the <b>King</b>:
          </p>

          <ul className="space-y-2">
            <li>⏱️ You have <b>48 hours</b> to pay</li>
            <li>🏙️ A <b>48h cooldown marker</b> will be placed on your city</li>
            <li>📸 You must send <b>proof (screenshots)</b> to Harley or R5</li>
          </ul>
        </section>

        {/* IMPORTANT */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-400/5 to-cyan-500/10 border border-blue-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.08)] space-y-4">
          <h2 className="text-2xl font-semibold text-blue-300">📊 Important Notes</h2>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-200">
            ⚠️ <b>MGE and 20GH offenses STACK</b>
          </div>

          <p>
            Violations from both events are <b>combined into one progression</b>.
          </p>

          <p className="text-sm text-white/80">
            Offenses may be removed over time depending on activity, KvK contribution, behavior, and how old they are.
          </p>
        </section>

        {/* EXAMPLE */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-indigo-500/10 border border-violet-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(139,92,246,0.08)] space-y-4">
          <h2 className="text-2xl font-semibold text-violet-300">📚 Example</h2>

          <p>
            👉 Player with <b>&lt;100M KP</b> gets <b>Rank 1</b> (20 GH reward):
          </p>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            💰 Fine = <b>25M × 20GH = 500M gold</b>
          </div>

          <p>
            👉 Player gets <b>Rank 4–10</b> (example 4 GH):
          </p>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            💰 Fine = <b>25M × 4GH = 100M gold</b>
          </div>
        </section>

        {/* FINAL */}
        <section className="text-center">
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/40 text-red-300 font-bold">
            ‼️ NO EXCUSES • NO EXCEPTIONS ‼️
          </div>
        </section>

      </div>
    </AppSidebar>
  );
}
