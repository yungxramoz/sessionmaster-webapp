export function vuetifyDate(isoDateString: string): string {
  return isoDateString.substr(0, 10)
}

export function displayDate(isoDateString: string): string {
  return new Date(isoDateString).toDateString()
}
