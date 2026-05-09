'use client';

import React, { useState, useMemo } from 'react';

import { Search, Star } from 'lucide-react';

type SortField = 'name' | 'rank' | 'total';
type SortDir = 'asc' | 'desc';

const METRICS = [
  { key: 'total_power', label: 'Total Power', color: '#818cf8' },
  { key: 'total_kill', label: 'Kill Points', color: '#f87171' },
  { key: 'total_collect', label: 'Resources', color: '#34d399' },
  { key: 'total_help', label: 'Helps', color: '#fbbf24' },
] as const;

// Color palette for multi-KD lines
const KD_COLORS = ['#818cf8', '#f87171', '#34d399', '#fbbf24', '#fb923c', '#a78bfa'];

type TabType = 'table';

export default function KingdomStats() {
 
 
const KINGDOMS = [3237, 2554, 2500];
const kingdoms = KINGDOMS;
type Member = {
  id: string
  name: string

  rank: number

  stage1: number
  stage2: number
  stage3: number

  total: number
}

const [members,setMembers] = useState<Member[]>([])
const [loadingMembers,setLoadingMembers] = useState(true)
const [kvkMap, setKvkMap] = useState<Record<string, string[]>>({})
const [selectedKvk, setSelectedKvk] = useState("")
const cleanMembers = useMemo(() => {
  return members.filter(m => m.id && m.id !== "0")
}, [members])

const snapshotMembers = cleanMembers


  
  // Table state
  const [selectedKingdom, setSelectedKingdom] = useState<number>(3237);
React.useEffect(() => {
  if (!selectedKvk) return

  async function loadMembers() {
    try {
      setLoadingMembers(true)

      const res = await fetch(
       `https://statsmasterdatahub.com/api/dashboard/${selectedKvk}/prekvk-rankings?kd=${selectedKingdom}`

      )

      const json = await res.json()

    const players = json.data || []

const mapped = players.map((p: any, index: number) => ({
  id: String(p.governor_id),

  name: p.name,

  rank: index + 1,

  stage1: Number(p.stage1_points || 0),
  stage2: Number(p.stage2_points || 0),
  stage3: Number(p.stage3_points || 0),

  total: Number(p.total_points || 0),
}))

      setMembers(mapped)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMembers(false)
    }
  }

  loadMembers()
}, [selectedKingdom, selectedKvk])
React.useEffect(() => {
  const list = kvkMap[String(selectedKingdom)] || []

  if (list.length > 0) {
    setSelectedKvk(list[0])
  }
}, [selectedKingdom, kvkMap])
  
  const [search, setSearch] = useState('');
  const [filterMode,setFilterMode] = useState<'all'|'current'|'in'|'out'>('all')
const [sortField, setSortField] = useState<SortField>('total');
const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Chart state
  const [chartKingdoms, setChartKingdoms] = useState<Set<number>>(new Set());
 const [chartMetric, setChartMetric] = useState<string>('total_power');
  const [chartDateFrom, setChartDateFrom] = useState<string>('');
  const [chartDateTo, setChartDateTo] = useState<string>('');

  // Comparison state
  const [comparisonDate, setComparisonDate] = useState<string>('');
const aggregates:any[] = [];
const compAggregates:any[] = [];
const loadingAggregates = false;
const loadingComparison = false;
const chartKingdomIds = useMemo(
  () => Array.from(chartKingdoms),
  [chartKingdoms]
)



React.useEffect(() => {
  async function loadKvks() {
    try {
      const res = await fetch("/api/kvks")
      const json = await res.json()

      setKvkMap(json)

      const first = json[String(selectedKingdom)]?.[0]

      if (first) {
        setSelectedKvk(first)
      }
    } catch (err) {
      console.error(err)
    }
  }

  loadKvks()
}, [])
  
  // Sort & filter (already limited to top 400 by the hook)
const filtered = useMemo(() => {

let data = [...cleanMembers]

// 🔍 SEARCH
  if (search) {
    const q = search.toLowerCase()
    data = data.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.id.toString().includes(q)
    )
  }

if (filterMode === 'current') {
  // keep all (API has no migration info)
}


  // 🔄 DEFAULT SORT (for all / current)
  data.sort((a, b) => {

    let res = 0

 if (sortField === 'rank') {
  res = a.rank - b.rank
}

if (sortField === 'total') {
  res = a.total - b.total
}
    return sortDir === 'asc' ? res : -res
  })

  return data

}, [cleanMembers, search, filterMode, sortField, sortDir])





