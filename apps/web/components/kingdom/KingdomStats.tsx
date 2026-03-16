'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ChevronUp, ChevronDown, BarChart3 } from 'lucide-react';
import { Clock } from "lucide-react"

type SortField = 'name' | 'id' | 'power' | 'in' | 'out';
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

let res = 0

if(sortField === 'name'){
res = a.name.localeCompare(b.name)
}

if(sortField === 'id'){
res = Number(a.id) - Number(b.id)
}

if(sortField === 'power'){
res = a.power - b.power
}

if(sortField === 'in'){
res = new Date(a.migratedIn || 0).getTime() - new Date(b.migratedIn || 0).getTime()
}

if(sortField === 'out'){
res = new Date(a.migratedOut || 0).getTime() - new Date(b.migratedOut || 0).getTime()
}

return sortDir === 'asc' ? res : -res

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

     
{/* Controls */}
<div className="flex flex-wrap items-center gap-3 mb-6">

<select
value={selectedKingdom}
onChange={e => setSelectedKingdom(Number(e.target.value))}
className="px-3 py-2 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] text-sm"
>
{KINGDOMS.map(k => (
<option key={k} value={k}>KD {k}</option>
))}
</select>

<div className="relative flex-1 min-w-[200px] max-w-[320px]">
<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />

<input
type="text"
placeholder="Search player..."
value={search}
onChange={e => setSearch(e.target.value)}
className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] text-sm"
/>

</div>

</div>



      

          {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

<div
onClick={()=>setFilterMode('all')}
className="cursor-pointer"
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
sub="Migrated in - Wake up - New accounts"
color="orange"
/>

</div>
<div onClick={()=>setFilterMode('out')} className="cursor-pointer">

<GlowCard
title="Migrated Out"
value={members.filter(m=>m.migratedOut).length}
sub="Migrated out - Went inactive - Disappeared from map"
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
                <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
         <table className="w-full text-sm will-change-transform">

<thead className="sticky top-0 z-20 bg-[var(--background-card)] backdrop-blur">

<tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider">

<th className="px-3 py-3 text-left">#</th>

<th
onClick={()=>handleSort('id')}
className="cursor-pointer px-3 py-3 text-left hover:text-white"
>
ID
{sortField === 'id' && (sortDir === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
</th>

<th
onClick={()=>handleSort('name')}
className="cursor-pointer px-3 py-3 text-left hover:text-white"
>
Name
{sortField === 'name' && (sortDir === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
</th>

<th
onClick={()=>handleSort('power')}
className="cursor-pointer px-3 py-3 text-left hover:text-white"
>
Power
{sortField === 'power' && (sortDir === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
</th>

<th
onClick={()=>handleSort('in')}
className="cursor-pointer px-3 py-3 text-left hover:text-white"
>
Mig. In
{sortField === 'in' && (sortDir === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
</th>

<th
onClick={()=>handleSort('out')}
className="cursor-pointer px-3 py-3 text-left hover:text-white"
>
Mig. Out
{sortField === 'out' && (sortDir === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
</th>

</tr>

</thead>
               <tbody className="divide-y divide-[var(--border)]">
{filtered.map((m, i) => (
<tr key={m.id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition">

<td className="px-3 py-2">
{i + 1}
</td>

<td className="px-3 py-2 text-[var(--text-muted)]">
<a
href={`https://app.rokstats.online/governor/${m.id}`}
target="_blank"
rel="noopener noreferrer"
className="text-blue-400 hover:text-blue-300 hover:underline"
  >
{m.id}
</a>
</td>

<td className="px-3 py-2">

<div className="flex items-center gap-2">

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

</div>

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

const styles:any={
yellow:"border-yellow-500/20 bg-yellow-500/5 shadow-yellow-500/20",
orange:"border-orange-500/20 bg-orange-500/5 shadow-orange-500/20",
red:"border-red-500/20 bg-red-500/5 shadow-red-500/30"
}

return(

<div className={`cursor-pointer rounded-xl border p-4 transition 
hover:scale-[1.02] shadow-lg ${styles[color]}`}>

<div className="flex items-center gap-2 mb-2">

<span className={`text-xs font-semibold uppercase tracking-wider`}>

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
function formatCompact(v:number){

  if(v>=1_000_000_000) return (v/1_000_000_000).toFixed(1)+"B"
  if(v>=1_000_000) return (v/1_000_000).toFixed(1)+"M"
  if(v>=1_000) return (v/1_000).toFixed(1)+"K"

  return v.toString()

}

