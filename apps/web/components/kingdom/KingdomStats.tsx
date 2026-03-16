'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { Clock } from "lucide-react"

type SortField = 'name';
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
  const searchParams = useSearchParams();
  const router = useRouter();
const KINGDOMS = [3237, 2554, 2500];
const kingdoms = KINGDOMS;
 type Member = {
 id:string
 name:string
 power:number
 prevNames:string[]
 migratedOut:string | null
 migratedIn:string | null
 lastSeen:string | null
}

const [members,setMembers] = useState<Member[]>([])
const [loadingMembers,setLoadingMembers] = useState(true)

  // Table state
  const [selectedKingdom, setSelectedKingdom] = useState<number>(3237);
React.useEffect(()=>{

async function loadMembers(){

setLoadingMembers(true)

const res = await fetch(`/api/top-kingdom?kingdom=${selectedKingdom}`)
const data = await res.json()

setMembers(Array.isArray(data) ? data : [])
setLoadingMembers(false)

}

loadMembers()

},[selectedKingdom])
  const [search, setSearch] = useState('');
  const [filterMode,setFilterMode] = useState<'all'|'in'|'out'>('all')
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

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

 React.useEffect(() => { setPage(0); }, [search, selectedKingdom, sortField, sortDir]);

  // Sort & filter (already limited to top 400 by the hook)
const filtered = useMemo(() => {

let data = [...members]

if(search){
const q = search.toLowerCase()

data = data.filter(m =>
m.name.toLowerCase().includes(q) ||
m.id.toString().includes(q)
)
}

if(filterMode === 'in'){
data = data.filter(m => m.migratedIn)
}

if(filterMode === 'out'){
data = data.filter(m => m.migratedOut)
}

data.sort((a,b)=>{

if(sortField === 'name'){

const res = a.name.localeCompare(b.name)

return sortDir === 'asc' ? res : -res

}

return 0

})

return data

},[members,search,filterMode,sortField,sortDir])
// ADD IT HERE ↓↓↓

const dataUpdated = useMemo(() => {

if(members.length === 0) return null

let latest = 0

for(const m of members){

if(!m.lastSeen) continue

const t = new Date(m.lastSeen).getTime()

if(t > latest) latest = t

}

if(!latest) return null

const d = new Date(latest)

return `${d.getUTCFullYear()}/${
String(d.getUTCMonth()+1).padStart(2,'0')
}/${
String(d.getUTCDate()).padStart(2,'0')
} 03:30 UTC`

},[members])

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

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
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
     <div className="mb-6 flex items-start justify-between">

<div>
<h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
<BarChart3 size={28} className="text-green-500" />
Kingdom Stats
</h1>

<p className="text-sm text-[var(--text-muted)] mt-1">
Top 400 member statistics from Lilith Game Tools
</p>
</div>

<div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
<Clock size={14} />
<span>
{dataUpdated
? `Data updated on ${dataUpdated}`
: "Loading status..."
}
</span>
</div>

</div>

     

   

          {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

<div
onClick={()=>setFilterMode('all')}
className={`cursor-pointer ${filterMode==='all' ? 'ring-2 ring-yellow-500/40' : ''}`}
>
<GlowCard
title="All Members"
value={members.length}
sub={`${formatCompact(members.reduce((a,b)=>a+b.power,0))} total power`}
color="yellow"
/>

</div>

<div onClick={()=>setFilterMode('in')} className="cursor-pointer">

<GlowCard
title="Migrated In"
value={members.filter(m=>m.migratedIn).length}
sub="players"
color="orange"
/>

</div>
<div onClick={()=>setFilterMode('out')} className="cursor-pointer">

<GlowCard
title="Migrated Out"
value={members.filter(m=>m.migratedOut).length}
sub="players"
color="red"
/>

</div>

</div>

          {/* Table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-[var(--text-muted)]">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-[var(--text-muted)]">No data available</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                   <thead>
<tr className="border-b border-[var(--border)] bg-[var(--background-secondary)] text-xs uppercase tracking-wider">
<th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">#</th>
<th>ID</th>
<th onClick={()=>handleSort('name')} className="cursor-pointer flex items-center gap-1">
Name
{sortField === 'name' && (
sortDir === 'asc'
? <ChevronUp size={12}/>
: <ChevronDown size={12}/>
)}
</th>

<th>Power</th>
<th>Mig. In</th>
<th>Mig. Out</th>
                      </tr>
                    </thead>
                  <tbody>
{paged.map((m, i) => (
<tr key={m.id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition">

<td className="px-3 py-2">
{page * rowsPerPage + i + 1}
</td>

<td className="px-3 py-2 text-[var(--text-muted)]">
{m.id}
</td>

<td className="px-3 py-2 flex items-center gap-2">

<span className="font-medium">{m.name}</span>

{m.prevNames?.length > 0 && (
<div className="relative group flex items-center">

<Clock size={14} className="text-gray-400 hover:text-white transition cursor-pointer" />

<div className="absolute left-5 top-6 hidden group-hover:block z-50 
bg-[var(--background-card)] border border-[var(--border)] 
rounded-lg px-3 py-2 text-xs shadow-lg min-w-[140px]">

<div className="text-[var(--text-muted)] mb-1">
{m.prevNames.length} previous names
</div>

{m.prevNames.map((n,i)=>(
<div key={i}>{n}</div>
))}

</div>

</div>
)}

</td>

<td className="px-3 py-2 text-indigo-400 font-semibold">
{formatCompact(m.power)}
</td>

<td className="px-3 py-2" title={m.migratedIn || ""}>
{formatRelative(m.migratedIn)}
</td>

<td className="px-3 py-2" title={m.migratedOut || ""}>
{formatRelative(m.migratedOut)}
</td>

</tr>
))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <span>{filtered.length} of top 400</span>
                    <select
                      value={rowsPerPage}
                      onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                      className="px-2 py-1 rounded bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] text-xs"
                    >
                      {[25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded hover:bg-[var(--background-secondary)] disabled:opacity-30 text-[var(--text-secondary)]">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-3 py-1 text-sm text-[var(--foreground)]">{page + 1} / {totalPages || 1}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded hover:bg-[var(--background-secondary)] disabled:opacity-30 text-[var(--text-secondary)]">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
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

function formatRelative(date?:string | null){

if(!date) return "-"

const d = new Date(date)
const now = new Date()

const diff = (now.getTime() - d.getTime()) / 1000

const day = 86400

if(diff < day) return "today"

if(diff < day*7) return `${Math.floor(diff/day)} days ago`

if(diff < day*30) return `${Math.floor(diff/(day*7))} weeks ago`

if(diff < day*365) return `${Math.floor(diff/(day*30))} months ago`

return `${Math.floor(diff/(day*365))} years ago`

}

function GlowCard({title,value,sub,color}:{title:string,value:number,sub:string,color:string}){

const colors:any={
yellow:"border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.25)]",
orange:"border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.25)]",
red:"border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
}

return(

<div className={`rounded-xl border p-5 bg-[var(--background-card)] ${colors[color]} transition hover:scale-[1.02]`}>

<div className="text-xs text-[var(--text-muted)] mb-1">
{title}
</div>

<div className="text-3xl font-bold">
{value}
</div>

<div className="text-xs text-[var(--text-muted)] mt-1">
{sub}
</div>

</div>

)

}

function formatCompact(v:number){

  if(v>=1_000_000_000) return (v/1_000_000_000).toFixed(1)+"B"
  if(v>=1_000_000) return (v/1_000_000).toFixed(1)+"M"
  if(v>=1_000) return (v/1_000).toFixed(1)+"K"

  return v.toString()

}

