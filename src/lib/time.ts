import * as tz from 'date-fns-tz'
import { parse } from 'date-fns'

export function localHHmmToUtcISOString(dateISO: string, hhmm: string, timezone: string) {
  const local = parse(`${dateISO} ${hhmm}`, 'yyyy-MM-dd HH:mm', new Date())
  const utc = tz.fromZonedTime(local, timezone)
  return utc.toISOString()
}

export function formatUtcToLocal(utcISO: string, timezone: string, fmt = 'yyyy-MM-dd HH:mm') {
  return tz.formatInTimeZone(new Date(utcISO), timezone, fmt)
}
