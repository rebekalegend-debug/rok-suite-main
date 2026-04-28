'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, RefreshCw, Crosshair, Skull, LogOut, Target } from 'lucide-react';

type Player = {
  governorId: number;
  name: string;
  honor: number;
  lastUpdated: string;
  rank: number;
};

type SortField = 'name' | 'honor' | 'rank';

export default function HonorPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const KINGDOMS = [2554, 2500, 3237];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const results: Player[] = [];

      for (const kd of KINGDOMS) {
        const res = await fetch(
          `https://statsmasterdatahub.com/api/honor-rankings/${kd}?kvk_number=c13131`
        );

        const json = await res.json();

        const list = json.players || [];

        list.forEach((p: any, index: number) => {
          results.push({
            governorId: Number(p.governor_id || p.id || index),
            name: p.name || "Unknown",
            honor: Number(p.honor || p.points || 0),
            lastUpdated: p.last_updated || p.updated_at || "",
            rank: Number(p.rank || index + 1),
          });
        });
      }

      setPlayers(results);
      setLastRefreshed(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    return players
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        String(p.governorId).includes(search)
      )
      .sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (sortField) {
          case 'name': aVal = a.name; bVal = b.name; break;
          case 'honor': aVal = a.honor; bVal = b.honor; break;
          case 'rank': aVal = a.rank; bVal = b.rank; break;
        }

        if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });
  }, [players, search, sortField, sortDir]);

  const stats = useMemo(() => {
    return {
      total: players.length,
      totalHonor: players.reduce((sum, p) => sum + p.honor, 0),
    };
  }, [players]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir(field === 'name' ? 'asc' : 'desc');
    }
  };

  const formatNumber = (v: number) => {
    if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + 'B';
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K';
    return v.toString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Crosshair className="text-red-500" />
          <div>
            <h1 className="text-xl font-bold">Honor Rankings</h1>
            <p className="text-sm opacity-60">{stats.total} players</p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="p-4 border rounded-xl">
          <Target size={16} />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs opacity-60">Players</p>
        </div>

        <div className="p-4 border rounded-xl">
          <Skull size={16} />
          <p className="text-2xl font-bold">{formatNumber(stats.totalHonor)}</p>
          <p className="text-xs opacity-60">Total Honor</p>
        </div>

        <div className="p-4 border rounded-xl">
          <LogOut size={16} />
          <p className="text-2xl font-bold">Live</p>
          <p className="text-xs opacity-60">API Data</p>
        </div>

        <div className="p-4 border rounded-xl">
          <Crosshair size={16} />
          <p className="text-2xl font-bold">Kvk</p>
          <p className="text-xs opacity-60">Ranking</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 opacity-50" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-sm">
              <th>#</th>
              <th onClick={() => toggleSort('rank')}>Rank</th>
              <th>ID</th>
              <th onClick={() => toggleSort('name')}>Name</th>
              <th onClick={() => toggleSort('honor')}>Honor Points</th>
              <th>Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">Loading...</td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p.governorId} className="border-b hover:bg-white/5">
                  <td>{i + 1}</td>
                  <td>{p.rank}</td>
                  <td>{p.governorId}</td>
                  <td>{p.name}</td>
                  <td className="text-right">{formatNumber(p.honor)}</td>
                  <td>{p.lastUpdated ? new Date(p.lastUpdated).toLocaleString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="text-center text-xs mt-4 opacity-60">
        {lastRefreshed && `Last refreshed: ${lastRefreshed.toLocaleTimeString()}`}
      </div>

    </div>
  );
}
