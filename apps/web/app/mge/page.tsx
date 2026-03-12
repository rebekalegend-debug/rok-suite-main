'use client';

import React, { useState, useEffect, useRef } from 'react';
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
const [commanderBlurred,setCommanderBlurred] = useState(false)
const memberInputRef = useRef<HTMLInputElement>(null)
const commanderInputRef = useRef<HTMLInputElement>(null)
const [commanderSearch,setCommanderSearch] = useState("")
const [memberFocus,setMemberFocus] = useState(false)
const [commanderFocus,setCommanderFocus] = useState(false)
  const [commanderTouched,setCommanderTouched] = useState(false)
const [memberBlurred,setMemberBlurred] = useState(false)
  const [memberTouched,setMemberTouched] = useState(false)
const [memberError,setMemberError] = useState(false)
const [pauth,setPauth] = useState("")
const [bauth,setBauth] = useState("")
  const [showAdmin,setShowAdmin] = useState(false)
const [password,setPassword] = useState("")
const [token,setToken] = useState("")
const [isAdmin,setIsAdmin] = useState(false)
const [commanderFile,setCommanderFile] = useState<File | null>(null)
const [gearFile,setGearFile] = useState<File | null>(null)
const [loadingCommanders,setLoadingCommanders] = useState(false)
const [commanders,setCommanders] = useState<string[]>([])
const [selectedCommander,setSelectedCommander] = useState("")
const [submitting,setSubmitting] = useState(false)
  const [members,setMembers] = useState<{id:string,name:string}[]>([])
const [search,setSearch] = useState("")
  const [selectedMember,setSelectedMember] = useState<{id:string,name:string} | null>(null)

useEffect(()=>{

async function loadCommanders(){

  setLoadingCommanders(true)

  const res = await fetch("/api/mge-commanders")
  const list = await res.json()

  setCommanders(list)

  setLoadingCommanders(false)
}

loadCommanders()

},[])
useEffect(() => {

async function loadMembers(){

  const pauth = localStorage.getItem("rok_pauth")
  const bauth = localStorage.getItem("rok_bauth")

  if (pauth && bauth) {

    console.log("Updating members from Lilith...")

    const update = await fetch("/api/mge-application",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        pauthorization: pauth,
        bauthorization: bauth
      }
    })

    const updateResult = await update.json()

    console.log("Members updated:", updateResult)
  }

  // NOW fetch members
  const res = await fetch("/api/mge-application")
  const list = await res.json()

  console.log("Members from sheet:", list.length)

  setMembers(list)
}

loadMembers()

}, [])
async function submitApplication(){

if(!selectedMember){
  setMemberError(true)
  alert("Please select your name from the list.")
  return
}
 const data = new FormData()

data.append("id", selectedMember!.id)
data.append("name", selectedMember!.name)

data.append("commander", selectedCommander)

data.append("desiredRank", form.rank)
data.append("kvkSpending", form.kvkSpending)
data.append("purpose", form.purpose)
data.append("troopType", form.troopType)
data.append("pair", form.pair || "")
data.append("comment", form.comment || "")

data.append(
 "skills",
 `${skills.skill1}${skills.skill2}${skills.skill3}${skills.skill4}`
)

if(commanderFile){
 data.append("equipment", commanderFile)
}

 setSubmitting(true)

 await fetch("/api/mge-application",{
  method:"POST",
  body:data
 })

 setSubmitting(false)

 alert("Application submitted")
}

  
const filteredCommanders = commanders
  .filter(c =>
    !commanderSearch ||
    c.toLowerCase().includes(commanderSearch.toLowerCase())
  )
  .slice(0,15)
  
 const filteredMembers = members
  .filter(m => {
    const q = search.toLowerCase()
    return (
      !search ||
      m.name?.toLowerCase().includes(q) ||
      m.id?.includes(q)
    )
  })
  .slice(0,20)

