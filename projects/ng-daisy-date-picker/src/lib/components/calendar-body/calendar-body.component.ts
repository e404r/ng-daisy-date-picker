import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DaisyCalendarCell,
  DaisyDateColor,
  DaisyDateMode,
  DaisyDisabledDateFn,
  DaisyMonthCell,
  DaisyYearCell,
} from '../../types';
import { DaisyDateService } from '../../services/date.service';

@Component({
  selector: 'daisy-calendar-body',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-3 select-none">
      <!-- DATE VIEW (Days Grid) -->
      @if (mode === 'date') {
        <table class="w-full border-collapse">
          <thead>
            <tr>
              @for (name of weekDayNames; track name) {
                <th class="text-center font-medium text-xs text-base-content/60 py-1.5 w-9">
                  {{ name }}
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of dayRows; track $index) {
              <tr>
                @for (cell of row; track cell.title) {
                  <td
                    class="p-0 text-center relative h-9"
                    [class.bg-base-200]="cell.isInRange && !cell.isRangeStart && !cell.isRangeEnd"
                    [class.rounded-l-full]="cell.isRangeStart"
                    [class.rounded-r-full]="cell.isRangeEnd"
                  >
                    <!-- Date Button -->
                    <button
                      type="button"
                      class="size-8 mx-auto flex items-center justify-center text-xs rounded-full transition-all duration-150 relative"
                      [ngClass]="getCellClasses(cell)"
                      [disabled]="cell.isDisabled"
                      [title]="cell.title"
                      (click)="onDateClick(cell)"
                      (mouseenter)="cellHover.emit(cell.date)"
                      (mouseleave)="cellHover.emit(null)"
                    >
                      <span>{{ cell.dayNumber }}</span>

                      <!-- Today Dot Indicator -->
                      @if (cell.isToday && !cell.isSelected) {
                        <span
                          class="absolute bottom-1 size-1 rounded-full"
                          [ngClass]="getTodayDotClass()"
                        ></span>
                      }
                    </button>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      }

      <!-- MONTH VIEW (12 Months Grid) -->
      @if (mode === 'month') {
        <div class="grid grid-cols-3 gap-2 py-2">
          @for (m of monthList; track m.monthIndex) {
            <button
              type="button"
              class="btn btn-sm text-xs font-normal"
              [class.btn-active]="m.isSelected"
              [ngClass]="m.isSelected ? getActiveBtnClass() : 'btn-ghost'"
              [disabled]="m.isDisabled"
              (click)="monthSelect.emit(m.monthIndex)"
            >
              {{ m.label }}
            </button>
          }
        </div>
      }

      <!-- YEAR VIEW (12 Years Grid) -->
      @if (mode === 'year') {
        <div class="grid grid-cols-3 gap-2 py-2">
          @for (y of yearList; track y.year) {
            <button
              type="button"
              class="btn btn-sm text-xs font-normal"
              [class.btn-active]="y.isSelected"
              [ngClass]="y.isSelected ? getActiveBtnClass() : 'btn-ghost'"
              [disabled]="y.isDisabled"
              (click)="yearSelect.emit(y.year)"
            >
              {{ y.label }}
            </button>
          }
        </div>
      }

      <!-- DECADE VIEW (100-Year Grid) -->
      @if (mode === 'decade') {
        <div class="grid grid-cols-3 gap-2 py-2">
          @for (d of decadeList; track d.start) {
            <button
              type="button"
              class="btn btn-sm text-xs font-normal"
              [class.btn-active]="d.isCurrent"
              [ngClass]="d.isCurrent ? getActiveBtnClass() : 'btn-ghost'"
              (click)="decadeSelect.emit(d.start)"
            >
              {{ d.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class DaisyCalendarBodyComponent implements OnChanges {
  private readonly dateService = inject(DaisyDateService);

  @Input() viewDate: Date = new Date();
  @Input() mode: DaisyDateMode = 'date';
  @Input() selectedDate: Date | null = null;
  @Input() range: [Date | null, Date | null] | null = null;
  @Input() hoverDate: Date | null = null;
  @Input() color: DaisyDateColor = 'primary';
  @Input() disabledDate?: DaisyDisabledDateFn;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  @Output() dateSelect = new EventEmitter<Date>();
  @Output() monthSelect = new EventEmitter<number>();
  @Output() yearSelect = new EventEmitter<number>();
  @Output() decadeSelect = new EventEmitter<number>();
  @Output() cellHover = new EventEmitter<Date | null>();

  readonly weekDayNames = this.dateService.weekDayNames;
  dayRows: DaisyCalendarCell[][] = [];
  monthList: DaisyMonthCell[] = [];
  yearList: DaisyYearCell[] = [];
  decadeList: { start: number; end: number; label: string; isCurrent: boolean }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.refresh();
  }

  refresh(): void {
    if (this.mode === 'date') {
      this.dayRows = this.dateService.generateCalendarGrid(
        this.viewDate,
        this.selectedDate,
        this.range,
        this.hoverDate,
        this.disabledDate,
        this.minDate,
        this.maxDate
      );
    } else if (this.mode === 'month') {
      const grid = this.dateService.generateMonthGrid(
        this.viewDate,
        this.selectedDate,
        this.disabledDate
      );
      this.monthList = grid.flat();
    } else if (this.mode === 'year') {
      const result = this.dateService.generateYearGrid(this.viewDate, this.selectedDate);
      this.yearList = result.grid.flat();
    } else if (this.mode === 'decade') {
      const result = this.dateService.generateDecadeGrid(this.viewDate);
      this.decadeList = result.grid.flat();
    }
  }

  onDateClick(cell: DaisyCalendarCell): void {
    if (cell.isDisabled) return;
    this.dateSelect.emit(cell.date);
  }

  getCellClasses(cell: DaisyCalendarCell): Record<string, boolean> {
    const isSelected = cell.isSelected;
    const isCurrentM = cell.isCurrentMonth;
    const isDisabled = cell.isDisabled;

    return {
      'opacity-25 pointer-events-none': isDisabled,
      'text-base-content/40': !isCurrentM && !isSelected && !isDisabled,
      'text-base-content hover:bg-base-200': isCurrentM && !isSelected && !isDisabled,
      // DaisyUI selected color styles
      'bg-primary text-primary-content shadow-sm hover:bg-primary font-medium':
        isSelected && this.color === 'primary',
      'bg-secondary text-secondary-content shadow-sm hover:bg-secondary font-medium':
        isSelected && this.color === 'secondary',
      'bg-accent text-accent-content shadow-sm hover:bg-accent font-medium':
        isSelected && this.color === 'accent',
      'bg-neutral text-neutral-content shadow-sm hover:bg-neutral font-medium':
        isSelected && this.color === 'neutral',
      'bg-info text-info-content shadow-sm hover:bg-info font-medium':
        isSelected && this.color === 'info',
      'bg-success text-success-content shadow-sm hover:bg-success font-medium':
        isSelected && this.color === 'success',
      'bg-warning text-warning-content shadow-sm hover:bg-warning font-medium':
        isSelected && this.color === 'warning',
      'bg-error text-error-content shadow-sm hover:bg-error font-medium':
        isSelected && this.color === 'error',
    };
  }

  getActiveBtnClass(): string {
    switch (this.color) {
      case 'secondary':
        return 'btn-secondary text-secondary-content';
      case 'accent':
        return 'btn-accent text-accent-content';
      case 'neutral':
        return 'btn-neutral text-neutral-content';
      case 'info':
        return 'btn-info text-info-content';
      case 'success':
        return 'btn-success text-success-content';
      case 'warning':
        return 'btn-warning text-warning-content';
      case 'error':
        return 'btn-error text-error-content';
      default:
        return 'btn-primary text-primary-content';
    }
  }

  getTodayDotClass(): string {
    switch (this.color) {
      case 'secondary':
        return 'bg-secondary';
      case 'accent':
        return 'bg-accent';
      case 'neutral':
        return 'bg-neutral';
      default:
        return 'bg-primary';
    }
  }
}
