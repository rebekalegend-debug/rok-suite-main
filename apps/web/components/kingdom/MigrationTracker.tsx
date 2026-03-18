'use client';
import { History } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, RefreshCw, Lock, ExternalLink, Crosshair, X, Info, ChevronDown, ChevronUp, Undo2, Target, Skull, LogOut } from 'lucide-react';
import { fetchMgeViolationsSheet, fetchKingdomMembersSheet } from '@/lib/kingdom/parse';
import { 
  MGE_VIOLATION_SHEET_URL, 
  MGE_VIOLATION_SHEET_EDIT_URL,
  PREV_NAMES_SHEET_URL
} from '@/lib/kingdom/config';
import { matchesSearch } from '@/lib/search';
import { AlertCircle } from "lucide-react";
import { Radar } from "lucide-react";
import { fetchPrevNamesSheet } from '@/lib/kingdom/parse';
const VIOLATION_OPTIONS = ['First', 'Second', 'Third', 'KD Break'];

type WantedPlayer = {
  governorId: number;
  name: string;
  power: number;

  violation?: string[];
  handled?: string;
  notes?: string;

  // 🔥 ADD THIS
  rowIndex?: number;

  zero?: "" | "yes" | "no";
  zeroed?: "" | "yes" | "no" | "left";
  display?: boolean;

  prevNames?: string;
};


import { ADMIN_PASSWORD, OFFICER_PASSWORD } from '@/lib/auth-passwords';


/** Format power — sheet stores values in millions (e.g. 28 = 28M) */
const formatPower = (val: number): string => {
  if (!val) return "-";

  if (val >= 1_000_000_000) {
    return Math.round(val / 1_000_000_000) + "B";
  }

  if (val >= 1_000_000) {
    return Math.round(val / 1_000_000) + "M";
  }

  if (val >= 1_000) {
    return Math.round(val / 1_000) + "K";
  }

  return val.toString();
};

/** Format summed power (raw power values) */
const formatTotalPower = (val: number): string => {
  if (!val) return '0';

  if (val >= 1_000_000_000_000)
    return (val / 1_000_000_000_000).toFixed(2) + 'T';

  if (val >= 1_000_000_000)
    return (val / 1_000_000_000).toFixed(2) + 'B';

  if (val >= 1_000_000)
    return (val / 1_000_000).toFixed(1) + 'M';

  if (val >= 1_000)
    return (val / 1_000).toFixed(0) + 'K';

  return val.toString();
};

// ─── Sort types ────────────────────────────────────────────────────
type SortableField = 'name' | 'governorId' | 'power' | 'reason' | 'handled';

interface SortRule {
  field: SortableField;
  direction: 'asc' | 'desc';
}

const DEFAULT_SORT_RULES: SortRule[] = [
  { field: 'handled', direction: 'asc' },
  { field: 'power', direction: 'desc' },
];

const SORT_FIELD_LABELS = {
  name: 'Name',
  governorId: 'Gov ID',
  power: 'Power',
  reason: 'Reason',
  handled: 'Handled',
};

