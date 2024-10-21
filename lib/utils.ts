import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const defaultID = "00000000-0000-0000-0000-000000000000";
export const devUrl = "https://dev-career.assetwise.co.th/api";
export const bConnectionID = "7B93F134-D373-4227-B5A6-6B619FF0E355";