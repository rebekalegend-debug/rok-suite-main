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
    ⚠️ <b>Mandatory requirement:</b> Reach at least <b>90% of your required points</b> before Stage 6 (Kill Event ends).
  </div>

  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80">
    📌 <b>Important:</b> Rank order is ALWAYS more important than point limits.
    <br />
    You cannot overtake someone (without permission) just because they didn’t reach their cap.
  </div>

  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
    <p className="text-red-300 font-semibold">❗ If you are not willing or not ready to meet these requirements, you will face penalties including but not limited to:</p>
    <ul className="list-disc ml-5 space-y-1 text-sm">
      <li>Your rank will be taken by another ranked member!</li>
      <li>Being blacklisted (not banned, but deprioritized in future MGE's)</li>
      <li>Receiving lower placements in future MGEs and events</li>
    </ul>
  </div>
</section>

        {/* UNRANKED RULES */}
     <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-400/5 to-cyan-500/10 border border-blue-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.08)] space-y-4">
  <h2 className="text-2xl font-semibold text-blue-300">⚔️ Unranked Rules</h2>

  <p>
    ‼️ Point limit: <b>5M TOTAL for the entire week</b> (not per day).
  </p>

  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-200">
    ⚠️ <b>Rule:</b> Points over 5M ≤ 1M = 1M!
  </div>

  <p>
    📈 If you exceed 5M cap by less than 1 million points, even slightly, the fine will be calculated as if you exceeded by 1 million points.
  </p>
  <p>
    📈 If you exceed by more than 1 million points, the fine will be based on the actual excess.
  </p>
  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80">
    💬 If unsure or have any questions → <b>ASK BEFORE acting</b> to avoid penalties.
  </div>

  <p>⚖️ Maintain fair competition at all times.</p>
</section>
        {/* EXAMPLES */}
 <section className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-indigo-500/10 border border-violet-400/20 backdrop-blur-md shadow-[0_0_40px_rgba(139,92,246,0.08)] space-y-4">
  <h2 className="text-2xl font-semibold text-violet-300">📚 Ranked Examples</h2>

  <div className="space-y-3 text-sm leading-relaxed">

    <p>
      👉 Rank 2 (10M point limit) & Rank 3 (9M):
      <br />
      Rank 3 can exceed 9M as long as he stay below Rank 2.
    </p>

    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      ⭐ <b>Rule:</b> Limits exist, but <b>rank order is what matters.</b>
    </div>

    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      ⭐ <b>Rule:</b> When MGE ends, the final rankings must match the original rankings that were announced at the beginning.
    </div>

    <p>
      🚨 If a cap breaker pushes you down:
      <br />
      Rank 3 have 10M points limit and get pushed to Rank 4 because a "Cap Breaker" took hes rank with 11M points,
      <br />
      he can exceed 10M to push the "cap breaker" down, but he must stay below Rank 2.
    </p>

    <p>
      Rank 5 have 10M points limit, but drop to Rank 6 because a "Cap Breaker" stole Rank 1, only Rank 2 is allowed to break hes limit to reclaim hes Rank 1. After that, Rank 3 can break cap to push the "Cap Breaker" from Rank 2, and so on down the line.
    </p>

    <p>
      Rank 1 has 30m limit<br />
      (You)Rank 2 has a 20M limit.<br />
      Rank 1 currently has 19M points<br />
      You are currently Rank 2 with 18M points.
    </p>

    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      ‼️Even if you reach 20M (your limit), you cannot overtake Rank 1 while they still hold 19M — because Limit &lt; actual rank points.
    </div>

    <p>
      If you have Rank 2 with a limit of 20m points, and a cap breaker breaks the point limit, comes and accumulates 30 million points, you drop down to rank 3, you will have to necessarily exceed the 30 million point to recover your rank 2, if you are not willing to do it, another ranked member in the order (in this case rank 3) will get your spot and push down the cap breaker from rank 2!
    </p>

    <p>
     ‼️ Be aware that permission is needed for rank 3, to stole rank in this case!
    </p>

    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
     ⚖️ This ensures flexibility while keeping things under control. But need teamwork!
   </div>

  </div>
</section>

   {/* FINES */}
        <section className="relative p-6 rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-pink-500/10 border border-red-500/20 backdrop-blur-md shadow-[0_0_40px_rgba(239,68,68,0.1)] space-y-4">
          <h2 className="text-2xl font-semibold text-red-400">💰 Penalties & Fines</h2>

          <div className="space-y-2 text-[15px]">
            <p>🥇 1st offense → <b>500 rss for EACH point over</b></p>
            <p>🥈 2nd offense → <b>1000 rss for EACH point over</b></p>
            <p>🥉 3rd offense → <b>2000 rss for EACH point over</b> + council review</p>
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 font-semibold">
            ❌ No 4th offense
          </div>

          <div className="text-sm space-y-1 text-white/80">
            <p>📌 <b>The lowest fine you can get is 500M ress!</b></p>
            <p>❌ Not paying = ZERO</p>
            <p>⚠️ Points over 5M ≤ 1M = 1M!</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/40 text-red-300 font-bold text-center">
            ‼️ NO EXCUSES • NO EXCEPTIONS ‼️
          </div>

          <p className="text-s text-[var(--text-secondary)]">
           Offense points may be erased with time, depends on how many you have allready, rank stole or just cap break was, how old is your offense, your KvK contribution, activity, behavior, etc...
          </p>
        </section>

      </div>
    </AppSidebar>
  );
}
