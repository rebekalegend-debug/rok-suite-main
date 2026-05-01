"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/kvk");

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Fetch error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-white bg-[#0b1220] min-h-screen">
        Loading KvK timeline...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400 bg-[#0b1220] min-h-screen">
        Error: {error}
      </div>
    );
  }

 const schedule = data?.evolutionChapters?.[0] || [];
  const altar = data?.kvkDetailsData?.altar;
  const ruins = data?.kvkDetailsData?.ruins;

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-[#111a2e] rounded-xl p-5 shadow">
        <h1 className="text-xl font-semibold">Event Timeline</h1>
        <p className="text-sm text-gray-400">
          Track KvK progression and kingdom milestones
        </p>

        <div className="mt-4 flex gap-2 overflow-x-auto">
          {schedule.map((s: any, i: number) => (
            <div
              key={i}
              className="min-w-[40px] h-[40px] rounded-full bg-yellow-500/30 flex items-center justify-center text-xs"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* PASS SECTION */}
      <div className="bg-[#111a2e] rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-3">Pass Opening Times</h2>

        <div className="space-y-2 text-sm">
          {schedule.slice(0, 6).map((p: any, i: number) => (
            <div
              key={i}
              className="flex justify-between bg-[#0f172a] p-3 rounded"
            >
              <span>Pass {p.pass || i + 1}</span>
              <span className="text-gray-400">{p.opensAt || "Locked"}</span>
              <span className="text-yellow-400">{p.status || "Premium Only"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ALTAR & RUINS */}
      <div className="bg-[#111a2e] rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-4">Altar & Ruins Schedule</h2>

        <div className="space-y-4 text-sm">
          <div className="bg-[#0f172a] p-4 rounded">
            <div className="flex justify-between">
              <span>Ancient Ruins</span>
              <span className="text-gray-400">
                {ruins?.nextWindow || "N/A"}
              </span>
            </div>
            <div className="text-green-400 mt-1">
              Remaining: {ruins?.remaining ?? "?"}
            </div>
            <div className="text-yellow-400">
              Max HP: {ruins?.maxHpGain ?? "?"}
            </div>
          </div>

          <div className="bg-[#0f172a] p-4 rounded">
            <div className="flex justify-between">
              <span>Altar of Darkness</span>
              <span className="text-gray-400">
                {altar?.nextWindow || "N/A"}
              </span>
            </div>
            <div className="text-green-400 mt-1">
              Remaining: {altar?.remaining ?? "?"}
            </div>
            <div className="text-yellow-400">
              Max HP: {altar?.maxHpGain ?? "?"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
