'use client';
import { History } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, RefreshCw, Lock, ExternalLink, Crosshair, X, Info, ChevronDown, ChevronUp, Undo2, Target, Skull, LogOut } from 'lucide-react';
import { fetchViolationSheet } from '@/lib/kingdom/parse';
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
type SortableField = 'name' | 'governorId' | 'power' | 'alliance' | 'reason' | 'zero' | 'handled';

interface SortRule {
  field: SortableField;
  direction: 'asc' | 'desc';
}

const DEFAULT_SORT_RULES: SortRule[] = [
  { field: 'handled', direction: 'asc' },
  { field: 'power', direction: 'desc' },
];

const SORT_FIELD_LABELS: Record<SortableField, string> = {
  name: 'Name',
  governorId: 'Gov ID',
  power: 'Power',
  alliance: 'Alliance',
  reason: 'Reason',
  zero: 'Zero?',
  handled: 'Handled',
};

export default function WantedList() {
  const [players, setPlayers] = useState<WantedPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string | null>(null);
  
  const [handledFilter, setHandledFilter] = useState<'all' | 'No action' | 'Pending' | 'On wanted list' | 'Left'>('all');


  // Sort state
  const [sortRules, setSortRules] = useState<SortRule[]>(DEFAULT_SORT_RULES);

  // Officer mode (can change handled status)
  const [isOfficer, setIsOfficer] = useState(false);
  // Admin mode (can see sheet link) — admin also gets officer privileges
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');


const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const [wantedPlayers, prevNamesMap] = await Promise.all([
      fetchViolationSheet(MGE_VIOLATION_SHEET_URL),
      fetchPrevNamesSheet(PREV_NAMES_SHEET_URL),
    ]);

const merged: WantedPlayer[] = wantedPlayers.map((p: any) => ({
  governorId: p.governorId,
  name: p.name,
  power: p.power || 0,

  violation: p.violation || [],
  handled: p.handled || 'No action',
  notes: p.notes || '',

  zero: p.zero || '',
  zeroed: p.zeroed || '',
  display: p.display !== false,

  prevNames: prevNamesMap.get(p.governorId) || ""
}));

    setPlayers(merged);
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
      setIsOfficer(true);
      setShowPasswordPrompt(false);
      setPassword('');
    } else if (password === OFFICER_PASSWORD) {
      setIsOfficer(true);
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
  setHandledFilter('all');
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



  // Only visible players (display !== false)
const visiblePlayers = useMemo(
  () => players.filter(p => p.display !== false),
  [players]
);
const filtered = useMemo(() => {
  const list = visiblePlayers
    .filter(p => {
      if (search && !matchesSearch(search, p.name, p.governorId)) return false;
      if (reasonFilter && !p.violation?.includes(reasonFilter)) return false;

      const handled = p.handled || 'No action';
      if (handledFilter !== 'all' && handled !== handledFilter) return false;

      return true;
    });

  return [...list].sort((a, b) => {
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
          aVal = a.power2 || 0;
          bVal = b.power2 || 0;
          break;

        case 'handled':
          aVal = handledOrder(a.handled || 'No action');
          bVal = handledOrder(b.handled || 'No action');
          break;

        case 'reason':
          aVal = a.violation?.join(',') || '';
          bVal = b.violation?.join(',') || '';
          break;

        default:
          continue;
      }

      if (aVal < bVal) return rule.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return rule.direction === 'asc' ? 1 : -1;
    }

    return 0;
  });
}, [visiblePlayers, search, reasonFilter, handledFilter, sortRules]);


  
  const stats = useMemo(() => {
  let pendingCount = 0, pendingPower = 0;
  let zeroedCount = 0, zeroedPower = 0;
  let leftCount = 0;
  let toZeroCount = 0, toZeroPower = 0;

  for (const p of visiblePlayers) {
    const s = p.handled || 'No action';
    const power = p.power2 || 0;

    if (s === 'Pending' || s === 'No action') {
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
    total: visiblePlayers.length,
    pendingCount,
    pendingPower,
    zeroedCount,
    zeroedPower,
    leftCount,
    toZeroCount,
    toZeroPower,
  };
}, [visiblePlayers]);
  
  
  const duplicateNames = useMemo(() => {
  const map = new Map<string, number>();

  for (const p of visiblePlayers) {
    const name = p.name.toLowerCase().trim();
    map.set(name, (map.get(name) || 0) + 1);
  }

  const duplicates = new Set<string>();
  for (const [name, count] of map) {
    if (count > 1) duplicates.add(name);
  }

  return duplicates;
}, [visiblePlayers]);
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
  search || reasonFilter || handledFilter !== 'all'
  || JSON.stringify(sortRules) !== JSON.stringify(DEFAULT_SORT_RULES);

  // Sortable header helper
  const SortHeader = ({ field, label, align = 'Left' }: { field: SortableField; label: string; align?: 'Left' | 'right' | 'center' }) => (
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
    if (current.length >= 2) return; // max 2
    current = [...current, value];
  }

  savePlayer(player, { violation: current });
};

                                 
const savePlayer = async (player: any, updates: any) => {
  const updated = { ...player, ...updates };

 if (
  (!updated.violation || updated.violation.length === 0) &&
  (!updated.handled || updated.handled === 'No action') &&
  !updated.notes
) {
    await fetch('/api/violation-save', {
      method: 'POST',
      body: JSON.stringify({
        id: player.governorId,
        delete: true
      })
    });
    fetchData();
    return;
  }

  await fetch('/api/violation-save', {
    method: 'POST',
    body: JSON.stringify({
      name: updated.name,
      id: updated.governorId,
      power: updated.power2,
      violation: updated.violation?.join(',') || '',
      handled: updated.handled || '',
      notes: updated.notes || ''
    })
  });

  fetchData();
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          {!isOfficer && (
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

      {/* Instructions panel */}
      {showInstructions && (
        <div className="mb-4 px-4 py-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-sm text-[var(--text-secondary)] space-y-3">
          <p>
            This page tracks wanted players in the kingdom. The list is pulled from a shared Google Sheet that admins can edit.
          </p>
          <div>
            <p className="font-semibold text-[var(--foreground)] mb-1">Columns</p>
            <ul className="list-disc list-inside space-y-0.5 text-[var(--text-muted)]">
              <li><span className="text-[var(--text-secondary)]">Zero?</span> &mdash; Whether the player should be zeroed (from the sheet)</li>
              <li><span className="text-[var(--text-secondary)]">Handled</span> &mdash; Officer-set status: Pending, Zeroed, or Left kingdom</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[var(--foreground)] mb-1">Zeroing Priority</p>
            <ol className="list-decimal list-inside space-y-0.5 text-[var(--text-muted)]">
              <li>Farm killers and hostile players &mdash; zero first</li>
              <li>Players who refuse to follow kingdom rules</li>
              <li className="text-amber-400 font-medium">Illegal migrants &mdash; zero LAST (they may still leave on their own)</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold text-[var(--foreground)] mb-1">Officer Mode</p>
            <p className="text-[var(--text-muted)]">
              Log in as an officer to mark players as &quot;Zeroed&quot; or &quot;Left Kingdom&quot;. You can undo any status change within a few seconds.
            </p>
          </div>
        </div>
      )}

      {/* Officer/Admin mode banner */}
      {isOfficer && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <Lock size={14} />
            <span className="font-medium">{isAdmin ? 'Admin Mode' : 'Officer Mode'}</span>
            <span className="hidden sm:inline text-amber-400/60">&mdash; Mark players as zeroed or left kingdom</span>
          </div>
          <button
            onClick={() => { setIsOfficer(false); setIsAdmin(false); }}
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
  setHandledFilter('all');
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
  visiblePlayers.reduce((sum, p) => sum + (p.power2 || 0), 0)
)}</p>
            <p className="text-[10px] text-[var(--text-muted)]">total power</p>
          </div>
          
          
          {/* Pending */}
          <div
  onClick={() => {
  setHandledFilter('Pending');
   
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
    setHandledFilter('On wanted list');
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
  setHandledFilter('Left');
   
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
        <div className="flex flex-col sm:flex-row gap-2">
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
         {isAdmin && search && (
  <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl mt-2 max-h-40 overflow-y-auto">
    {players
     .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 10)
      .map(p => (
        <div
          key={p.governorId}
          onClick={() =>
            savePlayer(
              {
                name: p.name,
                governorId: p.governorId,
                power2: p.power2,
                violation: [],
                handled: 'No action',
                notes: ''
              },
              {}
            )
          }
          className="px-3 py-2 hover:bg-[var(--background-secondary)] cursor-pointer text-sm"
        >
          {p.name} ({p.governorId})
        </div>
      ))}
  </div>
)}
         
          {/* Reset */}
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
                  title={`Remove ${SORT_FIELD_LABELS[rule.field]} from sort`}
                >
                  {SORT_FIELD_LABELS[rule.field]}
                  {rule.direction === 'asc' ? '\u2191' : '\u2193'}
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
       <div className="hidden md:block overflow-x-auto overflow-y-visible">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[var(--background-card)]">
             <tr className="border-b border-[var(--border)]">
  <th className="px-3 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
    #
  </th>
  <SortHeader field="name" label="Name" align="Left" />
                <SortHeader field="governorId" label="ID" align="center" />
<SortHeader field="power" label="Power" align="center" />
                
             {/* <SortHeader field="alliance" label="Alliance" /> */}
                <SortHeader field="reason" label="Violation" align="center" />
                
                <SortHeader field="handled" label="Handled" align="center" />
              <th className="text-center px-3 py-2">Notes</th>
               {isOfficer && (
                  <th className="text-center px-3 py-2 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                 <td colSpan={isOfficer ? 6 : 5} className="px-3 py-8 text-center text-sm text-[var(--text-muted)]">
                    {hasActiveFilters ? 'No players match filters' : 'No wanted players'}
                  </td>
                </tr>
              ) : (
                filtered.map((player, idx) => {
                  const handled = player.handled || 'No action';
                  const isDone = handled !== 'Pending' && handled !== 'No action';
                  const isIllegal = (player.violation?.join(',') || '').toLowerCase().includes('illegal');
                  return (
                    <tr
                      key={player.governorId || player.name}
                      className={`border-b border-[var(--border)] hover:bg-[var(--background-secondary)]/50 transition-colors ${idx % 2 === 0 ? 'bg-[var(--background-secondary)]/30' : ''} ${isDone ? 'opacity-50' : ''}`}
                    >

                     <td className="px-3 py-2.5 text-xs text-[var(--text-muted)] font-mono text-center">
  {idx + 1}
</td>
                      <td className="px-3 py-2.5 text-center">
                       <div className="flex items-center gap-1">
  <span className={`font-medium text-sm ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--foreground)]'}`}>
  {player.name}
</span>

{duplicateNames.has(player.name.toLowerCase().trim()) && (
 <span title="Duplicate name detected">
  <AlertCircle
    size={14}
    className="text-red-500 ml-1"
  />
</span>
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
                    


  <td className="px-3 py-2.5 text-center">
  <div className="flex flex-wrap justify-center gap-1">
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
</td>
                     
  <td className="px-3 py-2.5 text-center">
  {isAdmin ? (
    <select
      value={player.handled || 'No action'}
      onChange={(e) => savePlayer(player, { handled: e.target.value })}
      className="bg-[var(--background-secondary)] border border-[var(--border)] text-xs rounded px-2 py-1"
    >
      <option>No action</option>
      <option>Pending</option>
      <option>On wanted list</option>
      <option>Left</option>
    </select>
  ) : (
    <span
      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border ${
        player.handled === 'On wanted list'
          ? 'bg-red-500/10 text-red-400 border-red-500/30'
          : player.handled === 'Left'
          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      }`}
    >
      {player.handled || 'No action'}
    </span>
  )}
</td>



<td className="px-3 py-2.5 text-center">
  {isAdmin ? (
    <input
      value={player.notes || ''}
      onChange={(e) => savePlayer(player, { notes: e.target.value })}
      className="bg-[var(--background-secondary)] border border-[var(--border)] text-xs rounded px-2 py-1 w-32"
    />
  ) : (
    <span className="text-xs text-[var(--text-muted)]">
      {player.notes || '-'}
    </span>
  )}
</td>





                      
                    
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
              const isIllegal = (player.violation?.join(',') || '').toLowerCase().includes('illegal');
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
