

export function getHeads(rank: number): number {
  if (rank === 1) return 20
  if (rank === 2) return 10
  if (rank === 3) return 5
  if (rank >= 4 && rank <= 10) return 4
  return 0
}

export function getPoints(rank: number, total: number) {
  if (rank === 1) return "∞"

  // Rank 2 fixed
  if (rank === 2) return "500k/50k"

  // Rank 3–10 → slope down to 200k/10k
  if (rank >= 3 && rank <= 10) {
    const maxKp = 500 // rank 2
    const minKp = 200 // rank 10

    const maxAp = 50
    const minAp = 10

    const t = (rank - 2) / (10 - 2) // normalized 0 → 1

    const kp = Math.round(maxKp - t * (maxKp - minKp))
    const ap = Math.round(maxAp - t * (maxAp - minAp))

    return `${kp}k/${ap}k`
  }

  // Rank 11+ → flat low cap
  return "200k/10k"
}

export function formatMillions(value: number) {
  if (!value) return "0"

  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "B"
  }

  if (value >= 1_000_000) {
    return Math.floor(value / 1_000_000) + "M"
  }

  if (value >= 1000) {
    return Math.floor(value / 1000) + "K"
  }

  return value.toString()
}

export function kvkContributionPercent(value: number) {
  if (!value) return { label: "0%", color: "red" }

  const percent = Math.floor(value / 1_000_000)

  if (percent >= 100) {
    return { label: `${percent}%`, color: "green" }
  }

  if (percent >= 70) {
    return { label: `${percent}%`, color: "yellow" }
  }

  if (percent >= 50) {
    return { label: `${percent}%`, color: "orange" }
  }

  return { label: `${percent}%`, color: "red" }
}