export default function WantedList() {
  const [players, setPlayers] = useState<WantedPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string | null>(null);

const [openMenu, setOpenMenu] = useState<{
  type: 'violation' | 'handled';
  id: number;
  x: number;
  y: number;
} | null>(null);
  
  const [filterMode, setFilterMode] = useState<'all' | 'violators' | 'wanted' | 'left'>('all');
const [allMembers, setAllMembers] = useState<any[]>([]);

  // Sort state
  const [sortRules, setSortRules] = useState<SortRule[]>(DEFAULT_SORT_RULES);

  // Officer mode (can change handled status)
const [prevNamesMap, setPrevNamesMap] = useState<Map<number, string>>(new Map());
  // Admin mode (can see sheet link) — admin also gets officer privileges
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');


const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null);
  setPlayers([]);
  try {
 const [wantedPlayers, prevMap, members] = await Promise.all([
  fetchMgeViolationsSheet(MGE_VIOLATION_SHEET_URL),
  fetchPrevNamesSheet(PREV_NAMES_SHEET_URL),
  fetchKingdomMembersSheet("https://docs.google.com/spreadsheets/d/1ZUf-qCCvZ5N6qU_hCNHXQ1z-6qxhn36PucYOxbaXIv0/export?format=csv&gid=693046633"),
]);

setAllMembers(members);
setPrevNamesMap(prevMap); // ✅ correct

const merged: WantedPlayer[] = wantedPlayers.map((p: any) => ({
  governorId: p.governorId,
  name: p.name,
  power: p.power || 0,

violation: (() => {
  if (!p.violation) return [];

  if (typeof p.violation === "string") {
    return p.violation
      .split(",")
      .map((v: string) => v.trim())
      .filter((v: string) => v && v !== "-" && v.toLowerCase() !== "no action");
  }

  if (Array.isArray(p.violation)) {
    return p.violation.filter(
      (v: string) => v && v !== "-" && v.toLowerCase() !== "no action"
    );
  }

  return [];
})(),

  handled: p.handled || 'No action',
  notes: p.notes || '',

  rowIndex: p.rowIndex,

  zero: p.zero || '',
  zeroed: p.zeroed || '',
  display: p.display !== false,

  // ✅ IMPORTANT FIX
  prevNames: prevMap.get(p.governorId) || ""
}));
   setPlayers([...merged]); // 🔥 FORCE NEW ARRAY
    setLastRefreshed(new Date());

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load');
  } finally {
    setLoading(false);
  }
}, []);
  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

 useEffect(() => {
  const close = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // ❌ ignore clicks inside dropdown or input
    if (target.closest('.menu') || target.closest('input')) return;

    setOpenMenu(null);
  };

  window.addEventListener('click', close);
  return () => window.removeEventListener('click', close);
}, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordPrompt(false);
      setPassword('');
    } else if (password === OFFICER_PASSWORD) {
      setShowPasswordPrompt(false);
      setPassword('');
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

 


  const removeSortRule = (field: SortableField) => {
    const remaining = sortRules.filter(r => r.field !== field);
    setSortRules(remaining.length > 0 ? remaining : DEFAULT_SORT_RULES);
  };
const handleSort = (field: SortableField, multi: boolean) => {
  setSortRules(prev => {
    const existing = prev.find(r => r.field === field);

    if (!multi) {
      if (!existing) return [{ field, direction: 'asc' }];
      return [{ field, direction: existing.direction === 'asc' ? 'desc' : 'asc' }];
    }

    if (!existing) {
      return [...prev, { field, direction: 'asc' }];
    }

    return prev.map(r =>
      r.field === field
        ? { ...r, direction: r.direction === 'asc' ? 'desc' : 'asc' }
        : r
    );
  });
};
 const resetFiltersAndSort = () => {
  setSortRules(DEFAULT_SORT_RULES);
  setReasonFilter(null);
  setFilterMode('all');
  setSearch('');
};

 const handledOrder = (status: string): number => {
  if (status === 'No action' || status === 'Pending') return 0;
  if (status === 'On wanted list') return 1;
  if (status === 'Left') return 2;
  return 0;
};

  const zeroOrder = (val: 'yes' | 'no' | ''): number => {
    switch (val) {
      case 'yes': return 0;
      case 'no': return 1;
      default: return 2;
    }
  };

const violationScore = (v?: string[]) => {
  if (!v || v.length === 0) return 0;

  if (v.includes('KD Break')) return 4;
  if (v.includes('Third')) return 3;
  if (v.includes('Second')) return 2;
  if (v.includes('First')) return 1;

  return 0;
};

  // Only visible players (display !== false)
const visiblePlayers = useMemo(
  () => players.filter(p => p.display !== false),
  [players]
);
const filtered = useMemo(() => {
  let list: WantedPlayer[] = [];

  // ✅ NORMAL USERS
  if (!isAdmin) {
    list = [...players];
  }

  // ✅ ADMIN NO SEARCH
  else if (!search) {
    list = [...players];
  }

  // ✅ ADMIN SEARCH
  else {
    const lower = search.toLowerCase();

    const playerMap = new Map(players.map(p => [p.governorId, p]));

    const matchedMembers = allMembers.filter((m: any) => {
      const name = (m.name || m.player_name || "").toLowerCase();
      const id = String((m.governorId ?? m.id) || "");
      return name.includes(lower) || id.includes(lower);
    });

    list = matchedMembers.map((m: any) => {
      const id = Number(m.governorId ?? m.id);

      if (playerMap.has(id)) {
        return playerMap.get(id)!;
      }

    return {
  governorId: id,
  name: m.name ?? m.player_name,
  power: m.power ?? 0,
  violation: [],
  handled: 'No action',
  notes: '',
  display: true,
  prevNames: prevNamesMap.get(id) || ""
};
    });
  }

  // ✅ FILTER (OUTSIDE CONDITIONS)
  const filteredList = list.filter(p => {
    if (search.trim().length > 0) {
      if (!matchesSearch(search, p.name, p.governorId)) return false;
    }

    if (!search && reasonFilter && !p.violation?.includes(reasonFilter)) return false;

    const handled = p.handled || 'No action';

if (!search && filterMode !== 'all') {

  // 🟠 VIOLATORS → ONLY players with real violations
  if (filterMode === 'violators') {
    if (!Array.isArray(p.violation) || p.violation.length === 0) return false;
  }

  // 🔴 WANTED
  else if (filterMode === 'wanted') {
    if ((p.handled || 'No action') !== 'On wanted list') return false;
  }

  // 🔵 LEFT
  else if (filterMode === 'left') {
    if ((p.handled || 'No action') !== 'Left') return false;
  }
}

    return true;
  });

  // ✅ SORT
  return [...filteredList].sort((a, b) => {
    for (const rule of sortRules) {
      let aVal: any;
      let bVal: any;

      switch (rule.field) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;

        case 'governorId':
          aVal = a.governorId || 0;
          bVal = b.governorId || 0;
          break;

        case 'power':
          aVal = a.power || 0;
          bVal = b.power || 0;
          break;

        case 'handled':
          aVal = handledOrder(a.handled || 'No action');
          bVal = handledOrder(b.handled || 'No action');
          break;

        case 'reason':
          aVal = violationScore(a.violation);
          bVal = violationScore(b.violation);
          break;

        default:
          continue;
      }

      if (aVal < bVal) return rule.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return rule.direction === 'asc' ? 1 : -1;
    }

    return 0;
  });

}, [players, allMembers, prevNamesMap, search, reasonFilter, filterMode, sortRules, isAdmin]);


  
  const stats = useMemo(() => {
  let pendingCount = 0, pendingPower = 0;
  let zeroedCount = 0, zeroedPower = 0;
  let leftCount = 0;
  let toZeroCount = 0, toZeroPower = 0;

for (const p of players) {
    const s = p.handled || 'No action';
    const power = p.power || 0;

const hasViolation =
  Array.isArray(p.violation) &&
  p.violation.filter((v: string) => v && v !== '-' && v.toLowerCase() !== 'no action').length > 0;

if (hasViolation) {
  pendingCount++;
  pendingPower += power;
}

    if (s === 'On wanted list') {
      zeroedCount++;
      zeroedPower += power;

      toZeroCount++;
      toZeroPower += power;
    }

    if (s === 'Left') {
      leftCount++;
    }
  }

  return {
    total: players.length,
    pendingCount,
    pendingPower,
    zeroedCount,
    zeroedPower,
    leftCount,
    toZeroCount,
    toZeroPower,
  };
}, [filtered]);
  
  
  const duplicateNames = useMemo(() => {
  const map = new Map<string, number>();

  for (const p of filtered) {
    const name = (p.name || '').toLowerCase().trim();
    map.set(name, (map.get(name) || 0) + 1);
  }

  const duplicates = new Set<string>();
  for (const [name, count] of map) {
    if (count > 1) duplicates.add(name);
  }

  return duplicates;
}, [filtered]);
  // Unique reasons for filter chips
 




 const handledBg = (status: string) => {
  if (status === 'On wanted list') return 'bg-red-500/10 border-red-500/30 text-red-400';
  if (status === 'Left') return 'bg-sky-500/10 border-sky-500/30 text-sky-400';
  return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
};

  // Instructions toggle
  const [showInstructions, setShowInstructions] = useState(false);

  // Sort icon component
  const SortIcon = ({ field }: { field: SortableField }) => {
    const ruleIndex = sortRules.findIndex(r => r.field === field);
    const isActive = ruleIndex >= 0;
    const rule = isActive ? sortRules[ruleIndex] : null;
    const Icon = rule?.direction === 'desc' ? ChevronDown : ChevronUp;
    const showPriority = sortRules.length > 1 && isActive;

    return (
      <span className="inline-flex items-center gap-0.5">
        <Icon className={`w-3.5 h-3.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-30'}`} />
        {showPriority && (
          <span className="text-[9px] text-[var(--text-muted)] opacity-60">
            {ruleIndex + 1}
          </span>
        )}
      </span>
    );
  };

