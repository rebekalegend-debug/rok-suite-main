import { AppSidebar } from '@/components/AppSidebar';

export default function MgeRulesPage() {
  return (
    <AppSidebar>
      <div className="max-w-4xl mx-auto p-6 space-y-10">

        {/* TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">⚔️ MGE Rules</h1>
          <p className="text-[var(--text-secondary)]">
            Structured. Fair. Controlled.
          </p>
        </div>

        {/* RANKED RULES */}
        <section className="relative p-6 rounded-2xl bg-gradient-to-br from-yellow-400/10 via-amber-400/5 to-orange-400/10 border border-yellow-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(250,204,21,0.08)] space-y-4">
          <h2 className="text-2xl font-semibold text-yellow-300">👑 Ranked Rules</h2>

          <ul className="space-y-2 text-[15px]">
            <li>❌ <b>Do NOT steal ranks</b> from other ranked members.</li>
            <li>⚖️ Maintain <b>fair competition</b>.</li>
            <li>⚡ If your rank is stolen → you may <b>break your cap</b>.</li>
            <li>🚨 Cap breaker → <b>must be pushed down</b>.</li>
            <li>🕒 Be online in <b>final hours</b>.</li>
          </ul>

          <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-200">
            ⚠️ <b>Mandatory:</b> Reach at least <b>90%</b> before Kill Event ends.
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80">
            📌 <b>Core Rule:</b> <span className="text-yellow-300">Rank &gt; Points Limit</span>
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
            ❗ Failing rules leads to: rank loss • blacklist • lower priority • fines
          </div>
        </section>

        {/* UNRANKED RULES */}
        <section className="relative p-6 rounded-2xl bg-gradient-to-br from-sky-400/10 via-cyan-400/5 to-blue-500/10 border border-blue-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.08)] space-y-4">
          <h2 className="text-2xl font-semibold text-blue-300">⚔️ Unranked Rules</h2>

          <p className="text-[15px]">
            📊 Limit: <b>5M TOTAL (weekly)</b>
          </p>

          <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-200">
            ⚠️ Exceed ≤1M → counted as <b>1M full penalty</b>
          </div>

          <p className="text-[15px]">
            📈 Above 1M → penalty = real excess
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80">
            💬 Ask before acting if unsure
          </div>

          <p className="text-[15px]">⚖️ Keep competition fair</p>
        </section>

        {/* EXAMPLES */}
        <section className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-400/10 via-indigo-400/5 to-violet-500/10 border border-purple-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.08)] space-y-4">
          <h2 className="text-2xl font-semibold text-purple-300">📚 Ranked Examples</h2>

          <div className="space-y-3 text-sm leading-relaxed">

            <p>
              Rank 2 (10M) vs Rank 3 (9M) → Rank 3 may exceed but stay below Rank 2
            </p>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              ⭐ <b>Key:</b> Rank order defines outcome
            </div>

            <p>
              Cap breaker → exceed limit to recover rank
            </p>

            <p>
              Chain fix: Rank 2 → Rank 1, Rank 3 → Rank 2, etc.
            </p>

            <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-yellow-200">
              ⚠️ Permission may be required
            </div>

            <p>
              ❌ You cannot pass someone just because you hit your cap
            </p>

            <p>
              🚨 Extreme: If breaker hits 30M → you must exceed 30M
            </p>

          </div>
        </section>

        {/* FINES */}
        <section className="relative p-6 rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-pink-500/10 border border-red-500/20 backdrop-blur-md shadow-[0_0_40px_rgba(239,68,68,0.1)] space-y-4">
          <h2 className="text-2xl font-semibold text-red-400">💰 Penalties & Fines</h2>

          <div className="space-y-2 text-[15px]">
            <p>🥇 1st → <b>500 rss / point</b></p>
            <p>🥈 2nd → <b>1000 rss / point</b></p>
            <p>🥉 3rd → <b>2000 rss / point</b> + council review</p>
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 font-semibold">
            ❌ No 4th offense
          </div>

          <div className="text-sm space-y-1 text-white/80">
            <p>📌 Minimum: <b>500M resources</b></p>
            <p>❌ Not paying = ZERO</p>
            <p>⚠️ ≤1M excess = counted as 1M</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/40 text-red-300 font-bold text-center">
            ‼️ NO EXCUSES • NO EXCEPTIONS ‼️
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            Offenses may decay based on behavior, KvK contribution, and time.
          </p>
        </section>

      </div>
    </AppSidebar>
  );
}
