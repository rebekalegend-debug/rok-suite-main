import { AppSidebar } from '@/components/AppSidebar';

export default function MgeRulesPage() {
  return (
    <AppSidebar>
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">⚔️ MGE Rules</h1>
          <p className="text-[var(--text-secondary)]">
            Clear rules. Fair competition. No excuses.
          </p>
        </div>

        {/* RANKED RULES */}
        <section className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 space-y-4">
          <h2 className="text-2xl font-semibold text-red-400">👑 Ranked Rules</h2>

          <ul className="space-y-2">
            <li>❌ <b>Do NOT steal ranks</b> from other ranked members.</li>
            <li>⚖️ Maintain <b>fair competition</b> within the alliance.</li>
            <li>⚡ If your rank is stolen → you may <b>break your cap</b> to recover it.</li>
            <li>🚨 If a <b>cap breaker</b> appears → you MUST exceed them to protect ranking.</li>
            <li>🕒 Be <b>online in final hours</b> of MGE to secure your position.</li>
          </ul>

          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
            ⚠️ <b>Mandatory:</b> Reach at least <b>90% of your required points</b> before Stage 6 (Kill Event ends).
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
            📌 <b>Important:</b> Rank order is ALWAYS more important than point limits.
            <br />
            You cannot overtake someone just because they didn’t reach their cap.
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
            <p className="text-red-300 font-semibold">❗ If you fail requirements:</p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Your rank will be taken</li>
              <li>You may be blacklisted (deprioritized)</li>
              <li>Lower placements in future MGEs</li>
              <li>Heavy resource fines 💸</li>
            </ul>
          </div>
        </section>

        {/* UNRANKED RULES */}
        <section className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 space-y-4">
          <h2 className="text-2xl font-semibold text-blue-400">⚔️ Unranked Rules</h2>

          <p>
            📊 Point limit: <b>5M TOTAL for the entire week</b> (not per day).
          </p>

          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300">
            ⚠️ <b>Rule:</b> If you exceed by ≤1M → it counts as <b>1M full penalty</b>.
          </div>

          <p>
            📈 If you exceed by more than 1M → penalty is based on full excess.
          </p>

          <p>
            💬 If unsure → <b>ASK BEFORE acting</b> to avoid penalties.
          </p>

          <p>⚖️ Maintain fair competition at all times.</p>
        </section>

        {/* EXAMPLES */}
        <section className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-400">📚 Ranked Examples</h2>

          <div className="space-y-3 text-sm leading-relaxed">

            <p>
              👉 Rank 2 (10M) vs Rank 3 (9M):
              <br />
              Rank 3 can exceed 9M as long as they stay below Rank 2.
            </p>

            <div className="p-3 rounded-lg bg-white/5">
              ⭐ <b>Rule:</b> Limits exist, but <b>rank order is what matters.</b>
            </div>

            <p>
              🚨 If a cap breaker pushes you down:
              <br />
              You may exceed your limit to recover your position — but still respect higher ranks.
            </p>

            <p>
              🔁 Chain recovery:
              <br />
              Rank 2 fixes Rank 1 → Rank 3 fixes Rank 2 → etc.
            </p>

            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              ⚠️ Permission may be required when taking ranks in chain situations.
            </div>

            <p>
              ❌ Example:
              <br />
              Rank 1 = 19M, Rank 2 limit = 20M
              <br />
              You CANNOT pass Rank 1 even if under your limit.
            </p>

            <p>
              🚨 Extreme case:
              <br />
              Cap breaker hits 30M → you MUST exceed 30M to recover.
              <br />
              If not → next ranked player replaces you.
            </p>

          </div>
        </section>

        {/* FINES */}
        <section className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-red-500/10 border border-yellow-500/20 space-y-4">
          <h2 className="text-2xl font-semibold text-yellow-400">💰 Penalties & Fines</h2>

          <div className="space-y-2">
            <p>🥇 <b>1st offense:</b> 500 rss / point</p>
            <p>🥈 <b>2nd offense:</b> 1000 rss / point</p>
            <p>🥉 <b>3rd offense:</b> 2000 rss / point → Council review</p>
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-semibold">
            ❌ No 4th offense.
          </div>

          <div className="space-y-1 text-sm">
            <p>📌 Minimum fine: <b>500M resources</b></p>
            <p>❌ Not paying = <b>ZEROED</b></p>
            <p>⚠️ Points over 5M ≤ 1M = counted as 1M</p>
          </div>

          <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 font-semibold text-center">
            ‼️ NO EXCUSES • NO EXCEPTIONS ‼️
          </div>

          <p className="text-sm text-[var(--text-secondary)]">
            Offenses may be reduced over time depending on activity, KvK contribution,
            behavior, and history.
          </p>
        </section>

      </div>
    </AppSidebar>
  );
}
