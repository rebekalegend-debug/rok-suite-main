'use client';

import { AppSidebar } from '@/components/AppSidebar';

export default function KvkStatsPage() {
  return (
    <AppSidebar>
      <div className="h-screen flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--background-card)]">
          <div className="text-sm text-amber-400 font-medium">
            KvK Stats (ROKSTATS)
          </div>

          <button
            onClick={() =>
              window.open('https://app.rokstats.online/kvk/ranking', '_blank')
            }
            className="text-xs px-3 py-1 rounded bg-amber-500 text-black font-semibold hover:brightness-110"
          >
            Open in new tab
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative">

          {/* TRY iframe */}
          <iframe
            src="https://app.rokstats.online/kvk/ranking"
            className="w-full h-full border-0"
          />

          {/* FALLBACK overlay (if blocked) */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-center pointer-events-none">
            <div className="space-y-4 pointer-events-auto">
              <p className="text-white text-sm">
                ROKSTATS cannot be embedded.
              </p>

              <button
                onClick={() =>
                  window.open('https://app.rokstats.online/kvk/ranking', '_blank')
                }
                className="px-5 py-2 rounded-lg bg-amber-500 text-black font-semibold"
              >
                Open KvK Stats
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppSidebar>
  );
}
