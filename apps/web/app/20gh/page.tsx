'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
declare global {
  interface Window {
    __TEST_TIME__?: string
  }
}

function get20ghTimes(now: Date) {
  const ONE_DAY = 86400000
  const TWO_WEEKS = 14 * ONE_DAY

  // Known start of a 20GH event (use a real past or future 20GH start date at 00:00 UTC)
  // From your calendar, you can use e.g. 2026-04-17 as anchor
  const KNOWN_20GH_START = new Date(Date.UTC(2026, 3, 3, 0, 0, 0))   // April 17, 2026

  let current20ghStart = new Date(KNOWN_20GH_START)

  while (current20ghStart.getTime() + TWO_WEEKS <= now.getTime()) {
    current20ghStart = new Date(current20ghStart.getTime() + TWO_WEEKS)
  }

  // Registration opens 4 days before the event (on the 13th in your example)
  const registrationOpen = new Date(current20ghStart.getTime() - 4 * ONE_DAY)

  // Registration closes 1 day before the event (on the 16th at 00:00 UTC)
  const registrationClose = new Date(current20ghStart.getTime() - ONE_DAY)

  return {
    current20ghStart,
    registrationOpen,
    registrationClose
  }
}
function get20ghCountdown() {
  const now = (window as any).__TEST_TIME__
    ? new Date((window as any).__TEST_TIME__)
    : new Date()

  const times = get20ghTimes(now)
const { registrationClose, registrationOpen } = times

  let target: Date
  let mode: "OPEN" | "CLOSED"

if (now < registrationOpen) {
  target = registrationOpen
  mode = "CLOSED"

} else if (now >= registrationOpen && now < registrationClose) {
  target = registrationClose
  mode = "OPEN"

} else {
  const nextNow = new Date(now.getTime() + 14 * 86400000)
  const next = get20ghTimes(nextNow)

  target = next.registrationOpen
  mode = "CLOSED"
}

 const diffMs = Math.max(0, target.getTime() - now.getTime())

// 🔥 force instant phase switch at boundary
if (diffMs === 0) {
  setTimeout(() => {
    (window as any).forceUpdate20GH?.()
  }, 50)
}

const totalSeconds = Math.floor(diffMs / 1000)

  return {
    mode,
    target,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isUrgent: totalSeconds <= 86400
  }
}

function get20ghStatus() {
  const now = (window as any).__TEST_TIME__
    ? new Date((window as any).__TEST_TIME__)
    : new Date()

  const { registrationClose, registrationOpen } = get20ghTimes(now)

  const isClosed = now < registrationOpen || now >= registrationClose

  return { isClosed }
}
export default function twghPage() {

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

const [alreadyApplied,setAlreadyApplied] = useState(false)
  const [shakeConfirm, setShakeConfirm] = useState(false)
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
const [loadingCommanders,setLoadingCommanders] = useState(false)
const [commanders,setCommanders] = useState<string[]>([])
const [selectedCommander,setSelectedCommander] = useState("")
const [submitting,setSubmitting] = useState(false)
  const [members,setMembers] = useState<{id:string,name:string}[]>([])
const [search,setSearch] = useState("")
  const [selectedMember,setSelectedMember] = useState<{id:string,name:string} | null>(null)
const [TwentyGhClosed, setTwentyGhClosed] = useState(false)
  const [submitError,setSubmitError] = useState(false)
const [confirmed, setConfirmed] = useState(false)
const [confirmError, setConfirmError] = useState(false)
type CountdownMode = "OPEN" | "CLOSED"

const [countdown, setCountdown] = useState<{
  mode: CountdownMode
  target: Date
  days: number
  hours: number
  minutes: number
  seconds: number
  isUrgent: boolean
}>({
  mode: "CLOSED",
  target: new Date(),
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isUrgent: false
})

  
const [missing,setMissing] = useState({
  member:false,
  commander:false,
  purpose:false,
  rank:false,
  kvk:false,
  troop:false,
  equipment:false
})

function triggerConfirmError() {
  setConfirmError(true)
  setShakeConfirm(true)

  document.querySelector("#confirm-box")?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  })

  setTimeout(() => {
    setShakeConfirm(false)
    setConfirmError(false)
  }, 800)
}
  