const hasActiveFilters =
  search || reasonFilter || filterMode !== 'all'
  || JSON.stringify(sortRules) !== JSON.stringify(DEFAULT_SORT_RULES);

  // Sortable header helper
  const SortHeader = ({ field, label, align = 'left' }: { field: SortableField; label: string; align?: 'left' | 'right' | 'center' }) => (
    <th className={`text-${align} px-3 py-2 sm:py-3`}>
      <button
        onClick={(e) => handleSort(field, e.shiftKey)}
        title="Click to sort, Shift+click to add secondary sort"
        className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors ${align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''}`}
      >
        {label} <SortIcon field={field} />
      </button>
    </th>
  );

const toggleViolation = (player: any, value: string) => {
 
  let current = player.violation || [];

  if (current.includes(value)) {
    current = current.filter((v: string) => v !== value);
  } else {
    if (current.length >= 2) return;
    current = [...current, value];
  }

  const updated = {
    governorId: player.governorId,
    name: player.name,
    power: player.power || 0,
    violation: current,
    handled: player.handled || 'No action',
    notes: player.notes || ''
  };

 savePlayer(updated, { violation: current });
};


const deletePlayer = async (player: any) => {
  await fetch('/api/violation-save', {
    method: 'POST',
body: JSON.stringify({
  id: player.governorId, 
  delete: true
})
  });

  setPlayers(prev =>
    prev.filter(p => p.governorId !== player.governorId)
  );
};

  
const savePlayer = async (player: any, updates: any) => {
  const updated = { ...player, ...updates };

  // 🔥 CLEAN HERE (FRONTEND FIX)
  const cleanNumber = (v: any) =>
    Number(String(v ?? "").replace(/[^0-9]/g, "") || 0);

  await fetch('/api/violation-save', {
    method: 'POST',
    body: JSON.stringify({
      rowIndex: updated.rowIndex,

      id: cleanNumber(updated.governorId),   // ✅ FIX
      name: updated.name,

      power: cleanNumber(updated.power),     // ✅ FIX

      violation: updated.violation?.join(',') || '',
      handled: updated.handled || '',
      notes: updated.notes || ''
    })
  });

  setPlayers(prev => {
    const exists = prev.find(p => p.governorId === updated.governorId);

    if (!exists) return [updated, ...prev];

    return prev.map(p =>
      p.governorId === updated.governorId ? updated : p
    );
  });
};
  return (
    
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/20">
  <Radar className="w-6 h-6 text-red-400" />
</div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white-400">
  Violation Track
</h1>
            <p className="text-sm text-[var(--text-muted)]">
               MGE & 20GH violation track list ({stats.total} players)
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
         
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:bg-gray-800/40 disabled:text-gray-500"          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          {!isAdmin && (
            <button
              onClick={() => setShowPasswordPrompt(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              <Lock size={16} />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
          {isAdmin && (
            <a
             href={MGE_VIOLATION_SHEET_EDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Edit Sheet</span>
            </a>
          )}
        </div>
      </div>

    
      {/* Officer/Admin mode banner */}
      {isAdmin && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <Lock size={14} />
            <span className="font-medium">{isAdmin ? 'Admin Mode' : 'Officer Mode'}</span>
            <span className="hidden sm:inline text-amber-400/60">&mdash; Mark players as zeroed or left kingdom</span>
          </div>
          <button
           onClick={() => setIsAdmin(false)}
            className="text-amber-400/60 hover:text-amber-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Dashboard cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
         
          
            {/* ALL MEMBERS */}
        <div
 onClick={() => {
  setFilterMode('all');
}}
  className="cursor-pointer rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 hover:bg-yellow-500/10 transition shadow-lg shadow-yellow-500/20"
>
            <div className="flex items-center gap-2 mb-2">
              <Radar size={16} className="text-yellow-400" />
             <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
  ALL MEMBERS
</span>
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
            <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">{formatTotalPower(
  players.reduce((sum, p) => sum + (p.power || 0), 0)
)}</p>
            <p className="text-[10px] text-[var(--text-muted)]">total power</p>
          </div>
          
          
          {/* Pending */}
          <div
onClick={() => {
  setFilterMode('violators'); // keep if you want
  setReasonFilter(null);       // optional
}}
  className="cursor-pointer rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 hover:bg-orange-500/10 transition shadow-lg shadow-orange-500/20"
>
            <div className="flex items-center gap-2 mb-2">
              <Crosshair size={16} className="text-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">Violators</span>
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.pendingCount}</p>
            <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">{formatTotalPower(stats.pendingPower)}</p>
            <p className="text-[10px] text-[var(--text-muted)]">total power</p>
          </div>

         {/* On Wanted List */}
<div
  onClick={() => {
    setFilterMode('wanted');
  }}
className="cursor-pointer rounded-xl border border-red-500/20 bg-red-500/5 p-4 hover:bg-red-500/10 transition shadow-lg shadow-red-500/30"
  >
  <div className="flex items-center gap-2 mb-2">
    <Skull size={16} className="text-red-400" />
    <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
      On Wanted List
    </span>
  </div>

  <p className="text-2xl font-bold text-[var(--foreground)]">
    {stats.toZeroCount}
  </p>

  <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
    {formatTotalPower(stats.toZeroPower)}
  </p>

  <p className="text-[10px] text-[var(--text-muted)]">total power</p>
</div>

  

          {/* Left Kingdom */}
          <div
  onClick={() => {
 setFilterMode('left');
   
}}
className="cursor-pointer rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 hover:bg-sky-500/10 transition shadow-lg shadow-sky-500/20">
            <div className="flex items-center gap-2 mb-2">
              <LogOut size={16} className="text-sky-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Left</span>
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.leftCount}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">migrated out</p>
          </div>
        </div>
      )}

      {/* Search + filters */}
  <div className="space-y-3 mb-4">
  {/* Search row */}
  <div className="flex flex-col sm:flex-row gap-2 relative">
    <div className="relative flex-1">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or governor ID..."
        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-red-500/50"
      />
    </div>

    {hasActiveFilters && (
      <button
        onClick={resetFiltersAndSort}
        className="px-3 py-2.5 rounded-xl text-sm font-medium bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors whitespace-nowrap"
      >
        Reset
      </button>
    )}
  </div>

    

     {/* Sort chain display */}
  {JSON.stringify(sortRules) !== JSON.stringify(DEFAULT_SORT_RULES) && (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-[var(--text-muted)]">Sorted by:</span>
      {sortRules.map((rule, idx) => (
        <span key={rule.field} className="inline-flex items-center">
          {idx > 0 && <span className="mx-1 text-[var(--text-muted)]">&rarr;</span>}
          <button
            onClick={() => removeSortRule(rule.field)}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            {SORT_FIELD_LABELS[rule.field]}
            {rule.direction === 'asc' ? '↑' : '↓'}
            <X className="w-3 h-3 ml-0.5" />
          </button>
        </span>
      ))}
    </div>
  )}
</div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center py-12 text-[var(--text-muted)]">Loading wanted list...</div>
      )}
      {error && (
        <div className="text-center py-12 text-red-400">{error}</div>
      )}

      {/* Desktop table */}
      {!loading && !error && (
      <div className="hidden md:block overflow-x-auto relative z-0">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[var(--background-card)]">
             <tr className="border-b border-[var(--border)]">
  <th className="px-3 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
    #
  </th>
  <SortHeader field="name" label="Name" align="left" />
                <SortHeader field="governorId" label="ID" align="center" />
<SortHeader field="power" label="Power" align="center" />
                
             {/* <SortHeader field="alliance" label="Alliance" /> */}
                <SortHeader field="reason" label="Violation" align="center" />
                
                <SortHeader field="handled" label="Handled" align="center" />
              <th className="text-center px-3 py-2">Notes</th>
              {isAdmin && (
  <th className="text-center px-3 py-2 sm:py-3">
    Actions
  </th>
)}
               


             
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                 <td colSpan={isAdmin ? 8 : 7} className="px-3 py-8 text-center text-sm text-[var(--text-muted)]">
                    {hasActiveFilters ? 'No players match filters' : 'No wanted players'}
                  </td>
                </tr>
              ) : (
                filtered.map((player, idx) => {
                  const handled = player.handled || 'No action';
                  const isDone = handled !== 'Pending' && handled !== 'No action';
                
                  return (
                  <tr
  key={player.governorId || player.name}
  className={`border-b border-[var(--border)] hover:bg-[var(--background-secondary)]/50 transition-colors ${idx % 2 === 0 ? 'bg-[var(--background-secondary)]/30' : ''} ${isDone ? 'opacity-50' : ''}`}
>
                     <td className="px-3 py-2.5 text-xs text-[var(--text-muted)] font-mono text-center">
  {idx + 1}
</td>
              <td className="px-3 py-2.5 text-center">
  <div className="flex items-center gap-1 justify-center">
    <span className={`font-medium text-sm ${
      isDone
        ? 'line-through text-[var(--text-muted)]'
        : 'text-[var(--foreground)]'
    }`}>
      {player.name}
    </span>

    {duplicateNames.has((player.name || '').toLowerCase().trim()) && (
      <AlertCircle size={14} className="text-red-500 ml-1" />
    )}

    {player.prevNames?.trim() && (
      <div className="relative group inline-flex">
        <button className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
          <History size={12} />
        </button>

        <div className="absolute left-5 top-4 hidden group-hover:block z-[9999] pointer-events-none">
          <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg text-xs whitespace-nowrap">
            <div className="font-semibold text-[var(--text-secondary)] mb-1">
              {player.prevNames.split(',').length} previous names
            </div>

            <div className="space-y-0.5 text-[var(--text-muted)]">
              {player.prevNames.split(',').map((n, i) => (
                <div key={i}>{n.trim()}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-center">
  {player.governorId ? (
    <a
      href={`https://app.rokstats.online/governor/${player.governorId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-400/80 hover:text-cyan-300 hover:underline"
    >
      {player.governorId}
    </a>
  ) : (
    <span className="text-[var(--text-muted)]">-</span>
  )}
