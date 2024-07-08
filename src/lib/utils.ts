import { type ClassValue, clsx } from "clsx"
import { addDays, format, isValid, parse } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const convertTo24HourFormat = (time12h: string): string => {
  const parsedDate = parse(time12h, 'hh:mm a', new Date());
  const time24h = format(parsedDate, 'HH:mm');
  return time24h;
};


//Generating Days of week
export const getDaysOfWeek = (start: string, numberOfDays: number): string[] => {
  const startDt = parseDate(start);
  if (!startDt) {
    throw new Error(`Invalid start date: ${start}`);
  }

  const days: string[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = addDays(startDt, i);


    const day = format(currentDate, 'EEEE');
    days.push(day);
  }

  return days;
};

//Format Date in 16/06/2024
export function formatSpecificDate(dateStr: string) {
  const parsedDate = parseDate(dateStr);
  if (parsedDate) {
    return format(parsedDate, 'dd/MM/yyyy');
  }
  return dateStr;
}

//Parsing date to date string
export function parseDate(dateStr: string): Date | null {
  const formats = ['dd-MM-yyyy', 'dd/MM/yyyy', 'dd-MM-yy', 'dd/MM/yy'];
  for (const fmt of formats) {
    let parsedDate = parse(dateStr, fmt, new Date());

    // Handle two-digit year case
    const year = parsedDate.getFullYear();
    if (year < 100) {
      parsedDate.setFullYear(2000 + year);
    }

    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  console.error('Invalid date format:', dateStr);
  return null;
}

export function calculateTotalDays(startDateStr: string, endDateStr: string): number {
  // Parse the dates from strings
  const [startDay, startMonth, startYear] = startDateStr.split('-').map(Number);
  const [endDay, endMonth, endYear] = endDateStr.split('-').map(Number);

  // const startDate = new Date(startYear, startMonth - 1, startDay);
  // const endDate = new Date(endYear, endMonth - 1, endDay);
  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);

  let differenceInMs = 0
  if (startDate && endDate) {
    differenceInMs = endDate.getTime() - startDate.getTime();
  }
  // Calculate the difference in milliseconds

  // Convert the difference from milliseconds to days and add 1 to include the start date
  const totalDays = differenceInMs / (1000 * 60 * 60 * 24) + 1;

  return totalDays;
}


//Formatting Date to Mon 01 Jan, 2018 this format
export function formatDate(date: string) {
  const parsedDate = parseDate(date);

  const formated = format(parsedDate!, 'EEE dd MMM, yyyy');

  return formated;
}


//Custom CSV to json converter
export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split(/\r?\n/);
  const headers = lines[0].split(',');
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    const values = lines[i].split(',');
    const record: any = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j].trim()] = values[j].trim();
    }
    records.push(record);
  }

  return records;
};

//Generating Jodi'
export function genAnk(panel: string): string {
  // Define your genAnk logic here
  // Example: Sum the digits and return the last digit as a string
  const sum = panel.split("").reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return (sum % 10).toString();
}