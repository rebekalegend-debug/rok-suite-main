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
<section className="p-6 rounded-2xl bg-gradient-to-br from-[#FFD700]/10 via-[#FFC300]/5 to-[#FFB800]/10 border border-[#FFD700]/20 backdrop-blur-md shadow-[0_0_40px_rgba(255,215,0,0.08)] space-y-4">
  <h2 className="text-2xl font-semibold text-[#FFD700]">👑 Ranked Rules</h2>

  <ul className="space-y-2">
    <li>❌ <b>Do NOT steal ranks</b> from other ranked members.</li>
    <li>⚖️ Maintain <b>fair competition</b> within the alliance.</li>
    <li>⚡ If your rank is stolen → you may <b>break your cap</b> to recover it.</li>
    <li>🚨 If a <b>cap breaker</b> appears → you MUST exceed them to protect ranking.</li>
    <li>🕒 Be <b>online in final hours</b> of MGE to secure your position.</li>
  </ul>

  <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFE066]">
    ⚠️ <b>Mandatory:</b> Reach at least <b>90% of your required points</b> before Stage 6 (Kill Event ends).
  </div>

  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80">
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
     <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-400/5 to-cyan-500/10 border border-blue-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.08)] space-y-4">
  <h2 className="text-2xl font-semibold text-blue-300">⚔️ Unranked Rules</h2>

  <p>
    📊 Point limit: <b>5M TOTAL for the entire week</b> (not per day).
  </p>

  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-200">
    ⚠️ <b>Rule:</b> If you exceed by ≤1M → it counts as <b>1M full penalty</b>.
  </div>

  <p>
    📈 If you exceed by more than 1M → penalty is based on full excess.
  </p>

  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80">
    💬 If unsure → <b>ASK BEFORE acting</b> to avoid penalties.
  </div>

  <p>⚖️ Maintain fair competition at all times.</p>
</section>
        {/* EXAMPLES */}
  <section className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-indigo-500/10 border border-violet-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(139,92,246,0.08)] space-y-4">
  <h2 className="text-2xl font-semibold text-violet-300">📚 Ranked Examples</h2>

  <div className="space-y-3 text-sm leading-relaxed">

    <p>
      👉 Rank 2 (10M) vs Rank 3 (9M):
      <br />
      Rank 3 can exceed 9M as long as they stay below Rank 2.
    </p>

    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
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

    <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-yellow-200">
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
