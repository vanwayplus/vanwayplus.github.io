export function getDefaultHue(): number {
  const fallback = '40'
  const configCarrier = document.getElementById('config-carrier')
  return parseInt(configCarrier?.dataset.hue || fallback)
}

export function getHue(): number {
  const stored = localStorage.getItem('hue')
  if (!stored) return getDefaultHue()

  const parsed = parseInt(stored)
  if (Number.isNaN(parsed) || parsed === 30) {
    return getDefaultHue()
  }

  return parsed
}

export function setHue(hue: number): void {
  localStorage.setItem('hue', String(hue))
  const r = document.querySelector(':root')
  if (!r) {
    return
  }
  r.style.setProperty('--hue', hue)
}