useEffect(() => {
 function update() {
  const status = get20ghStatus()
  const countdownData = get20ghCountdown()

 if (!(window as any).__loggedOnce) {
  console.log("STATUS:", status)
  ;(window as any).__loggedOnce = true
}

  setCountdown(countdownData)
  setTwentyGhClosed(status.isClosed)
}
 
  (window as any).forceUpdate20GH = update

  update()

  const interval = setInterval(update, 1000)
  return () => clearInterval(interval)
}, [])
  
useEffect(() => {
  function check() {
    const { isClosed } = get20ghStatus()
    setTwentyGhClosed(isClosed)
  }

  check()

  const interval = setInterval(check, 60000)

  return () => clearInterval(interval)
}, [])
  
useEffect(() => {

async function checkApplication(){

  const savedId = localStorage.getItem("20gh_applied_id")

  if(!savedId){
    setAlreadyApplied(false)
    return
  }

  const res = await fetch("/api/20gh-application",{ method:"PUT" })
  const applied = await res.json()

  const exists = applied.some((m:any)=>String(m.id) === String(savedId))

  if(exists){
    setAlreadyApplied(true)
  } else {
    localStorage.removeItem("20gh_applied_id")
    setAlreadyApplied(false)
  }

}

checkApplication()

},[])

  
useEffect(()=>{

async function loadCommanders(){

  setLoadingCommanders(true)

  const res = await fetch("/api/20gh-commanders")
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

    const update = await fetch("/api/20gh-application",{
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

  const res = await fetch("/api/20gh-application")
  const list = await res.json()

  console.log("Members from sheet:", list.length)

  setMembers(list)
}

loadMembers()

}, [])
async function submitApplication(){

const hasManualInput = search.trim().length > 0

const newMissing = {
  member: !selectedMember && !hasManualInput,
  commander: !selectedCommander && !commanderSearch.trim(),
  purpose: !form.purpose,
  rank: !form.rank,
  kvk: !form.kvkSpending,
  troop: !form.troopType,
  equipment: !commanderFile
}

setMissing(newMissing)

const hasError = Object.values(newMissing).some(v => v)

if((!selectedMember && !search.trim()) || hasError){

  setSubmitError(true)

  setTimeout(()=>setSubmitError(false),1200)

  return
}
 const data = new FormData()

let finalId = ""
let finalName = ""

if (selectedMember) {
  finalId = selectedMember.id
  finalName = selectedMember.name
} else {
  // manual input fallback
  finalId = search.trim()
  finalName = search.trim()
}
data.append("id", finalId)
data.append("name", finalName)
const finalCommander = selectedCommander || commanderSearch.trim()
data.append("commander", finalCommander)

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

await fetch("/api/20gh-application",{
  method:"POST",
  body:data
})

localStorage.setItem("20gh_applied_id", finalId)
setSubmitting(false)

setAlreadyApplied(true)


}

  
const filteredCommanders = commanders
  .filter(c =>
    !commanderSearch ||
    c.toLowerCase().includes(commanderSearch.toLowerCase())
  )
  .sort((a,b)=>a.localeCompare(b))
  
const filteredMembers = members
  .filter(m => {
    const q = search.toLowerCase()
    return (
      !search ||
      m.name?.toLowerCase().includes(q) ||
      m.id?.includes(q)
    )
  })
 .sort((a,b)=>(a.name || "").localeCompare(b.name || ""))

const skillsFilled =
skills.skill1 > 0 ||
skills.skill2 > 0 ||
skills.skill3 > 0 ||
skills.skill4 > 0

function formatUTC(date: Date) {
  return date.toLocaleString("en-GB", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC"
  }) + " UTC"
}
  
return (
<>
  <AppSidebar>

  {/* POPUP - fixed overlay */}
  {TwentyGhClosed && (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{ left: '260px' }}
    >
      <div className="bg-zinc-900/95 rounded-xl p-6 w-[340px] text-center flex flex-col gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <div className="text-lg font-semibold text-yellow-400">
          ⚔️ Closed ⚔️
        </div>
        <div className="text-sm leading-relaxed space-y-2">
          <div className="text-emerald-400 font-semibold text-base">
            Registration opens in{" "}
           {countdown.days > 0 && `${countdown.days}D `}
{countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0
  ? "Updating..."
  : `${String(countdown.hours).padStart(2,"0")}:${String(countdown.minutes).padStart(2,"0")}:${String(countdown.seconds).padStart(2,"0")}`
}
          </div>
          <div className="text-xs text-zinc-400">
            at {formatUTC(countdown.target)}
          </div>
        </div>
      </div>
    </div>
  )}

  {/* PAGE CONTENT - only this part blurs */}
  <div className="flex justify-center items-start">
    <div className="w-full max-w-4xl p-4 md:p-8">

      {/* BLUR ONLY CONTENT */}
      <div
        className={`transition ${
          TwentyGhClosed ? "blur-[1px] brightness-90 pointer-events-none select-none" : ""
        }`}
      >

  <div className="text-center mt-2 text-sm font-medium">

<span className={countdown.isUrgent ? "text-red-400" : "text-white"}>
{countdown.mode === "OPEN"
  ? "20GH Registration closes in "
  : "Registration opens in "}
{countdown.days > 0 && `${countdown.days}D `}
{String(countdown.hours).padStart(2,"0")}:
{String(countdown.minutes).padStart(2,"0")}:
{String(countdown.seconds).padStart(2,"0")}
<br/>
<span className="text-xs text-zinc-400">
at {formatUTC(countdown.target)}
</span>
</span>

</div>

<h2
  className="border-b pb-2 mb-2 text-center font-semibold leading-tight
  text-[34px] sm:text-[44px] md:text-[56px]"
  style={{
    color: "#FFD76B",
    textShadow: "0 0 18px rgba(255,215,107,0.35)",
    wordBreak: "break-word"
  }}
>
  <span className="hidden sm:inline">.˳·˖✶𓆩20GH Registration𓆪✶˖·˳.</span>
  <span className="sm:hidden">20GH Registration</span>
</h2>

{alreadyApplied ? (
<>
<p className="mge-info">
Your application is already submitted.<br/>
If you want to modify your application click on the button below.
</p>

<div className="flex justify-center pt-4">
<button
onClick={()=>{
  localStorage.removeItem("20gh_applied_id")
  setAlreadyApplied(false)
}}
className="px-6 py-2 rounded-lg text-black font-semibold
bg-gradient-to-r from-[#FFD76B] via-[#FFC94A] to-[#FFB347]
hover:brightness-110 transition shadow-[0_4px_14px_rgba(255,200,90,0.35)]"
>
Submit New Application
</button>
</div>
</>
) : (
<>
<p className="mge-info">
  To ensure your registration is processed correctly, all fields in this form must be completed correctly.
  <br />
  Missing information may result in your registration not being considered properly and could affect your ranking!
  <br /><br />

⚠️ MGE is designed for Rally & Garrison leaders.
<br />
Players who have posted in the R&G forum channel on Discord
   <br />
will have higher priority in ranking if they meet the requirements.
 <br /><br />
Check [⚔️⭑𝐑𝐆⭑𝐋𝐞𝐚𝐝𝐞𝐫𝐬] channel on DC or click{" "}
 <a 
  href="https://discord.com/channels/1469700544162566320/1469722276353015919" 
  target="_blank" 
  rel="noopener noreferrer"
  className="underline text-red-400 hover:text-red-300"
> 
   HERE
</a> to open it!

<br /><br />

  
  ‼️Before you register please read carefully the rules!‼️
  <br />

  <a
    href="https://queenium.vercel.app/MGE-Rules"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-2 px-5 py-2.5 rounded-xl 
bg-gradient-to-br from-[#ff3b3b] via-[#e60023] to-[#8b0000]
hover:from-[#ff4d4d] hover:via-[#ff002a] hover:to-[#a30000]
text-white font-semibold tracking-wide
shadow-[0_0_20px_rgba(255,0,60,0.45)]
border border-white/10
transition-all duration-300"
  >
    Open rules!
  </a>
</p>

<div className="space-y-2">

<label className="form-label">
🆔 Name or ID 
</label>

<div className="relative">

<input
ref={memberInputRef}
type="text"
autoComplete="off"
placeholder="Search or type your name / ID..."
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
caret-[#FFD76B]
${selectedMember ? "text-slate-400" : "text-white"}
${
missing.member
? "border-red-500 shadow-[0_0_10px_rgba(255,60,60,0.7)]"
: selectedMember
? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.45)]"
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
onClick={() => {
  setForm(prev => ({ ...prev, id: m.id }))
  setSelectedMember(m)
setMissing(prev => ({...prev, member:false}))
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
<label className="form-label">👲 Wanted Commander</label>

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
missing.commander
? "border-red-500 shadow-[0_0_10px_rgba(255,60,60,0.7)]"
: selectedCommander
? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.45)]"
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
  const value = e.target.value
  setCommanderSearch(value)
  setSelectedCommander("")
  setMissing(prev => ({ ...prev, commander:false }))
}}
/>

</div>

{commanderFocus && !selectedCommander && (
  <div className="rounded mt-2 p-2 max-h-40 overflow-y-auto"
    style={{
      background:"var(--background-card)",
      border:"1px solid var(--border)"
    }}
  >

    {filteredCommanders.length > 0 ? (
      filteredCommanders.map(c => (
        <div
          key={c}
          className="px-2 py-1 hover:bg-slate-700 cursor-pointer rounded"
          onClick={()=>{
            setSelectedCommander(c)
            setCommanderSearch("")
            setMissing(prev => ({...prev, commander:false}))
          }}
 >
          {c}
        </div>
      ))
    ) : (
      <div className="text-xs text-zinc-400 px-2 py-1">
        No match found — you can still type manually
      </div>
    )}

  </div>
)}

</div>

<label className="form-label flex items-center gap-2 mb-3">
🔢 Commander skill lvl:
<span className="text-xs opacity-60 flex items-center gap-1">
(👆 tap to change)
</span>
</label>

<div
className={`rounded-lg p-4 transition cursor-pointer ${
  skillsFilled
    ? "border border-[#FFD76B] shadow-[0_0_14px_rgba(255,215,107,0.35)]"
    : "gold-glow-soft hover:gold-glow"
}`}
>

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

🥋 Equipment!
</label>

<label className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition
${missing.equipment
? "border-red-500 shadow-[0_0_10px_rgba(255,60,60,0.7)]"
: "gold-input hover:gold-glow"
}`}
  >
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
onChange={(e)=>{
  const file = e.target.files?.[0] || null
  setCommanderFile(file)

  if(file){
    setMissing(prev => ({ ...prev, equipment:false }))
  }
}}
/>
</label>

</div>
      
{/* PURPOSE */}
<div className="pt-4 border-t border-[var(--border)]">
<label className="form-label">🎯 Commander purpose: </label>

<select
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
missing.purpose
? "border-red-500 shadow-[0_0_10px_rgba(255,60,60,0.7)]"
: form.purpose
? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
: "gold-input"
}`}
value={form.purpose}
onChange={e=>{
  const value = e.target.value
  setForm({...form,purpose:value})
  setMissing(prev => ({...prev, purpose:false}))
}}
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
  <label className="form-label">🏅 Wanted Rank: </label>
<select
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
missing.rank
? "border-red-500 shadow-[0_0_10px_rgba(255,60,60,0.7)]"
: form.rank
? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
: "gold-input"
}`}
value={form.rank}
onChange={e=>{
  const value = e.target.value
  setForm({...form,rank:value})
  setMissing(prev => ({...prev, rank:false}))
}}
>

<option value="">Select Rank - GH - Aprox Points</option>

<option value="1">1 = 180GH (Unlimited)</option>
<option value="2">2 = 90GH (19-25M)</option>
<option value="3">3 = 60GH (18-20M)</option>
<option value="4">4 = 50GH (17-20M)</option>
<option value="5">5 = 40GH (16M)</option>
<option value="6">6 = 30GH (15M)</option>
<option value="7-10">7 - 10 = 20GH (11-14M)</option>
<option value="11-15">11 - 15 = 10GH (6-10M)</option>

</select>
</div>

{/* SPENDING */}
<div className="pt-4 border-t border-[var(--border)]">
 <label className="form-label">💸 Spender lvl in KvK: </label>
  
  <select
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
missing.kvk
? "border-red-500 shadow-[0_0_10px_rgba(255,60,60,0.7)]"
: form.kvkSpending
? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
: "gold-input"
}`}
value={form.kvkSpending}
onChange={e=>{
  const value = e.target.value
  setForm({...form,kvkSpending:value})
  setMissing(prev => ({...prev, kvk:false}))
}}
>

<option value="">Select Spending</option>
    
<option value="F2P">F2P</option>
<option value="Only 50% Mine Boost">Only 50% Mine Boost</option>
<option value="Only Crystal Quest">Only Crystal Quest</option>
<option value="50% Boost + Crystal Quest">50% Boost + Crystal Quest</option>
<option value="50% + C.Q. + Few bundles">50% + C.Q. + Few bundles</option>
<option value="Buy all, max tech!">Buy all, max tech!</option>

</select>
</div>

{/* TROOP */}
<div className="pt-4 border-t border-[var(--border)]">
   <label className="form-label">⚖️ Main troop type? </label>
<select
className={`w-full px-3 py-2 rounded
focus:outline-none focus:ring-0 focus:ring-offset-0
focus:border-[#FFD76B]
focus:shadow-[0_0_12px_rgba(255,215,107,0.45)]
${
missing.troop
? "border-red-500 shadow-[0_0_10px_rgba(255,60,60,0.7)]"
: form.troopType
? "border-[#FFD76B] shadow-[0_0_12px_rgba(255,215,107,0.35)]"
: "gold-input"
}`}
value={form.troopType}
onChange={e=>{
  const value = e.target.value
  setForm({...form,troopType:value})
  setMissing(prev => ({...prev, troop:false}))
}}
>

<option value="">Select Troop Type</option>

<option value="Infantry">Infantry</option>
<option value="Cavalry">Cavalry</option>
<option value="Archer">Archer</option>
<option value="Siege">Siege</option>

</select>
</div>

{/* PAIR */}
<div className="pt-4 border-t border-[var(--border)]">
<label className="form-label">🤔 Commander Pair: </label>
<input
placeholder="For what commander\pair you need the wanted commander?"
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
<label className="form-label">💭 Additional personal comment?!: </label>
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
className="
fixed top-3 right-3
w-7 h-7
flex items-center justify-center
rounded-md
bg-black/60
hover:bg-black
text-white
z-50
"
>
👑
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

fetch("/api/20gh-application",{
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

 const res = await fetch("/api/20gh-application")
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

<div className="pt-4">
{/* CONFIRMATION */}
<div
  id="confirm-box"
  className={`pt-6 border-t border-[var(--border)] space-y-3 ${
    shakeConfirm ? "animate-shake" : ""
  }`}
>

<label className={`flex items-start gap-3 cursor-pointer text-sm leading-relaxed transition
${confirmError ? "text-red-400" : confirmed ? "text-[#FFD76B]" : "text-zinc-300"}
`}>

<input
type="checkbox"
checked={confirmed}
onChange={(e)=>{
  setConfirmed(e.target.checked)
  if(e.target.checked) setConfirmError(false)
}}
className={`mt-1 w-4 h-4 cursor-pointer
${confirmed ? "accent-[#FFD76B] scale-110" : "accent-zinc-500"}
transition`}
/>

<span>
I confirm that I have fully read and understood the rules, penalties, and the ranking system explained in this form!.
<br />
I agree to follow all rules and accept any consequences if I break them.
</span>

</label>
{!confirmed && (
  <div
    className={`text-xs text-center mt-1 ${
      confirmError ? "text-red-400" : "text-zinc-500"
    } ${shakeConfirm ? "animate-shake" : ""}`}
  >
    Please confirm before submitting
  </div>
)}
</div>

{/* SUBMIT */}
<div className="flex justify-center pt-4">
  <button
    onClick={(e) => {
      if (!confirmed) {
        e.preventDefault()
        triggerConfirmError()
        return
      }

      submitApplication()
    }}
    className={`px-6 py-2 rounded-lg text-black font-semibold transition
    ${shakeConfirm ? "animate-shake" : ""} 
    ${
      !confirmed
        ? "bg-zinc-600 text-zinc-400 cursor-pointer"
        : submitError || confirmError
        ? "bg-red-500 shadow-[0_0_16px_rgba(255,60,60,0.8)]"
        : "bg-gradient-to-r from-[#FFD76B] via-[#FFC94A] to-[#FFB347] hover:brightness-110 shadow-[0_4px_14px_rgba(255,200,90,0.35)]"
    }`}
  >
    {submitting ? "Submitting..." : "Submit Application"}
  </button>
</div>
</div>

</>
)}

      </div> {/* END BLUR CONTENT */}

    </div> {/* ROOT ISOLATION */}
  </div>

  </AppSidebar>

</>
);
}