const skillsFilled =
skills.skill1 > 0 ||
skills.skill2 > 0 ||
skills.skill3 > 0 ||
skills.skill4 > 0


  
return (
<AppSidebar>
<div
className="min-h-screen"
style={{ background: "var(--background)" }}
>

<div className="max-w-4xl mx-auto p-4 md:p-8">

<div
className="p-6 rounded-lg border space-y-4 gold-glow"
style={{
  background: "var(--background-card)",
  borderColor: "var(--border)"
}}
>
<h2 className="mge-title border-b pb-2 mb-2">
MGE Registration
</h2>

<p className="mge-info">
To ensure your registration is processed correctly, all fields in this form must be completed correctly.
<br />
Missing information may result in your registration not being considered properly and could affect your ranking!
</p>

<div className="space-y-2">

<label className="form-label">
Enter your ingame ID or search by name
</label>

<div className="relative">

<input
ref={memberInputRef}
type="text"
autoComplete="off"
placeholder="Search your name or ID..."
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
caret-[#FFD76B]
${selectedMember ? "text-slate-400" : "text-white"}
${
  selectedMember
  ? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.45)]"
    : memberTouched && memberBlurred && !selectedMember
    ? "border-red-500 shadow-[0_0_10px_rgba(255,60,60,0.55)]"
    : "gold-input"
}`}
value={
  selectedMember
    ? `${selectedMember.name} (${selectedMember.id})`
    : search
}

onFocus={()=>{
  setMemberTouched(true)
  setMemberBlurred(false)
  setMemberFocus(true)

  setTimeout(()=>{
    memberInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  },200)
}}

onBlur={()=>{
  setMemberBlurred(true)
setTimeout(()=>setMemberFocus(false),150)
  if(!selectedMember){
    setMemberError(true)
  }
}}

onChange={(e)=>{
  const value = e.target.value
  setSelectedMember(null)
  setSearch(value)
  setForm({...form,id:""})
}}
/>



</div>

{/* SEARCH RESULTS */}
{memberFocus && !selectedMember && filteredMembers.length > 0 && (
  <div
className="rounded mt-2 p-2 max-h-40 overflow-y-auto"
style={{
  background:"var(--background-card)",
  border:"1px solid var(--border)"
}}
>

{filteredMembers.map(m => (

<div
key={m.id}
className="px-2 py-1 hover:bg-slate-700 cursor-pointer rounded"
onClick={()=>{
setForm(prev => ({ ...prev, id: m.id }))
 // setForm({...form,id:m.id})
  setSelectedMember(m)
setSearch("")
  setMemberError(false)

}}
>

<div className="flex justify-between">
<span>{m.name}</span>
<span className="text-xs text-slate-400">{m.id}</span>
</div>

</div>

))}

</div>
)}




  
</div>

<div className="pt-4 border-t border-[var(--border)]">
<label className="form-label">Select wanted commander</label>

<div className="relative">

<input
ref={commanderInputRef}
type="text"
autoComplete="off"
placeholder="Search commander..."
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
caret-[#FFD76B]
${selectedCommander ? "text-slate-400" : "text-white"}
${
 selectedCommander
  ? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.45)]"
  : commanderTouched && commanderBlurred && !selectedCommander
  ? "border-red-500 shadow-[0_0_10px_rgba(255,60,60,0.55)]"
  : "gold-input"
}`}
value={selectedCommander || commanderSearch}

onFocus={(e)=>{
  setCommanderTouched(true)
  setCommanderBlurred(false)
  setCommanderFocus(true)

  e.target.setSelectionRange(e.target.value.length,e.target.value.length)

  setTimeout(()=>{
    commanderInputRef.current?.scrollIntoView({
      behavior:"smooth",
      block:"center"
    })
  },200)
}}

onBlur={()=>{
  setCommanderBlurred(true)
  setTimeout(()=>setCommanderFocus(false),150)
}}
onChange={(e)=>{
  setCommanderSearch(e.target.value)
  setSelectedCommander("")
}}
/>

</div>

