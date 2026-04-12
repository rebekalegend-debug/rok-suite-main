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
        .filter(p => 
  normalize(p.name).includes(q) ||
  p.id.toLowerCase().includes(q)
)
        .slice(0, 10)
    )
  }, [search, players])

  return (
    <AppSidebar>
      <div className="max-w-4xl mx-auto p-6 space-y-10">

        {/* TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">🏆 20GH Rules</h1>
          <p className="text-[var(--text-secondary)]">
          
            For any questions pm Harley Quinn!
          </p>
        </div>

        {/* TOP 10 RULES */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-[#FFD700]/10 via-[#FFC300]/5 to-[#FFB800]/10 border border-[#FFD700]/20 space-y-4">
          <h2 className="text-2xl font-semibold text-[#FFD700]">👑 Top 10 Rules</h2>

          <p>🔒 <b>Top 10 is LIMITED</b></p>

          <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFE066]">
            ✅ <b>Requirement:</b> Minimum <b>100M KP in last KvK</b>
          </div>

      

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80">
            📌 Players <b>below 100M KP</b> who enter Top 10 will be fined.
          </div>
        </section>

        {/* RANKED MEMBERS */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-amber-400/5 to-orange-500/10 border border-yellow-400/20 space-y-4">
          <h2 className="text-2xl font-semibold text-yellow-300">🏅 Ranked Members (Top 10)</h2>

          <div className="space-y-1 text-sm">
            <p>🥇 Rank 1 → <b>Unlimited</b></p>
            <p>🥈 Rank 2 → <b>400k / 40k</b></p>
            <p>🥉 Rank 3 → <b>300k / 30k</b></p>
            <p>🏅 Rank 4–10 → <b>250k / 20k</b></p>
          </div>
        </section>

        {/* RANKED RULES */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-violet-500/10 border border-indigo-400/20 space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">👑 Ranked Rules</h2>

          <ul className="space-y-2 text-sm">
            <li>❌ Do NOT steal ranks from other ranked members.</li>
            <li>⚖️ Maintain fair competition within the alliance.</li>
            <li>⚡ If your rank is stolen → you may break your cap to recover it.</li>
            <li>🚨 If a cap breaker appears → you MUST exceed them.</li>
            <li>🕒 Be online in final hours.</li>
          </ul>

          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-400/30 text-yellow-200 font-semibold">
            ⚠️ Rank order is ALWAYS more important than caps.
          </div>
        </section>

        {/* UNRANKED RULES */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-gray-500/10 via-zinc-500/5 to-slate-500/10 border border-gray-400/20 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-300">⚔️ Unranked Rules</h2>

          <ul className="space-y-2 text-sm">
            <li>⏱️ Max <b>10k</b> speedups</li>
            <li>⚡ Power upgrade cap: <b>200k</b></li>
          </ul>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/30 text-blue-200 text-sm">
            ❗ If unsure → <b>ASK BEFORE acting</b>
          </div>
        </section>

        {/* FINES */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-pink-500/10 border border-red-500/20 space-y-4">
          <h2 className="text-2xl font-semibold text-red-400">💰 Penalties & Fines</h2>

          <p className="text-sm text-white/80">
            Fine in <b>GOLD per GH reward</b>
          </p>

          <div className="space-y-2 text-sm">
            <p>🥇 1st offense → <b>25M / GH</b></p>
            <p>🥈 2nd offense → <b>50M / GH</b></p>
            <p>🥉 3rd offense → <b>100M / GH</b></p>
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 font-semibold">
            ❌ No 4th offense
          </div>

          <div className="text-sm text-white/80">
            📌 Minimum fine: <b>100M gold</b>
          </div>

          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30 text-yellow-200 text-sm">
            ⚠️ If you break <b>200k / 10k</b> as unranked BUT don’t steal rank:
            <br />
            ✔️ ≥100M KP → <b>NO fine</b><br />
            ❌ &lt;100M KP → <b>FINED</b>
          </div>
        </section>

        {/* PAYMENT */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-yellow-500/10 border border-orange-400/20 space-y-4">
          <h2 className="text-2xl font-semibold text-orange-300">⏳ Payment Rules</h2>

          <ul className="space-y-2 text-sm">
            <li>⏱️ 48h to pay</li>
            <li>🏙️ 48h city marker</li>
            <li>📸 Send proof to Harley</li>
          </ul>
        </section>

        {/* IMPORTANT */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-400/5 to-cyan-500/10 border border-blue-400/20 space-y-4">
          <h2 className="text-2xl font-semibold text-blue-300">📊 Important Notes</h2>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-200">
            ⚠️ MGE and 20GH offenses STACK
          </div>

          <p className="text-sm text-white/80">
            Offenses may be removed over time based on activity and behavior.
          </p>
        </section>

        {/* EXAMPLE */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-indigo-500/10 border border-violet-400/20 space-y-4">
          <h2 className="text-2xl font-semibold text-violet-300">📚 Example</h2>

          <p>👉 If you are unranked and get Rank 1:</p>

          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            💰 25M × 20GH = <b>500M gold</b>
          </div>

          <p>👉 If you get Rank 4–10:</p>

          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            💰 25M × 4GH = <b>100M gold</b>
          </div>
        </section>

        {/* SEARCH */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 border border-purple-400/20 space-y-4">

          <h2 className="text-2xl font-semibold text-purple-300">
            Fast lookup (or check{" "}
            <a
              href="https://app.rokstats.online/kvk/ranking"
              target="_blank"
              className="underline"
            >
              Rokstats
            </a>)
          </h2>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          {loading && <p className="text-sm text-white/60">Loading...</p>}

          {results.map(p => {
            const kvk = kvkContributionPercent(p.kvkContribution)

            return (
              <div key={p.id} className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex justify-between">
                  <div>
  <div className="font-semibold">{p.name}</div>
  <div className="text-xs text-white/50">ID: {p.id}</div>
  <div className="text-xs text-white/50">
    {p.kvkContribution.toLocaleString()} KP
  </div>
</div>
                 <span
  className={
    kvk.color === "green"
      ? "text-green-400"
      : kvk.color === "yellow"
      ? "text-yellow-400"
      : kvk.color === "orange"
      ? "text-orange-400"
      : "text-red-400"
  }
>
  {kvk.label}
</span>
                </div>

                {p.kvkContribution < 100_000_000 && (
                  <div className="text-red-400 text-xs mt-1">
                    🚨 Will be fined in Top 10
                  </div>
                )}
              </div>
            )
          })}
        </section>

        {/* FINAL */}
        <section className="text-center">
          <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold">
            ‼️ NO EXCUSES • NO EXCEPTIONS ‼️
          </div>
        </section>

      </div>
    </AppSidebar>
  )
}
