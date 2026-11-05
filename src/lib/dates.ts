const pad = (n: number) => String(n).padStart(2, '0')

export function todayISO(): string {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(5, 7))
  const day = Number(value.slice(8, 10))
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export function ageOn(birthISO: string, onISO: string): number {
  const by = Number(birthISO.slice(0, 4))
  const bm = Number(birthISO.slice(5, 7))
  const bd = Number(birthISO.slice(8, 10))
  const ny = Number(onISO.slice(0, 4))
  const nm = Number(onISO.slice(5, 7))
  const nd = Number(onISO.slice(8, 10))
  let age = ny - by
  if (nm < bm || (nm === bm && nd < bd)) age -= 1
  return age
}

export function formatDate(iso: string): string {
  if (!isValidISODate(iso)) return iso
  const date = new Date(
    Number(iso.slice(0, 4)),
    Number(iso.slice(5, 7)) - 1,
    Number(iso.slice(8, 10)),
  )
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}