{commanderFocus && !selectedCommander && filteredCommanders.length > 0 && (

<div
className="rounded mt-2 p-2 max-h-40 overflow-y-auto"
style={{
  background:"var(--background-card)",
  border:"1px solid var(--border)"
}}
>

{filteredCommanders.map(c => (

<div
key={c}
className="px-2 py-1 hover:bg-slate-700 cursor-pointer rounded"
onClick={()=>{
  setSelectedCommander(c)
  setCommanderSearch("")
}}
>

{c}

</div>

))}

</div>

)}

</div>
<div
className={`rounded-lg p-4 transition cursor-pointer ${
  skillsFilled
    ? "border border-[#FFD76B] shadow-[0_0_14px_rgba(255,215,107,0.35)]"
    : "gold-glow-soft hover:gold-glow"
}`}
>
<label className="form-label flex items-center gap-2 mb-3">

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
      className="cursor-pointer rounded-lg border p-3 text-center select-none transition shadow-[0_0_8px_rgba(255,215,120,0.15)]"
        style={{
background: isMax
  ? "linear-gradient(135deg, rgba(255,215,120,0.18), rgba(255,185,70,0.12))"
  : "var(--background-card)",
borderColor: isMax ? "#FFD76B" : "var(--border)",
color: isMax ? "#FFC94A" : "var(--foreground)"
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
                  dot <= value ? "bg-[#FFD76B]" : "bg-slate-600"
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
<div className="pt-3 border-t border-[var(--border)]">
<label className="form-label mb-1 block">

⚙️ Gear/equipment you will use for the commander!
</label>

<label className="flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer gold-input hover:gold-glow transition">
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

<span className={`text-sm ${
  commanderFile ? "text-[#FFD76B]" : "text-slate-400"
}`}>
{commanderFile ? commanderFile.name : "Tap to upload screenshot"}
</span>
  
<input
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>setCommanderFile(e.target.files?.[0] || null)}
/>
</label>

  

</div>
      
{/* PURPOSE */}
<div className="pt-4 border-t border-[var(--border)]">
<label className="form-label">🎯 For what purpose you need the commander? </label>

<select
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
  form.purpose
    ? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
    : "gold-input"
}`}
value={form.purpose}
onChange={e=>setForm({...form,purpose:e.target.value})}
>
<option value="">Select Purpose</option>

<option value="Meta R/G Leader">Meta R/G Leader</option>
<option value="Non-Meta R/G Leader">Non-Meta R/G Leader</option>
<option value="Field fight">Field fight</option>
<option value="Own city garrison">Own city garrison</option>
<option value="Slow building it">Slow building it</option>
<option value="Just unlock">Just unlock</option>

</select>
</div>

{/* RANK */}
<div className="pt-4 border-t border-[var(--border)]">
  <label className="form-label">🏅 What rank you would like to get? </label>
<select
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
  form.rank
    ? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
    : "gold-input"
}`}
value={form.rank}
onChange={e=>setForm({...form,rank:e.target.value})}
>

<option value="">Select Rank</option>

<option value="1">1 = 180GH</option>
<option value="2">2 = 90GH</option>
<option value="3">3 = 60GH</option>
<option value="4">4 = 50GH</option>
<option value="5">5 = 40GH</option>
<option value="6">6 = 30GH</option>
<option value="7-10">7 - 10 = 20GH</option>
<option value="11-15">11 - 15 = 10GH</option>

</select>
</div>

{/* SPENDING */}
<div className="pt-4 border-t border-[var(--border)]">
 <label className="form-label">🤑 Do you spend in KvK? </label>
  
  <select
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
  form.kvkSpending
    ? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
    : "gold-input"
}`}
value={form.kvkSpending}
onChange={e=>setForm({...form,kvkSpending:e.target.value})}
>

<option value="">Select Spending</option>

<option value="Only 50% Mine Boost">Only 50% Mine Boost</option>
<option value="Only Crystal Quest">Only Crystal Quest</option>
<option value="50% Boost + Crystal Quest">50% Boost + Crystal Quest</option>
<option value="50% + C.Q. + Few pop up bundles">50% + C.Q. + Few pop up bundles</option>
<option value="Buy all, max tech!">Buy all, max tech!</option>

</select>
</div>

{/* TROOP */}
<div className="pt-4 border-t border-[var(--border)]">
   <label className="form-label">🤔 What is your main troop type? </label>
<select
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
  form.troopType
    ? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
    : "gold-input"
}`}
value={form.troopType}
onChange={e=>setForm({...form,troopType:e.target.value})}
>