</td>
                 <td className="px-3 py-2.5 text-center font-mono text-sm text-[var(--foreground)]">
  {formatPower(player.power)}
</td>
                    


<td className="px-3 py-2.5 text-center relative group">
<div
  onClick={(e) => {
    e.stopPropagation();
  const rect = (e.target as HTMLElement).getBoundingClientRect();

setOpenMenu(
  openMenu?.type === 'violation' && openMenu?.id === player.governorId
    ? null
    : {
        type: 'violation',
        id: player.governorId,
        x: rect.left,
        y: rect.bottom
      }
);
  }}
  className="cursor-pointer flex flex-wrap justify-center gap-1 min-h-[18px]"
>
  {player.violation?.length ? (
    player.violation.map((v: string) => (
      <span
        key={v}
        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
          v === 'First'
            ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
            : v === 'Second'
            ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
            : v === 'Third'
            ? 'bg-red-500/20 border-red-500/40 text-red-300'
            : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
        }`}
      >
        {v}
      </span>
    ))
  ) : (
    <span className="text-xs text-[var(--text-muted)]">-</span>
  )}
</div>

  {isAdmin &&
    openMenu?.type === 'violation' &&
    openMenu?.id === player.governorId && (
      <div className="menu absolute z-[9999] bg-[var(--background-card)] mt-2 w-32 left-1/2 -translate-x-1/2 bg-[var(--background-card)] border border-[var(--border)] rounded-lg shadow-lg p-2 space-y-1">
        {VIOLATION_OPTIONS.map((v) => (
          <div
            key={v}
            onClick={(e) => {
              e.stopPropagation();
              toggleViolation(player, v);
              setOpenMenu(null);
            }}
            className={`cursor-pointer px-2 py-1 rounded text-xs ${
  player.violation?.includes(v)
    ? v === 'First'
      ? 'bg-yellow-500/20 text-yellow-300'
      : v === 'Second'
      ? 'bg-orange-500/20 text-orange-300'
      : v === 'Third'
      ? 'bg-red-500/20 text-red-300'
      : 'bg-purple-500/20 text-purple-300'
    : 'hover:bg-[var(--background-secondary)] text-[var(--text-muted)]'
}`}
          >
            {v}
          </div>
        ))}
      </div>
  )}
</td>

                     
<td className="px-3 py-2.5 text-center relative">
  <div className="relative z-10">
<div
onClick={(e) => {
  e.stopPropagation();

  const rect = (e.target as HTMLElement).getBoundingClientRect();

  setOpenMenu(
    openMenu?.type === 'handled' && openMenu?.id === player.governorId
      ? null
      : {
          type: 'handled',
          id: player.governorId,
          x: rect.left,
          y: rect.bottom
        }
  );
}}
  className="cursor-pointer text-xs"
>
{!player.handled || player.handled === 'No action' ? (
  <span className="text-xs text-[var(--text-muted)]">-</span>
) : (
  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
    player.handled === 'Pending'
      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      : player.handled === 'On wanted list'
      ? 'bg-red-500/10 border-red-500/30 text-red-400'
      : player.handled === 'Left'
      ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
      : ''
  }`}>
    {player.handled}
  </span>
)}
</div>

