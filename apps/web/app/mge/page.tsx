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
  const [selectedMember,setSelectedMember] = useState<{id:string,name:string} | null>(null)
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
<div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
<div
className="p-4 sm:p-6 rounded-xl border space-y-5"
style={{background:'var(--background-card)', borderColor:'var(--border)'}}
>
<h2 className="text-lg font-semibold">MGE Registration</h2>

<div className="space-y-2">

<div className="flex flex-col sm:flex-row gap-3">

<input
type="text"
inputMode="numeric"
pattern="[0-9]*"
placeholder="Enter your ID"
value={
 selectedMember
  ? `${form.id} (${selectedMember.name})`
  : form.id
}
className="flex-1 border px-3 py-2 rounded"
style={{
  background: "var(--background-card)",
  color: "var(--foreground)",
  borderColor: "var(--border)"
}}
onChange={(e)=>{
 const value = e.target.value.replace(/\D/g,"")
 setSelectedMember(null)
 setForm({...form,id:value})
}}
/>

<span className="text-sm text-slate-400 self-center">or</span>

<button
type="button"
onClick={()=>setSearchMode(!searchMode)}
className="px-3 py-2 w-full sm:w-auto bg-amber-500/20 border border-amber-400 text-amber-300 rounded text-sm"
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
onChange={e=>setSearch(e.target.value)}
/>
{form.id && (
<div className="text-xs text-slate-400">
Selected ID: <span className="text-amber-300">{form.id}</span>
</div>
)}
<div className="max-h-40 overflow-y-auto">

{members
  .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
  .slice(0, 20)
  .map((m) => {
    return (
      <div
        key={m.id}
        className="px-2 py-1 hover:bg-slate-700 cursor-pointer rounded"
        onClick={() => {
          setForm({ ...form, id: m.id })
          setSelectedMember(m)
          setSearchMode(false)
        }}
      >
        <div className="flex justify-between">
          <span>{m.name}</span>
          <span className="text-xs text-slate-400">{m.id}</span>
        </div>
      </div>
    )
  })}

</div>

</div>

)}
<div className="pt-4 border-t border-[var(--border)]">
<label className="text-sm font-medium">Select Commander</label>

<select
className="w-full border px-3 py-2 rounded"
style={{
  background: "var(--background-card)",
  color: "var(--foreground)",
  borderColor: "var(--border)"
}}
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
  </div>
<div className="pt-4 border-t border-[var(--border)]">
<label className="text-sm font-medium flex items-center gap-2">
  Commander Skill lvl
  <span className="text-xs opacity-60 flex items-center gap-1">
    (👆 tap to change)
  </span>
</label>


{/* SKILL GRID */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
        className="cursor-pointer rounded-lg border p-3 text-center select-none transition"
        style={{
          background: isMax ? "rgba(245,158,11,0.15)" : "var(--background-card)",
          borderColor: isMax ? "#f59e0b" : "var(--border)",
          color: isMax ? "#f59e0b" : "var(--foreground)"
        }}
      >
        <div className="text-xl font-bold">{value}</div>

        <div className="text-xs opacity-80 mb-1">
          Skill {i + 1}
        </div>

        <div className="flex justify-center gap-1 mt-1">
          {[1,2,3,4,5].map((dot) => {
            return (
              <div
                key={dot}
                className={`w-1.5 h-1.5 rounded-full ${
                  dot <= value ? "bg-amber-400" : "bg-slate-600"
                }`}
              />
            );
          })}
        </div>

      </div>
    );
  })}
</div>

  </div>
<div className="pt-4 border-t border-[var(--border)]">
<label className="text-sm font-medium">
  Commander Screenshot (optional)
</label>

<label className="flex items-center gap-3 border border-slate-700 rounded-lg px-4 py-3 cursor-pointer hover:border-amber-400 transition">

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="22"
  height="22"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-2h6l2 2h4a2 2 0 0 1 2 2z"/>
  <circle cx="12" cy="13" r="4"/>
</svg>

<span className="text-sm text-slate-300">
Tap to upload screenshot
</span>

<input
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>setCommanderFile(e.target.files?.[0] || null)}
/>
</label>
{commanderFile && (
<div className="text-xs text-green-400 mt-1">
Uploaded: {commanderFile.name}
</div>
)}
</div>
      
{/* PURPOSE */}
<div className="pt-4 border-t border-[var(--border)]">
<label className="text-sm font-medium">Commander Purpose</label>

<select className="w-full border px-3 py-2 rounded"
style={{
  background: "var(--background-card)",
  color: "var(--foreground)",
  borderColor: "var(--border)"
}}
onChange={e=>setForm({...form,purpose:e.target.value})}
>
<option value="">Select Purpose</option>
<option>Open Field</option>
<option>Rally</option>
<option>Garrison</option>
<option>Mixed</option>
</select>
</div>

{/* RANK */}
<div className="pt-4 border-t border-[var(--border)]">
<select className="w-full border px-3 py-2 rounded"
style={{
  background: "var(--background-card)",
  color: "var(--foreground)",
  borderColor: "var(--border)"
}}
onChange={e=>setForm({...form,rank:e.target.value})}
>
<option>Select Rank</option>
<option>Rank 1</option>
<option>Rank 2</option>
<option>Rank 3</option>
<option>Rank 4-10</option>
<option>Free for all</option>
</select>
</div>

{/* SPENDING */}
<div className="pt-4 border-t border-[var(--border)]">
<select className="w-full border px-3 py-2 rounded"
style={{
  background: "var(--background-card)",
  color: "var(--foreground)",
  borderColor: "var(--border)"
}}
onChange={e=>setForm({...form,kvkSpending:e.target.value})}
>
<option>F2P</option>
<option>Crystal Mine +50%</option>
<option>Crystal Quest</option>
<option>Buy Popups</option>
<option>Max Tech</option>
</select>
</div>

{/* TROOP */}
<div className="pt-4 border-t border-[var(--border)]">
<select className="w-full border px-3 py-2 rounded"
style={{
  background: "var(--background-card)",
  color: "var(--foreground)",
  borderColor: "var(--border)"
}}
onChange={e=>setForm({...form,troopType:e.target.value})}
>
<option>INF</option>
<option>ARCH</option>
<option>CAV</option>
</select>
</div>

{/* PAIR */}
<div className="pt-4 border-t border-[var(--border)]">
<input
placeholder="Commander Pair"
className="w-full border px-3 py-2 rounded"
style={{
  background: "var(--background-card)",
  color: "var(--foreground)",
  borderColor: "var(--border)"
}}
onChange={e=>setForm({...form,pair:e.target.value})}
/>
</div>

{/* COMMENT */}
<div className="pt-4 border-t border-[var(--border)]">
<textarea
placeholder="Comment"
className="w-full border px-3 py-2 rounded"
style={{
  background: "var(--background-card)",
  color: "var(--foreground)",
  borderColor: "var(--border)"
}}
onChange={e=>setForm({...form,comment:e.target.value})}
/>
</div>
<button
disabled={submitting}
onClick={submitApplication}
className="px-4 py-2 bg-blue-500 text-white rounded"
>
{submitting ? "Submitting..." : "Submit Application"}
</button>


</div> {/* closes space-y-2 */}
</div> {/* closes card */}
</div> {/* closes page container */}

</AppSidebar>
);
}
