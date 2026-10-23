import { Injectable } from '@angular/core';
import {
  format,
  isValid,
  isSameDay,
  isSameMonth,
  isSameYear,
  isToday,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWithinInterval,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import {
  DaisyCalendarCell,
  DaisyDisabledDateFn,
  DaisyMonthCell,
  DaisyYearCell,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class DaisyDateService {
  readonly weekDayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  readonly monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  format(date: Date | null | undefined, fmt: string = 'yyyy-MM-dd'): string {
    if (!date || !this.isValid(date)) return '';
    try {
      return format(date, fmt);
    } catch {
      return '';
    }
  }

  isValid(date: any): date is Date {
    return date instanceof Date && !isNaN(date.getTime()) && isValid(date);
  }

  clone(date: Date): Date {
    return new Date(date.getTime());
  }

  addMonths(date: Date, amount: number): Date {
    return addMonths(date, amount);
  }

  subMonths(date: Date, amount: number): Date {
    return subMonths(date, amount);
  }

  addYears(date: Date, amount: number): Date {
    return addYears(date, amount);
  }

  subYears(date: Date, amount: number): Date {
    return subYears(date, amount);
  }

  setTime(date: Date, hours: number, minutes: number, seconds: number): Date {
    const d = this.clone(date);
    return setSeconds(setMinutes(setHours(d, hours), minutes), seconds);
  }

  isDateDisabled(
    date: Date,
    disabledFn?: DaisyDisabledDateFn,
    minDate?: Date,
    maxDate?: Date
  ): boolean {
    if (minDate && isBefore(date, minDate) && !isSameDay(date, minDate)) {
      return true;
    }
    if (maxDate && isAfter(date, maxDate) && !isSameDay(date, maxDate)) {
      return true;
    }
    if (disabledFn) {
      return disabledFn(date);
    }
    return false;
  }

  /**
   * Generates a 6x7 (42 days) calendar grid for the view date, starting on Monday.
   */
  generateCalendarGrid(
    viewDate: Date,
    selectedDate: Date | null,
    range: [Date | null, Date | null] | null = null,
    hoverDate: Date | null = null,
    disabledFn?: DaisyDisabledDateFn,
    minDate?: Date,
    maxDate?: Date
  ): DaisyCalendarCell[][] {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);

    // Week starts on Monday (weekStartsOn: 1)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    let days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Always ensure 42 days (6 full weeks) for consistent calendar height
    while (days.length < 42) {
      const lastDay = days[days.length - 1];
      const nextDay = new Date(lastDay.getTime() + 24 * 60 * 60 * 1000);
      days.push(nextDay);
    }
    if (days.length > 42) {
      days = days.slice(0, 42);
    }

    // Determine range bounds for highlighting
    let rangeStart: Date | null = null;
    let rangeEnd: Date | null = null;

    if (range) {
      if (range[0] && range[1]) {
        rangeStart = range[0] <= range[1] ? range[0] : range[1];
        rangeEnd = range[0] <= range[1] ? range[1] : range[0];
      } else if (range[0] && hoverDate) {
        rangeStart = range[0] <= hoverDate ? range[0] : hoverDate;
        rangeEnd = range[0] <= hoverDate ? hoverDate : range[0];
      } else if (range[0]) {
        rangeStart = range[0];
        rangeEnd = range[0];
      }
    }

    const rows: DaisyCalendarCell[][] = [];
    for (let i = 0; i < 6; i++) {
      const row: DaisyCalendarCell[] = [];
      for (let j = 0; j < 7; j++) {
        const cellDate = days[i * 7 + j];
        const isCurrentM = isSameMonth(cellDate, viewDate);
        const isTodayDate = isToday(cellDate);
        const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;

        let isInRange = false;
        let isRangeStartCell = false;
        let isRangeEndCell = false;

        if (rangeStart && rangeEnd) {
          isInRange =
            isWithinInterval(cellDate, { start: rangeStart, end: rangeEnd }) ||
            isSameDay(cellDate, rangeStart) ||
            isSameDay(cellDate, rangeEnd);
          isRangeStartCell = isSameDay(cellDate, rangeStart);
          isRangeEndCell = isSameDay(cellDate, rangeEnd);
        }

        const isDisabled = this.isDateDisabled(cellDate, disabledFn, minDate, maxDate);

        row.push({
          date: cellDate,
          dayNumber: cellDate.getDate(),
          isCurrentMonth: isCurrentM,
          isToday: isTodayDate,
          isSelected: isSelected || isRangeStartCell || isRangeEndCell,
          isInRange,
          isRangeStart: isRangeStartCell,
          isRangeEnd: isRangeEndCell,
          isDisabled,
          title: this.format(cellDate, 'yyyy-MM-dd'),
        });
      }
      rows.push(row);
    }

    return rows;
  }

  /**
   * Generates a 4x3 month grid (12 months)
   */
  generateMonthGrid(
    viewDate: Date,
    selectedDate: Date | null,
    disabledFn?: DaisyDisabledDateFn
  ): DaisyMonthCell[][] {
    const year = viewDate.getFullYear();
    const rows: DaisyMonthCell[][] = [];

    for (let r = 0; r < 4; r++) {
      const row: DaisyMonthCell[] = [];
      for (let c = 0; c < 3; c++) {
        const monthIndex = r * 3 + c;
        const monthDate = new Date(year, monthIndex, 1);
        const isCurrentM =
          isSameMonth(monthDate, new Date()) && isSameYear(monthDate, new Date());
        const isSelected = selectedDate
          ? isSameMonth(monthDate, selectedDate) && isSameYear(monthDate, selectedDate)
          : false;

        const isDisabled = disabledFn ? disabledFn(monthDate) : false;

        row.push({
          monthIndex,
          label: this.monthNames[monthIndex],
          isCurrentMonth: isCurrentM,
          isSelected,
          isDisabled,
        });
      }
      rows.push(row);
    }

    return rows;
  }

  /**
   * Generates a 4x3 year grid (12 years around decade)
   */
  generateYearGrid(
    viewDate: Date,
    selectedDate: Date | null
  ): { startYear: number; endYear: number; grid: DaisyYearCell[][] } {
    const year = viewDate.getFullYear();
    const startYear = Math.floor(year / 10) * 10 - 1; // 1 year before decade
    const endYear = startYear + 11; // 1 year after decade

    const currentYear = new Date().getFullYear();
    const selectedY = selectedDate ? selectedDate.getFullYear() : null;

    const rows: DaisyYearCell[][] = [];
    for (let r = 0; r < 4; r++) {
      const row: DaisyYearCell[] = [];
      for (let c = 0; c < 3; c++) {
        const y = startYear + r * 3 + c;
        row.push({
          year: y,
          label: y.toString(),
          isCurrentYear: y === currentYear,
          isSelected: y === selectedY,
          isDisabled: false,
        });
      }
      rows.push(row);
    }

    return {
      startYear: startYear + 1,
      endYear: startYear + 10,
      grid: rows,
    };
  }

  /**
   * Generates a decade grid (100-year span, 12 decades in 4x3)
   */
  generateDecadeGrid(viewDate: Date): {
    startYear: number;
    endYear: number;
    grid: { start: number; end: number; label: string; isCurrent: boolean }[][];
  } {
    const year = viewDate.getFullYear();
    const startCentury = Math.floor(year / 100) * 100 - 10;
    const currentYear = new Date().getFullYear();

    const rows: { start: number; end: number; label: string; isCurrent: boolean }[][] = [];
    for (let r = 0; r < 4; r++) {
      const row: { start: number; end: number; label: string; isCurrent: boolean }[] = [];
      for (let c = 0; c < 3; c++) {
        const s = startCentury + (r * 3 + c) * 10;
        const e = s + 9;
        row.push({
          start: s,
          end: e,
          label: `${s}-${e}`,
          isCurrent: currentYear >= s && currentYear <= e,
        });
      }
      rows.push(row);
    }

    return {
      startYear: startCentury + 10,
      endYear: startCentury + 109,
      grid: rows,
    };
  }
}
