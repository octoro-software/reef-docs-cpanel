import { format, isValid, startOfDay, subDays } from "date-fns";

// Function to get the ordinal suffix (st, nd, rd, th)
const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const generatePastDates = (daysCount) => {
  const today = new Date(); // January 18, 2025
  let dateOptions = [];

  for (let i = 0; i < daysCount; i++) {
    const pastDate = subDays(today, i);
    const day = format(pastDate, "d");
    const monthYear = format(pastDate, "MMMM yyyy");
    const formattedLabel = `${day}${getOrdinalSuffix(day)} ${monthYear}`;
    const formattedValue = format(pastDate, "yyyy-MM-dd");

    dateOptions.push({
      id: i + 1,
      label: formattedLabel,
      value: formattedValue,
    });
  }

  return dateOptions;
};

export const createAppDate = (date, withTime = false) => {
  if (!date) return "";

  // If date is a string in YYYY-MM-DD, parse as local
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    return withTime
      ? format(localDate, "do MMMM yyyy, hh:mm a")
      : format(localDate, "do MMMM yyyy");
  }

  // If date is an ISO string with Z, extract the date part and format as local
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(date)) {
    // Always show the date part as written, not shifted by timezone
    const [y, m, d] = date.slice(0, 10).split('-').map(Number);
    const localDate = new Date(y, m - 1, d);
    return withTime
      ? format(localDate, "do MMMM yyyy, hh:mm a")
      : format(localDate, "do MMMM yyyy");
  }

  // Otherwise, fallback to Date constructor
  const dateString = date?.replace(/\.(\d{3})\d*Z$/, ".$1Z");
  const parsed = new Date(dateString);
  return withTime
    ? format(parsed, "do MMMM yyyy, hh:mm a")
    : format(parsed, "do MMMM yyyy");
};

export const isPastDate = (date) => {
  const inputDate = startOfDay(new Date(date));
  const today = startOfDay(new Date());

  return inputDate < today;
};

export const isLastDate = (date, currentDate) => {
  const input = new Date(date);
  const current = new Date(currentDate);

  if (!isValid(input) || !isValid(current)) {
    return false; // or throw new Error('Invalid date input');
  }

  const inputDate = startOfDay(input).toISOString();
  const today = startOfDay(current).toISOString();

  return inputDate === today;
};

export const getTimeAgoShort = (dateString) => {
  const now = new Date();
  const then = new Date(dateString);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000); // in seconds

  if (diff < 60) return `a few seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 604800)}w`;
};
