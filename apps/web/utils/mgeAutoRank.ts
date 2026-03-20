// utils/mgeAutoRank.ts

export type RankPlayer = {
  id: string
  name: string
  desiredRank: number
  kvkContribution: number
  spend: string
  main: string
  rg?: string[]
  eq?: string
  purpose?: string
}

/* ---------------------------------- */
/* R&G STRENGTH */
/* ---------------------------------- */

function rgScore(rg?: string[]) {

  if (!rg || rg.length === 0) return 0

  let score = 0

  for (const r of rg) {

    if (r === "Both") score += 6
    else if (r === "Rally") score += 5
    else if (r === "Garrison") score += 5
    else if (r === "Rally-Y") score += 3
    else if (r === "Garrison-Y") score += 3
    else if (r === "R4") score += 2
    else if (r === "R5") score += 2
    else if (r === "No") score += 0

  }

  return score
}

/* ---------------------------------- */
/* KVK CONTRIBUTION */
/* ---------------------------------- */

function kvkScore(kvk:number){

  const percent = Math.round(kvk / 1_000_000)

  if (percent >= 300) return 5
  if (percent >= 100) return 4
  if (percent >= 50) return 2
  if (percent > 0) return 1

  return 0
}

/* ---------------------------------- */
/* EQUIPMENT */
/* ---------------------------------- */

function eqScore(eq?:string){

  if (!eq) return 0

  if (eq === "Legendary") return 4
  if (eq === "Leg.Purple") return 3
  if (eq === "Purple") return 2
  if (eq === "Bad/Low") return 0

  return 0
}

/* ---------------------------------- */
/* PURPOSE */
/* ---------------------------------- */

function purposeScore(purpose?:string){

  const map:Record<string,number> = {

    "Meta R/G Leader": 3,
    "Non-Meta R/G Leader": 2,
    "Field fight": 2,
    "Own city garrison": 1,
    "Slow building it": 0,
    "Just unlock": 0

  }

  return map[purpose || ""] ?? 0
}

/* ---------------------------------- */
/* SPENDING */
/* ---------------------------------- */

function spendScore(spend:string){

  if(spend === "Buy all, max tech!") return 3
  if(spend.includes("Few")) return 2
  if(spend.includes("50%")) return 1
  if(spend.includes("Crystal")) return 0
  if(spend === "F2P") return 0

  return 0
}



/* ---------------------------------- */
/* TOTAL SCORE */
/* ---------------------------------- */

function totalScore(p:RankPlayer){

  return (
    rgScore(p.rg) +
    kvkScore(p.kvkContribution) +
    eqScore(p.eq) +
    purposeScore(p.purpose) +
    spendScore(p.spend)
  )

}

/* ---------------------------------- */
/* AUTO RANK */
/* ---------------------------------- */

export function autoRankPlayers<T extends RankPlayer>(players:T[]):T[]{

  const sorted = [...players].sort((a,b)=>{

 
    /* ----------------------- */
    /* TOTAL SCORE */
    /* ----------------------- */

    const sa = totalScore(a)
    const sb = totalScore(b)

    if(sa !== sb) return sb - sa

    /* ----------------------- */
    /* DESIRED RANK LAST */
    /* ----------------------- */

    const wa = Number(a.desiredRank) || 999
    const wb = Number(b.desiredRank) || 999

    return wa - wb

  })

  return sorted
}