{isAdmin &&
 openMenu?.type === 'handled' &&
 openMenu?.id === player.governorId && (
 <div
  className="menu fixed z-[9999] pointer-events-auto bg-[var(--background-card)] border border-[var(--border)] rounded-lg shadow-lg p-2 space-y-1 w-36"
 style={{
  top: openMenu?.y,
  left: openMenu?.x
}}
>
   {['No action', 'Pending', 'On wanted list', 'Left'].map((v) => {
  const active = (player.handled || 'No action') === v;

  return (
    <div
      key={v}
      onClick={(e) => {
        e.stopPropagation();
        savePlayer(player, { handled: v });
        setOpenMenu(null);
      }}
     className={`cursor-pointer px-2 py-1 rounded text-xs transition ${
  active
    ? v === 'Pending'
      ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/40'
      : v === 'On wanted list'
      ? 'bg-red-500/30 text-red-200 border border-red-500/40'
      : v === 'Left'
      ? 'bg-sky-500/30 text-sky-200 border border-sky-500/40'
      : 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
    : 'hover:bg-[var(--background-secondary)] text-[var(--text-muted)]'
}`}
    >
      {v}
    </div>
  );
})}
  </div>
)}
      </div>
</td>


<td className="px-3 py-2.5 text-center">
  {isAdmin ? (
<input
  value={player.notes || ''}
  onChange={(e) => {
    const value = e.target.value;

    setPlayers(prev =>
      prev.map(p =>
        p.governorId === player.governorId
          ? { ...p, notes: value }
          : p
      )
    );
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      savePlayer(player, {
        notes: (e.target as HTMLInputElement).value
      });
    }
  }}
  className="bg-[var(--background-secondary)] border border-[var(--border)] text-xs rounded px-2 py-1 w-32"
/>
  ) : (
    <span className="text-xs text-[var(--text-muted)]">
      {player.notes || '-'}
    </span>
  )}
