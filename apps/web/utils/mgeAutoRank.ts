// utils/mgeAutoRank.ts

export type RankPlayer = {
  id: string
  name: string
  desiredRank: number
  kvkContribution: number
  spend: string
  main: string
}

/**
 * Basic ranking logic
 * priority:
 * 1️⃣ Desired rank (W.Rank)
 */
export function autoRankPlayers<T extends { desiredRank: number }>(players: T[]): T[] {

  const sorted = [...players].sort((a,b)=>{

    const wa = Number(a.desiredRank) || 999
    const wb = Number(b.desiredRank) || 999

    return wa - wb

  })

  return sorted
}
