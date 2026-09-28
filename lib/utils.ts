import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns/format";
import { parseISO } from "date-fns/parseISO";
import { isValid } from "date-fns/isValid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return "₹0";
  }
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

export function formatDate(dateStr: string | Date | undefined | null, formatPattern: string = "dd MMM yyyy"): string {
  if (!dateStr) return "-";
  try {
    const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    if (!isValid(date)) return String(dateStr);
    return format(date, formatPattern);
  } catch {
    return String(dateStr);
  }
}

export function getStatusVariant(status: string): {
  bg: string;
  text: string;
  border: string;
  badge: "success" | "warning" | "destructive" | "info" | "neutral";
} {
  const s = (status || "").toLowerCase();
  if (["paid", "active", "verified", "approved", "completed"].includes(s)) {
    return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "success" };
  }
  if (["pending", "partially paid", "under review", "in progress", "auctioned"].includes(s)) {
    return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", badge: "warning" };
  }
  if (["overdue", "rejected", "closed", "defaulted", "cancelled"].includes(s)) {
    return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", badge: "destructive" };
  }
  if (["disbursed", "upcoming", "submitted"].includes(s)) {
    return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "info" };
  }
  return { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200", badge: "neutral" };
}
