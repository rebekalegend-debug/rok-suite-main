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

<input
placeholder="Your ingame name"
className="w-full border px-3 py-2 rounded"
onChange={e=>setForm({...form,id:e.target.value})}
/>


<label className="text-sm font-medium">Select Commander</label>

<select
className="w-full border px-3 py-2 rounded"
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
            ? "bg-green-600/20 border-green-500 text-green-400"
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
className="w-full border px-3 py-2 rounded"
onChange={e=>setForm({...form,purpose:e.target.value})}
>
<option value="">Select Purpose</option>
<option>Open Field</option>
<option>Rally</option>
<option>Garrison</option>
<option>Mixed</option>
</select>
<select
className="w-full border px-3 py-2 rounded"
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
className="w-full border px-3 py-2 rounded"
onChange={e=>setForm({...form,kvkSpending:e.target.value})}
>
<option>F2P</option>
<option>Crystal Mine +50%</option>
<option>Crystal Quest</option>
<option>Buy Popups</option>
<option>Max Tech</option>
</select>

<select
className="w-full border px-3 py-2 rounded"
onChange={e=>setForm({...form,troopType:e.target.value})}
>
<option>INF</option>
<option>ARCH</option>
<option>CAV</option>
</select>

<input
placeholder="Commander Pair"
className="w-full border px-3 py-2 rounded"
onChange={e=>setForm({...form,pair:e.target.value})}
/>

<textarea
placeholder="Comment"
className="w-full border px-3 py-2 rounded"
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
