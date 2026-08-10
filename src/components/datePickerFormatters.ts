import type {
  QunoDatePickerFormatters,
  QunoDatePickerLabels,
} from './datePickerTypes';
import type { IsoDate } from './dateRangeModel';

const formatDate = (date: IsoDate, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));

const formatMonth = (month: IsoDate, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${month}T00:00:00Z`));

const formatDayLabel = (date: IsoDate, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));

const formatWeekday = (dayIndex: number, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2026, 7, 2 + dayIndex)));

export const DEFAULT_LABELS: QunoDatePickerLabels = {
  calendar: 'Date range picker',
  selectedPeriod: 'Selected period',
  chooseDate: 'Choose a date',
  clear: 'Clear',
  start: 'Start',
  end: 'End',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  chooseAction: 'Change selected day to',
  startDate: 'Start date',
  endDate: 'End date',
  thisDate: 'This date',
  hint: 'Click the same date again to cycle its role, or drag to adjust the period.',
};

export const DEFAULT_FORMATTERS: QunoDatePickerFormatters = {
  date: formatDate,
  month: formatMonth,
  dayLabel: formatDayLabel,
  weekday: formatWeekday,
};
