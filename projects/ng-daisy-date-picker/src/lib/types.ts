export type DaisyDateMode = 'date' | 'month' | 'year' | 'decade';

export type DaisyDateSize = 'xs' | 'sm' | 'md' | 'lg';

export type DaisyDateColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type DaisyDateStatus = 'default' | 'error' | 'warning' | 'success';

export type DaisyDisabledDateFn = (current: Date) => boolean;

export interface DaisyPreset<T = Date | [Date, Date]> {
  label: string;
  value: T | (() => T);
}

export interface DaisyCalendarCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isDisabled: boolean;
  title: string;
}

export interface DaisyMonthCell {
  monthIndex: number;
  label: string;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface DaisyYearCell {
  year: number;
  label: string;
  isCurrentYear: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface DaisyTimeValue {
  hours: number;
  minutes: number;
  seconds: number;
}