const currentMembers = cleanMembers
  
const paged = filtered
 const handleSort = (field: SortField) => {

if(sortField === field){
setSortDir(d => d === 'asc' ? 'desc' : 'asc')
}else{
setSortField(field)
setSortDir('desc')
}

}

  const toggleChartKingdom = (k: number) => {
    setChartKingdoms(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };

  // Pivot aggregates for multi-KD chart: { dt, "KD 3921": value, "KD 4041": value }
const chartData = useMemo(() => {

  const byDate = new Map<string, Record<string, any>>();

  for (const agg of aggregates) {

    const row = byDate.get(agg.dt) || { dt: agg.dt } as Record<string, any>

    row[`KD ${agg.kingdom_id}`] = agg[chartMetric]

    byDate.set(agg.dt,row)

  }

  return Array.from(byDate.values()).sort(
    (a,b)=> String(a.dt).localeCompare(String(b.dt))
  )

},[aggregates,chartMetric])

  // Chart kingdom IDs sorted by latest total power (desc)
  const sortedChartKingdomIds = useMemo(() => {
    if (aggregates.length === 0) return chartKingdomIds;
    // Get latest date per kingdom, sum power
    const latestPower = new Map<number, number>();
    const latestDate = new Map<number, string>();
    for (const a of aggregates) {
      const prev = latestDate.get(a.kingdom_id);
      if (!prev || a.dt > prev) {
        latestDate.set(a.kingdom_id, a.dt);
        latestPower.set(a.kingdom_id, a.total_power);
      }
    }
    return [...chartKingdomIds].sort((a, b) => (latestPower.get(b) || 0) - (latestPower.get(a) || 0));
  }, [chartKingdomIds, aggregates]);

  // Get all dates across all kingdoms for date range selectors
  const allChartDates = useMemo(() => {
    const s = new Set(aggregates.map(a => a.dt));
    return Array.from(s).sort();
  }, [aggregates]);

  // Comparison ranking data: one row per kingdom, sorted by total power desc
  const comparisonRows = useMemo(() => {
    if (compAggregates.length === 0) return [];
    // Filter to the selected comparison date (should already be filtered, but be safe)
    const forDate = comparisonDate
      ? compAggregates.filter(a => a.dt === comparisonDate)
      : compAggregates;
    // One row per kingdom
    const byKd = new Map<number, any>();
    for (const a of forDate) {
      // If multiple dates, take the latest
      if (!byKd.has(a.kingdom_id)) byKd.set(a.kingdom_id, a);
    }
    return Array.from(byKd.values()).sort((a, b) => b.total_power - a.total_power);
  }, [compAggregates, comparisonDate]);

 const isLoading = loadingMembers;

return (
<div className="min-h-screen w-full px-4 lg:px-8">
  <div className="w-full">
{/* Header */}
<div className="mb-6 flex flex-col items-center text-center w-full">

  {/* Title */}
  <div className="flex flex-col items-center text-center">
    <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2 justify-center">
      <Star size={28} className="text-yellow-400" />
      Honor Rankings
    </h1>

<p className="text-sm text-[var(--text-muted)] mt-1">
Track honor ranking for 3237, 2554 and 2500!
  <br />
  Last few and current KvK's!
</p>

<p className="text-xs text-[var(--text-muted)] opacity-70 mt-1">
Scan will auto run daily in every kingdom and updates data.
<br />
Data for current KvK will appear avaible after ingame honor ranking become avaible!
</p>

  </div>
</div>

{/* Controls */}
<div className="flex flex-wrap items-center gap-3 mb-6">

  {/* KD */}
  <div className="flex items-center gap-2">
    <span className="text-xs text-[var(--text-muted)]">Select KD</span>

    <select
      value={selectedKingdom}
      onChange={e => setSelectedKingdom(Number(e.target.value))}
      className="px-3 py-2.5 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-sm"
    >
      {KINGDOMS.map(k => (
        <option key={k} value={k}>
          KD {k}
        </option>
      ))}
    </select>
  </div>

  {/* KvK */}
  <div className="flex items-center gap-2">
    <span className="text-xs text-[var(--text-muted)]">Select KvK</span>

    <select
      value={selectedKvk}
      onChange={e => setSelectedKvk(e.target.value)}
      className="px-3 py-2.5 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-sm"
    >
      {(kvkMap[String(selectedKingdom)] || []).map((kvk: string) => (
        <option key={kvk} value={kvk}>
          {kvk}
        </option>
      ))}
    </select>
  </div>

  {/* Search */}
  <div className="relative flex-1 min-w-[200px]">
    <Search
      size={16}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
    />

    <input
      type="text"
      placeholder="Search player..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-sm"
    />
  </div>

</div>

          {/* Table */}
        <div>
            {isLoading ? (
              <div className="p-12 text-center text-[var(--text-muted)]">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-[var(--text-muted)]">No data available</div>
            ) : (
             <>
  {/* 🔥 MOBILE VIEW (PUT THIS FIRST) */}
  <div className="md:hidden space-y-3">
    {filtered.map((m, i) => (
      <div
        key={m.id}
        className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-4 shadow-sm"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-[var(--foreground)]">
            {m.name}
          </div>

          <span className="text-[10px] px-2 py-1 rounded-lg border border-yellow-500/40 text-yellow-400">
            #{i + 1}
          </span>
        </div>

        {/* ID */}
        <div className="text-xs text-[var(--text-muted)] mb-1">
          ID:{" "}
          <a
            href={`https://app.rokstats.online/governor/${m.id}`}
            target="_blank"
            className="text-cyan-400"
          >
            {m.id}
          </a>
        </div>

        {/* Power */}
   <div className="text-sm text-[var(--foreground)] mb-1">
  👑 Total: {formatCompact(m.total)}
</div>

      
      </div>
    ))}
  </div>

 
                
            <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full">

<thead className="sticky top-0 z-10 bg-[var(--background-card)]">
<tr className="border-b border-[var(--border)]">

<th className="px-3 py-3 text-center text-xs text-[var(--text-muted)]">Rank</th>
<th className="px-3 py-3 text-center text-xs text-[var(--text-muted)]">Name</th>
<th className="px-3 py-3 text-center text-xs text-[var(--text-muted)]">Stage I</th>
<th className="px-3 py-3 text-center text-xs text-[var(--text-muted)]">Stage II</th>
<th className="px-3 py-3 text-center text-xs text-[var(--text-muted)]">Stage III</th>
<th className="px-3 py-3 text-center text-xs text-[var(--text-muted)]">👑 Total</th>

</tr>
</thead>
              <tbody>
{filtered.map((m, i) => (
<tr key={m.id} className="border-b border-[var(--border)]">

<td className="px-3 py-2 text-center">
  {m.rank}
</td>

<td className="px-3 py-2 text-center">
  {m.name}
</td>

<td className="px-3 py-2 text-center">
  {formatCompact(m.stage1)}
</td>

<td className="px-3 py-2 text-center">
  {formatCompact(m.stage2)}
</td>

<td className="px-3 py-2 text-center">
  {formatCompact(m.stage3)}
</td>

<td className="px-3 py-2 text-center font-mono">
  {formatCompact(m.total)}
</td>

</tr>
))}
</tbody>
</table>
</div>

</>
)}

</div>
</div>
    </div>
 
);

}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-4">
      <div className="text-xs text-[var(--text-muted)] mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function formatCompact(v:number){

  if(v >= 1_000_000_000) {
    return (v / 1_000_000_000).toFixed(1) + "B"
  }

  if(v >= 1_000_000) {
    return (v / 1_000_000).toFixed(1) + "M"
  }

  if(v >= 1_000) {
    return (v / 1_000).toFixed(1) + "K"
  }

  return v.toString()
}

function GlowCard({
title,
value,
sub,
color,
icon:Icon
}:{title:string,value:number,sub:string,color:string,icon:any}){

const styles:any={
green:"border-green-500/20 bg-green-500/5 shadow-green-500/20",
yellow:"border-yellow-500/20 bg-yellow-500/5 shadow-yellow-500/20",
orange:"border-orange-500/20 bg-orange-500/5 shadow-orange-500/20",
red:"border-red-500/20 bg-red-500/5 shadow-red-500/30"
}
const titleColors:any={
green:"text-green-400",
yellow:"text-yellow-400",
orange:"text-orange-400",
red:"text-red-400"
}
return(

<div className={`cursor-pointer rounded-xl border p-4 transition 
hover:scale-[1.02] shadow-lg ${styles[color]}`}>

<div className="flex items-center gap-2 mb-2">

<Icon size={16} className={titleColors[color]} />

<span className={`text-xs font-semibold uppercase tracking-wider ${titleColors[color]}`}>
{title}
</span>

</div>

<p className="text-2xl font-bold text-[var(--foreground)]">
{value}
</p>

<p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
{sub}
</p>

</div>

)
}