</td>

{isAdmin && (
  <td className="px-3 py-2.5 text-center">
    <button
      onClick={(e) => {
        e.stopPropagation();
        deletePlayer(player);
      }}
      className="text-red-400 hover:text-red-300 transition"
    >
      ❌
    </button>
  </td>
)}

</tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}





      
      {/* Mobile  MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM   card view */}
   {!loading && !error && (
  <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[var(--text-muted)] rounded-xl border border-[var(--border)]">
              {hasActiveFilters ? 'No players match filters' : 'No wanted players'}
            </div>
          ) : (
            filtered.map((player) => {
              const handled = player.handled || 'No action';
              const isDone = handled !== 'Pending' && handled !== 'No action';
            
              return (
                <div
                  key={player.governorId || player.name}
                  className={`rounded-xl border border-[var(--border)] p-4 space-y-3 ${isDone ? 'opacity-50' : ''}`}
                >
                  {/* Top row: name + handled badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`font-semibold text-[var(--foreground)] truncate ${isDone ? 'line-through' : ''}`}>
                        {player.name}
                      </p>
                      <p className="text-xs font-mono text-[var(--text-muted)]">
                        ID: {player.governorId || '-'}
                      </p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border ${handledBg(handled)}`}>
                      {handled}
                    </span>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div>
                      <span className="text-[var(--text-muted)]">Power: </span>
                      <span className="font-mono text-[var(--text-secondary)]">{formatPower(player.power)}</span>
                    </div>
                      </div>
                 

{/* Violation */}
<div className="flex flex-wrap gap-1 pt-2">
  {VIOLATION_OPTIONS.map((v) => {
    const active = player.violation?.includes(v);

    return (
      <button
        key={v}
        disabled={!isAdmin}
        onClick={() => toggleViolation(player, v)}
        className={`px-2 py-0.5 rounded-md text-xs border transition ${
          active
            ? v === 'First'
              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
              : v === 'Second'
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
              : v === 'Third'
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            : 'bg-[var(--background-secondary)] border-[var(--border)] text-[var(--text-muted)]'
        } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {v}
      </button>
    );
  })}
</div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Showing count + last refreshed */}
      <div className="mt-3 text-xs text-[var(--text-muted)] text-center space-y-0.5">
        <div>Showing {filtered.length} of {stats.total} players</div>
        {lastRefreshed && (
          <div>Last refreshed: {lastRefreshed.toLocaleTimeString()}</div>
        )}
      </div>

   

      {/* Password modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Login</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Password"
              className="w-full px-3 py-2 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] mb-4 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 py-2 rounded-lg font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                Submit
              </button>
              <button
                onClick={() => { setShowPasswordPrompt(false); setPassword(''); }}
                className="flex-1 py-2 rounded-lg font-medium bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