<option value="">Select Troop Type</option>

<option value="infantry">Infantry</option>
<option value="cavalry">Cavalry</option>
<option value="archer">Archer</option>
<option value="siege">Siege</option>

</select>
</div>

{/* PAIR */}
<div className="pt-4 border-t border-[var(--border)]">
<label className="form-label">🤔 For what commander/pair you need the commander: </label>
<input
placeholder="Commander Pair"
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
  form.pair
    ? "text-slate-400 border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
    : "gold-input text-white"
}`}
onChange={e=>setForm({...form,pair:e.target.value})}
/>
</div>

{/* COMMENT */}
<div className="pt-4 border-t border-[var(--border)]">
<label className="form-label">🤔 💬Additional personal comment?!: </label>
<textarea
placeholder="Comment"
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
  form.comment
    ? "text-slate-400 border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
    : "gold-input text-white"
}`}
onChange={e=>setForm({...form,comment:e.target.value})}
/>
  
</div>





  
<button
onClick={()=>setShowAdmin(true)}
className="fixed bottom-4 right-4 bg-black text-white px-3 py-2 rounded"
>
Admin
</button>


{showAdmin && (
<div className="fixed inset-0 bg-black/70 flex items-center justify-center">

<div className="bg-slate-900 p-6 rounded-lg w-80 space-y-3">

<h3 className="text-lg font-bold">Admin Access</h3>

<input
type="password"
placeholder="Enter password"
className="w-full px-3 py-2 rounded bg-slate-800"
value={password}
onChange={e=>setPassword(e.target.value)}
/>

<input
placeholder="pauthorization token"
className="w-full px-3 py-2 rounded bg-slate-800"
value={pauth}
onChange={e=>setPauth(e.target.value)}
/>

<input
placeholder="bauthorization token"
className="w-full px-3 py-2 rounded bg-slate-800"
value={bauth}
onChange={e=>setBauth(e.target.value)}
/>
<div className="flex gap-2 justify-end">

<button
onClick={()=>setShowAdmin(false)}
className="px-3 py-1 bg-slate-700 rounded"
>
Cancel
</button>

<button
onClick={()=>{
 if(password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD){

localStorage.setItem("rok_pauth", pauth)
localStorage.setItem("rok_bauth", bauth)

fetch("/api/mge-application",{
 method:"POST",
 headers:{
  "Content-Type":"application/json",
  pauthorization: pauth,
  bauthorization: bauth
 }
})
.then(r=>r.json())
.then(async data=>{
 console.log("Members updated:",data)

 const res = await fetch("/api/mge-application")
 const list = await res.json()

 setMembers(list)
})

setIsAdmin(true)
setShowAdmin(false)
 }else{
  alert("Wrong password")
 }
}}
className="px-3 py-1 bg-green-600 rounded"
>
Save
</button>

</div>

</div>
</div>
)}







  
<div className="flex justify-center pt-4">
<button
disabled={submitting}
onClick={submitApplication}
className="px-6 py-2 rounded-lg text-black font-semibold
bg-gradient-to-r from-[#FFD76B] via-[#FFC94A] to-[#FFB347]
hover:brightness-110 transition shadow-[0_4px_14px_rgba(255,200,90,0.35)]"
>
{submitting ? "Submitting..." : "Submit Application"}
</button>
</div>



</div> {/* closes card */}
</div> {/* closes page container */}
</div> {/* closes min-h-screen */}

</AppSidebar>
);
}
