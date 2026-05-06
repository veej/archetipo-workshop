import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type TripStatus = "upcoming" | "ongoing" | "past";

export function formatDateRange(start: Date, end: Date): string {
  const fmt = (date: Date, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("it-IT", opts).format(date);

  const sy = start.getFullYear();
  const ey = end.getFullYear();
  const sm = fmt(start, { month: "short" });
  const em = fmt(end, { month: "short" });
  const sd = fmt(start, { day: "numeric" });
  const ed = fmt(end, { day: "numeric" });

  if (sy !== ey) return `${sd} ${sm} ${sy} – ${ed} ${em} ${ey}`;
  if (sm !== em) return `${sd} ${sm} – ${ed} ${em} ${sy}`;
  return `${sd}–${ed} ${sm} ${sy}`;
}

export function getTripStatus(startDate: Date, endDate: Date): TripStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  if (end < today) return "past";
  if (start <= today && today <= end) return "ongoing";
  return "upcoming";
}
