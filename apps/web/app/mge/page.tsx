'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';

export default function MgePage() {

const [form, setForm] = useState({
  id: '',
  rank: '',
  kvkSpending: '',
  purpose: '',
  troopType: '',
  pair: '',
  comment: ''
});
const [skills,setSkills] = useState({
 skill1:0,
  skill2:0,
  skill3:0,
  skill4:0
})
const [commanderFile,setCommanderFile] = useState<File | null>(null)
const [gearFile,setGearFile] = useState<File | null>(null)
const [loadingCommanders,setLoadingCommanders] = useState(false)
const [commanders,setCommanders] = useState<string[]>([])
const [selectedCommander,setSelectedCommander] = useState("")
const [submitting,setSubmitting] = useState(false)
  const [members,setMembers] = useState<{id:string,name:string}[]>([])
const [searchMode,setSearchMode] = useState(false)
const [search,setSearch] = useState("")
  
  useEffect(()=>{

 async function loadMembers(){

  const res = await fetch("/api/mge-application?members=true")
  const data = await res.json()

  setMembers(data)

 }

 loadMembers()

},[])
  
useEffect(() => {

 async function loadCommanders() {

   setLoadingCommanders(true)

   const res = await fetch("/api/mge-application")
   const data = await res.json()

   setCommanders(data)
   setLoadingCommanders(false)
 }

 loadCommanders()

}, [])
async function submitApplication(){

 const data = new FormData()

 if(commanderFile){
  data.append("commander", commanderFile)
 }

 if(gearFile){
  data.append("equipment", gearFile)
 }

 data.append("id", form.id)
 data.append("commander", selectedCommander)
 data.append("desiredRank", form.rank)
 data.append("kvkSpending", form.kvkSpending)
 data.append("purpose", form.purpose)
 data.append("troopType", form.troopType)
 data.append("pair", form.pair)
 data.append("comment", form.comment)

 data.append(
  "skills",
  `${skills.skill1}${skills.skill2}${skills.skill3}${skills.skill4}`
 )

 setSubmitting(true)

 await fetch("/api/mge-application",{
  method:"POST",
  body:data
 })

 setSubmitting(false)

 alert("Application submitted")
}

  
return (
<AppSidebar>
<div className="max-w-4xl mx-auto p-4 md:p-8">
<div
className="p-6 rounded-lg border space-y-4"
style={{background:'var(--background-card)', borderColor:'var(--border)'}}
>
<h2 className="text-lg font-semibold">MGE Registration</h2>

<div className="space-y-2">

<div className="flex gap-2">

<input
type="text"
inputMode="numeric"
pattern="[0-9]*"
placeholder="Enter your ID"
className="flex-1 border px-3 py-2 rounded bg-slate-900 border-slate-700 text-slate-200"
onChange={e=>setForm({...form,id:e.target.value})}
/>

<span className="text-sm text-slate-400 self-center">or</span>

<button
type="button"
onClick={()=>setSearchMode(!searchMode)}
className="px-3 py-2 bg-amber-500/20 border border-amber-400 text-amber-300 rounded text-sm"
>
Search your ID by name
</button>

</div>
{searchMode && (

<div className="border border-slate-700 rounded bg-slate-900 p-2">

<input
placeholder="Search name..."
className="w-full mb-2 px-2 py-1 bg-slate-800 text-slate-200 rounded"
value={search}
onChange={e=>{
 const value = e.target.value.replace(/\D/g,"")
 setForm({...form,id:value})
}}
/>
{form.id && (
<div className="text-xs text-slate-400">
Selected ID: <span className="text-amber-300">{form.id}</span>
</div>
)}
<div className="max-h-40 overflow-y-auto">

{members
.filter(m=>m.name.toLowerCase().includes(search.toLowerCase()))
.slice(0,20)
.map(m=>(
<div
key={m.id}
className="px-2 py-1 hover:bg-slate-700 cursor-pointer rounded"
onClick={()=>{
 setForm({...form,id:m.id})
 setSearch(m.name)
 setSearchMode(false)
}}
>
<div className="flex justify-between">
<span>{m.name}</span>
<span className="text-xs text-slate-400">{m.id}</span>
</div>
</div>
))}

</div>

</div>

)}

<label className="text-sm font-medium">Select Commander</label>

<select
className="w-full border px-3 py-2 rounded bg-slate-900 text-slate-200 border-slate-700"
value={selectedCommander}
onChange={e=>setSelectedCommander(e.target.value)}
>
<option value="">
{loadingCommanders ? "Loading commanders..." : "Select Commander"}
</option>

{commanders.map(c => (
<option key={c} value={c}>{c}</option>
))}

</select>

<label className="text-sm font-medium">
  Commander Skill lvl <span className="text-xs opacity-60">(tap to change)</span>
</label>

<div className="grid grid-cols-4 gap-3">
  {Object.entries(skills).map(([key, value], i) => {
    const isMax = value === 5;

    return (
      <div
        key={key}
        onClick={() =>
          setSkills({
            ...skills,
            [key]: value === 5 ? 0 : value + 1,
          })
        }
        className={`cursor-pointer rounded-lg border p-3 text-center select-none transition
        ${
          isMax
  ? "bg-amber-500/20 border-amber-400 text-amber-300"
  : "bg-slate-900 border-slate-700 text-slate-200"
        }`}
      >
        <div className="text-xl font-bold">{value}</div>

        <div className="text-xs opacity-80">Skill {i + 1}</div>
     </div>
    );
  })}



  
</div>
<label className="text-sm font-medium">Commander Gear / Equipment</label>
<input
type="file"
accept="image/*"
onChange={(e)=>setCommanderFile(e.target.files?.[0] || null)}
/>

<label className="text-sm font-medium">Gear Screenshot</label>
<input
type="file"
accept="image/*"
onChange={(e)=>setGearFile(e.target.files?.[0] || null)}
/>
<label className="text-sm font-medium">Commander Purpose</label>

<select
className="w-full border px-3 py-2 rounded bg-slate-900 text-slate-200 border-slate-700"
onChange={e=>setForm({...form,purpose:e.target.value})}
>
<option value="">Select Purpose</option>
<option>Open Field</option>
<option>Rally</option>
<option>Garrison</option>
<option>Mixed</option>
</select>
<select
className="w-full border px-3 py-2 rounded bg-slate-900 text-slate-200 border-slate-700"
onChange={e=>setForm({...form,rank:e.target.value})}
>
<option>Select Rank</option>
<option>Rank 1</option>
<option>Rank 2</option>
<option>Rank 3</option>
<option>Rank 4-10</option>
<option>Free for all</option>
</select>

<select
className="w-full border px-3 py-2 rounded bg-slate-900 text-slate-200 border-slate-700"
onChange={e=>setForm({...form,kvkSpending:e.target.value})}
>
<option>F2P</option>
<option>Crystal Mine +50%</option>
<option>Crystal Quest</option>
<option>Buy Popups</option>
<option>Max Tech</option>
</select>

<select
className="w-full border px-3 py-2 rounded bg-slate-900 text-slate-200 border-slate-700"
onChange={e=>setForm({...form,troopType:e.target.value})}
>
<option>INF</option>
<option>ARCH</option>
<option>CAV</option>
</select>

<input
placeholder="Commander Pair"
className="w-full border px-3 py-2 rounded bg-slate-900 text-slate-200 border-slate-700"
onChange={e=>setForm({...form,pair:e.target.value})}
/>

<textarea
placeholder="Comment"
className="w-full border px-3 py-2 rounded bg-slate-900 text-slate-200 border-slate-700"
onChange={e=>setForm({...form,comment:e.target.value})}
/>

<button
disabled={submitting}
onClick={submitApplication}
className="px-4 py-2 bg-blue-500 text-white rounded"
>
{submitting ? "Submitting..." : "Submit Application"}
</button>

</div>

      </div>
    </AppSidebar>
  );
}
