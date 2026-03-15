'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, BarChart3, Table, TrendingUp, GitCompareArrows } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

type TabType = 'table' | 'charts' | 'comparison';
const VALID_TABS: TabType[] = ['table', 'charts', 'comparison'];

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


  
  
  // URL-synced tab
  const rawTab = searchParams.get('tab');
  const activeTab: TabType = VALID_TABS.includes(rawTab as TabType) ? (rawTab as TabType) : 'table';
  const setActiveTab = useCallback((tab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'table') params.delete('tab');
    else params.set('tab', tab);
    const qs = params.toString();
    router.push(qs ? `?${qs}` : '/kingdom/kingdom-stats', { scroll: false });
  }, [searchParams, router]);

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

data.sort((a,b)=>a.name.localeCompare(b.name))

return data

},[members,search])
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
} 02:00 UTC`

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

      {/* Tab toggle */}
      <div className="flex rounded-lg border border-[var(--border)] overflow-hidden mb-6 w-fit">
        <button
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2 text-sm flex items-center gap-1.5 transition-colors ${activeTab === 'table' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background-card)] text-[var(--text-secondary)] hover:text-[var(--foreground)]'}`}
        >
          <Table size={16} /> Table
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2 text-sm flex items-center gap-1.5 transition-colors ${activeTab === 'charts' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background-card)] text-[var(--text-secondary)] hover:text-[var(--foreground)]'}`}
        >
          <TrendingUp size={16} /> Charts
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 text-sm flex items-center gap-1.5 transition-colors ${activeTab === 'comparison' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background-card)] text-[var(--text-secondary)] hover:text-[var(--foreground)]'}`}
        >
          <GitCompareArrows size={16} /> Comparison
        </button>
      </div>

      {/* ═══ TABLE VIEW ═══ */}
      {activeTab === 'table' && (
        <>
          {/* Table controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <select
       value={selectedKingdom}
onChange={e => setSelectedKingdom(Number(e.target.value))}
              className="px-3 py-2 rounded-lg bg-[var(--background-card)] border border-[var(--border)] text-[var(--foreground)] text-sm"
            >
             
             {KINGDOMS.map(k => (
<option key={k} value={k}>KD {k}</option>
))}
            </select>

        

            <div className="relative flex-1 min-w-[200px] max-w-[300px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search player..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--background-card)] border border-[var(--border)] text-[var(--foreground)] text-sm placeholder:text-[var(--text-muted)]"
              />
            </div>
          </div>

          {/* Summary cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

<GlowCard
title="All Members"
value={members.length}
sub={`${formatCompact(members.reduce((a,b)=>a+b.power,0))} total power`}
color="yellow"
/>

<GlowCard
title="Recently Migrated In"
value={members.filter(m=>{
if(!m.migratedIn) return false
return new Date(m.migratedIn).getTime() > Date.now()-604800000
}).length}
sub="last 7 days"
color="orange"
/>

<GlowCard
title="Recently Migrated Out"
value={members.filter(m=>{
if(!m.migratedOut) return false
return new Date(m.migratedOut).getTime() > Date.now()-604800000
}).length}
sub="last 7 days"
color="red"
/>

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
<tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
<th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">#</th>
<th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">ID</th>
<th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">Name</th>
<th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">Mig. In</th>
<th className="px-3 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">Mig. Out</th>
                      </tr>
                    </thead>
                  <tbody>
{paged.map((m, i) => (
<tr key={m.id}>
<td>{page * rowsPerPage + i + 1}</td>
<td>{m.id}</td>

<td className="flex items-center gap-2">

{m.name}

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
<div key={i} className="text-[var(--foreground)]">
{n}
</div>
))}

</div>

</div>
)}

</td>

<td title={m.migratedIn || ""}>
{formatRelative(m.migratedIn)}
</td>

<td title={m.migratedOut || ""}>
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
        </>
      )}

      {/* ═══ COMPARISON VIEW ═══ */}
      {activeTab === 'comparison' && (
        <div className="space-y-4">
          {/* Date selector */}
          <div className="flex items-center gap-3">
          
            <span className="text-sm text-[var(--text-muted)]">
              {comparisonRows.length} kingdom{comparisonRows.length !== 1 ? 's' : ''} compared
            </span>
          </div>

          {/* Comparison table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] overflow-hidden">
            {loadingComparison ? (
              <div className="p-12 text-center text-[var(--text-muted)]">Loading...</div>
            ) : comparisonRows.length === 0 ? (
              <div className="p-12 text-center text-[var(--text-muted)]">No data for this date</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-10">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Kingdom</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Total Power</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Kill Points</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Gathered</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Helps</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Deaths</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={row.kingdom_id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors">
                        <td className="px-4 py-3 text-[var(--text-muted)] font-medium">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-[var(--foreground)]">
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: KD_COLORS[kingdoms.indexOf(row.kingdom_id) % KD_COLORS.length] }}
                          />
                          KD {row.kingdom_id}
                        </td>
                        <td className="px-4 py-3 text-right text-indigo-400 font-semibold tabular-nums">{row.total_power.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-red-400 tabular-nums">{row.total_kill.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-emerald-400 tabular-nums">{row.total_collect.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-amber-400 tabular-nums">{row.total_help.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-[var(--text-muted)] tabular-nums">{row.total_dead.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums">{row.member_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ CHARTS VIEW ═══ */}
      {activeTab === 'charts' && (
        <div className="space-y-4">
          {/* Chart controls */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Kingdom multi-select */}
              <div>
                <div className="text-xs text-[var(--text-muted)] mb-2">Kingdoms</div>
                <div className="flex gap-2">
                  {kingdoms.map((k, i) => (
                    <button
                      key={k}
                      onClick={() => toggleChartKingdom(k)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors font-medium ${
                        chartKingdoms.has(k)
                          ? 'border-transparent text-white'
                          : 'border-[var(--border)] text-[var(--text-muted)]'
                      }`}
                      style={chartKingdoms.has(k) ? { backgroundColor: KD_COLORS[i % KD_COLORS.length] } : {}}
                    >
                      KD {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric selector */}
              <div>
                <div className="text-xs text-[var(--text-muted)] mb-2">Metric</div>
                <div className="flex gap-2">
                  {METRICS.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setChartMetric(m.key)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        chartMetric === m.key
                          ? 'border-transparent text-white'
                          : 'border-[var(--border)] text-[var(--text-muted)]'
                      }`}
                      style={chartMetric === m.key ? { backgroundColor: m.color } : {}}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date range */}
              <div>
                <div className="text-xs text-[var(--text-muted)] mb-2">Date Range</div>
                <div className="flex items-center gap-2">
                  <select
                    value={chartDateFrom}
                    onChange={e => setChartDateFrom(e.target.value)}
                    className="px-2 py-1.5 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] text-xs"
                  >
                    <option value="">All (from)</option>
                    {allChartDates.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span className="text-[var(--text-muted)] text-xs">to</span>
                  <select
                    value={chartDateTo}
                    onChange={e => setChartDateTo(e.target.value)}
                    className="px-2 py-1.5 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] text-xs"
                  >
                    <option value="">All (to)</option>
                    {allChartDates.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              {METRICS.find(m => m.key === chartMetric)?.label || 'Trend'} — Top 400
            </h2>

            {loadingAggregates ? (
              <div className="h-80 flex items-center justify-center text-[var(--text-muted)]">Loading...</div>
            ) : chartData.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-[var(--text-muted)]">No historical data yet</div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="dt"
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      tickFormatter={(d: string) => d.slice(5)}
                    />
                    <YAxis
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      tickFormatter={formatCompact}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--background-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--foreground)',
                      }}
                      formatter={(value?: number) => formatCompact(value ?? 0)}
                      labelFormatter={(label: string) => `Date: ${label}`}
                    />
                    <Legend />
                    {sortedChartKingdomIds.map((k, i) => (
                      <Line
                        key={k}
                        type="monotone"
                        dataKey={`KD ${k}`}
                        name={`KD ${k}`}
                        stroke={KD_COLORS[i % KD_COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {chartData.length > 0 && (
              <div className="mt-4 text-xs text-[var(--text-muted)]">
                {chartData.length} dates &middot; {chartKingdomIds.length} kingdom{chartKingdomIds.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}
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
yellow:"from-yellow-500/20 to-yellow-500/5 border-yellow-500/30",
orange:"from-orange-500/20 to-orange-500/5 border-orange-500/30",
red:"from-red-500/20 to-red-500/5 border-red-500/30"
}

return(

<div className={`rounded-xl border p-4 bg-gradient-to-br ${colors[color]}`}>

<div className="text-xs text-[var(--text-muted)] mb-1">
{title}
</div>

<div className="text-2xl font-bold">
{value}
</div>

<div className="text-xs text-[var(--text-muted)]">
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

