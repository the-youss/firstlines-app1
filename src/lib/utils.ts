
import { clsx, type ClassValue } from "clsx"
import camelCase from 'lodash/camelCase'
import startCase from 'lodash/startCase'
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function calculatePercentage(total: number, valid: number) {
  return (total != 0 ? ((valid / total) * 100) : 0).toFixed(2)
}


export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim()
}


export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date))
}

export function toBoolean(value: string): boolean {
  return value === 'true';
}


export const createHeading = (text: string) => startCase(camelCase(text))

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}



export const capitalize = (str: string) => {
  if (!str.length) return str;
  const result = str[0].toUpperCase() + str.substring(1);
  return result;
};

export const getNamesFromName = (name: string) => {
  const names = name.split(' ') || [];
  return {
    firstname: names.slice(0, 1).join(' '),
    lastname: names.slice(1).join(' '),
  };
};

export const getServerUTCDate = () => new Date().toUTCString()

