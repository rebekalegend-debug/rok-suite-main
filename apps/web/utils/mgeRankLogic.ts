export const HEADS = [
  180, 90, 60, 50, 40, 30,
  20, 20, 20, 20,
  10, 10, 10, 10, 10
]

export function getHeads(rank: number) {
  if (rank <= 15) return HEADS[rank - 1]
  return 0
}

export function getPoints(rank: number, total: number) {
  if (rank === 1) return "∞"

  const value = 6 + (total - rank)
  return value + "M"
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
