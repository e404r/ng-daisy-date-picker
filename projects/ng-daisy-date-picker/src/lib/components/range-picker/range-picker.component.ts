import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { OverlayModule, ConnectedPosition } from '@angular/cdk/overlay';
import {
  DaisyDateColor,
  DaisyDateMode,
  DaisyDateSize,
  DaisyDateStatus,
  DaisyDisabledDateFn,
  DaisyPreset,
  DaisyTimeValue,
} from '../../types';
import { DaisyDateService } from '../../services/date.service';
import { DaisyCalendarHeaderComponent } from '../calendar-header/calendar-header.component';
import { DaisyCalendarBodyComponent } from '../calendar-body/calendar-body.component';
import { DaisyTimePickerComponent } from '../time-picker/time-picker.component';
import { DaisyCalendarFooterComponent } from '../calendar-footer/calendar-footer.component';

@Component({
  selector: 'daisy-range-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    DaisyCalendarHeaderComponent,
    DaisyCalendarBodyComponent,
    DaisyTimePickerComponent,
    DaisyCalendarFooterComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaisyRangePickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative inline-block w-full font-sans">
      <!-- Input Trigger: Start Date -> End Date -->
      <div
        #triggerOrigin="cdkOverlayOrigin"
        cdkOverlayOrigin
        class="input input-bordered flex items-center justify-between gap-2 cursor-pointer transition-all duration-150 relative select-none"
        [ngClass]="getInputClasses()"
        (click)="toggleOpen()"
      >
        <!-- Calendar Prefix Icon -->
        <svg class="size-4 shrink-0 text-base-content/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>

        <!-- Start Date -->
        <span
          class="truncate text-left flex-1"
          [class.text-base-content/40]="!displayStart"
          [class.text-base-content]="displayStart"
        >
          {{ displayStart || placeholder[0] }}
        </span>

        <!-- Arrow Separator -->
        <span class="text-base-content/40 text-xs font-semibold px-1">→</span>

        <!-- End Date -->
        <span
          class="truncate text-left flex-1"
          [class.text-base-content/40]="!displayEnd"
          [class.text-base-content]="displayEnd"
        >
          {{ displayEnd || placeholder[1] }}
        </span>

        <!-- Clear Button or Caret -->
        @if (allowClear && (displayStart || displayEnd) && !disabled) {
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-circle size-4 min-h-0 text-base-content/50 hover:text-base-content ms-1"
            (click)="onClear($event)"
            title="Clear range"
          >
            ✕
          </button>
        } @else {
          <svg class="size-3.5 shrink-0 text-base-content/40 transition-transform duration-200 ms-1" [class.rotate-180]="isOpen" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        }
      </div>

      <!-- CDK Connected Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="triggerOrigin"
        [cdkConnectedOverlayOpen]="isOpen"
        [cdkConnectedOverlayPositions]="overlayPositions"
        [cdkConnectedOverlayHasBackdrop]="true"
        cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
        (backdropClick)="close()"
        (detach)="close()"
      >
        <div
          class="daisy-picker-overlay-pane bg-base-100 text-base-content border border-base-300 rounded-box shadow-2xl overflow-hidden mt-1.5 z-50 flex flex-col"
          [class]="panelClass"
        >
          <!-- Dual Calendar Panels (Left Month & Right Month) -->
          <div class="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-base-200">
            <!-- Left Calendar Panel (Month M) -->
            <div class="w-68 flex flex-col">
              <daisy-calendar-header
                [viewDate]="leftViewDate"
                [mode]="leftMode"
                [hideNext]="true"
                (prev)="onLeftPrev()"
                (superPrev)="onLeftSuperPrev()"
                (modeChange)="leftMode = $event"
              />

              <daisy-calendar-body
                [viewDate]="leftViewDate"
                [mode]="leftMode"
                [range]="activeRange"
                [hoverDate]="hoverDate"
                [color]="color"
                [disabledDate]="disabledDate"
                [minDate]="minDate"
                [maxDate]="maxDate"
                (dateSelect)="onRangeDateClick($event)"
                (cellHover)="hoverDate = $event"
                (monthSelect)="onLeftMonthSelect($event)"
                (yearSelect)="onLeftYearSelect($event)"
                (decadeSelect)="onLeftDecadeSelect($event)"
              />
            </div>

            <!-- Right Calendar Panel (Month M + 1) -->
            <div class="w-68 flex flex-col">
              <daisy-calendar-header
                [viewDate]="rightViewDate"
                [mode]="rightMode"
                [hidePrev]="true"
                (next)="onRightNext()"
                (superNext)="onRightSuperNext()"
                (modeChange)="rightMode = $event"
              />

              <daisy-calendar-body
                [viewDate]="rightViewDate"
                [mode]="rightMode"
                [range]="activeRange"
                [hoverDate]="hoverDate"
                [color]="color"
                [disabledDate]="disabledDate"
                [minDate]="minDate"
                [maxDate]="maxDate"
                (dateSelect)="onRangeDateClick($event)"
                (cellHover)="hoverDate = $event"
                (monthSelect)="onRightMonthSelect($event)"
                (yearSelect)="onRightYearSelect($event)"
                (decadeSelect)="onRightDecadeSelect($event)"
              />
            </div>

            <!-- Optional Time Picker for Start & End -->
            @if (showTime) {
              <div class="flex divide-x divide-base-200">
                <div class="flex flex-col">
                  <div class="text-[11px] font-semibold text-center py-1 bg-base-200 text-base-content/70">Start Time</div>
                  <daisy-time-picker
                    [value]="tempStart"
                    [showSeconds]="showSeconds"
                    [color]="color"
                    (timeChange)="onStartTimeChange($event)"
                  />
                </div>
                <div class="flex flex-col">
                  <div class="text-[11px] font-semibold text-center py-1 bg-base-200 text-base-content/70">End Time</div>
                  <daisy-time-picker
                    [value]="tempEnd"
                    [showSeconds]="showSeconds"
                    [color]="color"
                    (timeChange)="onEndTimeChange($event)"
                  />
                </div>
              </div>
            }
          </div>

          <!-- Footer (Presets + OK) -->
          @if (presets.length > 0 || showTime) {
            <daisy-calendar-footer
              [presets]="presets"
              [showToday]="false"
              [showOk]="showTime || (tempStart !== null && tempEnd === null)"
              [color]="color"
              (presetSelect)="onPresetSelect($event)"
              (okSelect)="onOkSelect()"
            />
          }
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        width: 100%;
      }
    `,
  ],
})
export class DaisyRangePickerComponent implements ControlValueAccessor {
  private readonly dateService = inject(DaisyDateService);

  @Input() placeholder: [string, string] = ['Start date', 'End date'];
  @Input() format?: string;
  @Input() showTime = false;
  @Input() showSeconds = false;
  @Input() allowClear = true;
  @Input() disabled = false;
  @Input() size: DaisyDateSize = 'md';
  @Input() color: DaisyDateColor = 'primary';
  @Input() status: DaisyDateStatus = 'default';
  @Input() disabledDate?: DaisyDisabledDateFn;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() presets: DaisyPreset<[Date, Date]>[] = [];
  @Input() panelClass = '';

  @Output() valueChange = new EventEmitter<[Date, Date] | null>();
  @Output() openChange = new EventEmitter<boolean>();
  @Output() calendarChange = new EventEmitter<[Date | null, Date | null]>();

  isOpen = false;
  leftMode: DaisyDateMode = 'date';
  rightMode: DaisyDateMode = 'date';

  innerValue: [Date, Date] | null = null;
  tempStart: Date | null = null;
  tempEnd: Date | null = null;
  hoverDate: Date | null = null;

  leftViewDate: Date = new Date();
  rightViewDate: Date = this.dateService.addMonths(new Date(), 1);

  readonly overlayPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ];

  private onChange: (value: [Date, Date] | null) => void = () => {};
  private onTouched: () => void = () => {};

  get activeFormat(): string {
    if (this.format) return this.format;
    if (this.showTime) {
      return this.showSeconds ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd HH:mm';
    }
    return 'yyyy-MM-dd';
  }

  get displayStart(): string {
    return this.innerValue?.[0]
      ? this.dateService.format(this.innerValue[0], this.activeFormat)
      : '';
  }

  get displayEnd(): string {
    return this.innerValue?.[1]
      ? this.dateService.format(this.innerValue[1], this.activeFormat)
      : '';
  }

  get activeRange(): [Date | null, Date | null] {
    if (this.tempStart && this.tempEnd) {
      return [this.tempStart, this.tempEnd];
    }
    if (this.tempStart) {
      return [this.tempStart, null];
    }
    if (this.innerValue) {
      return [this.innerValue[0], this.innerValue[1]];
    }
    return [null, null];
  }

  writeValue(value: [Date, Date] | null): void {
    if (
      Array.isArray(value) &&
      value.length === 2 &&
      this.dateService.isValid(value[0]) &&
      this.dateService.isValid(value[1])
    ) {
      this.innerValue = [value[0], value[1]];
      this.tempStart = this.dateService.clone(value[0]);
      this.tempEnd = this.dateService.clone(value[1]);
      this.syncViewDates(value[0]);
    } else {
      this.innerValue = null;
      this.tempStart = null;
      this.tempEnd = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleOpen(): void {
    if (this.disabled) return;
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.disabled || this.isOpen) return;
    this.isOpen = true;
    this.leftMode = 'date';
    this.rightMode = 'date';

    if (this.innerValue) {
      this.tempStart = this.dateService.clone(this.innerValue[0]);
      this.tempEnd = this.dateService.clone(this.innerValue[1]);
      this.syncViewDates(this.innerValue[0]);
    } else {
      this.tempStart = null;
      this.tempEnd = null;
      this.syncViewDates(new Date());
    }
    this.openChange.emit(true);
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.hoverDate = null;
    this.onTouched();
    this.openChange.emit(false);
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.setValue(null);
  }

  onRangeDateClick(date: Date): void {
    if (!this.tempStart || (this.tempStart && this.tempEnd)) {
      // First click: select start date
      this.tempStart = date;
      this.tempEnd = null;
      this.calendarChange.emit([this.tempStart, null]);
    } else {
      // Second click: select end date
      let start = this.tempStart;
      let end = date;

      if (end < start) {
        const swap = start;
        start = end;
        end = swap;
      }

      this.tempStart = start;
      this.tempEnd = end;
      this.calendarChange.emit([this.tempStart, this.tempEnd]);

      if (!this.showTime) {
        this.setValue([start, end]);
        this.close();
      }
    }
  }

  onStartTimeChange(time: DaisyTimeValue): void {
    const base = this.tempStart || new Date();
    this.tempStart = this.dateService.setTime(base, time.hours, time.minutes, time.seconds);
  }

  onEndTimeChange(time: DaisyTimeValue): void {
    const base = this.tempEnd || this.tempStart || new Date();
    this.tempEnd = this.dateService.setTime(base, time.hours, time.minutes, time.seconds);
  }

  onPresetSelect(preset: DaisyPreset<any>): void {
    const val = typeof preset.value === 'function' ? preset.value() : preset.value;
    if (Array.isArray(val) && val.length === 2 && this.dateService.isValid(val[0]) && this.dateService.isValid(val[1])) {
      this.setValue([val[0], val[1]]);
      this.close();
    }
  }

  onOkSelect(): void {
    if (this.tempStart && this.tempEnd) {
      let start = this.tempStart;
      let end = this.tempEnd;
      if (end < start) {
        const swap = start;
        start = end;
        end = swap;
      }
      this.setValue([start, end]);
    }
    this.close();
  }

  private setValue(range: [Date, Date] | null): void {
    this.innerValue = range;
    this.tempStart = range ? this.dateService.clone(range[0]) : null;
    this.tempEnd = range ? this.dateService.clone(range[1]) : null;
    this.onChange(this.innerValue);
    this.valueChange.emit(this.innerValue);
  }

  private syncViewDates(baseDate: Date): void {
    this.leftViewDate = this.dateService.clone(baseDate);
    this.rightViewDate = this.dateService.addMonths(this.leftViewDate, 1);
  }

  // Header Navigations
  onLeftPrev(): void {
    this.leftViewDate = this.dateService.subMonths(this.leftViewDate, 1);
    this.rightViewDate = this.dateService.subMonths(this.rightViewDate, 1);
  }

  onRightNext(): void {
    this.leftViewDate = this.dateService.addMonths(this.leftViewDate, 1);
    this.rightViewDate = this.dateService.addMonths(this.rightViewDate, 1);
  }

  onLeftSuperPrev(): void {
    this.leftViewDate = this.dateService.subYears(this.leftViewDate, 1);
    this.rightViewDate = this.dateService.subYears(this.rightViewDate, 1);
  }

  onRightSuperNext(): void {
    this.leftViewDate = this.dateService.addYears(this.leftViewDate, 1);
    this.rightViewDate = this.dateService.addYears(this.rightViewDate, 1);
  }

  onLeftMonthSelect(month: number): void {
    this.leftViewDate = new Date(this.leftViewDate.getFullYear(), month, 1);
    this.rightViewDate = this.dateService.addMonths(this.leftViewDate, 1);
    this.leftMode = 'date';
  }

  onRightMonthSelect(month: number): void {
    this.rightViewDate = new Date(this.rightViewDate.getFullYear(), month, 1);
    this.leftViewDate = this.dateService.subMonths(this.rightViewDate, 1);
    this.rightMode = 'date';
  }

  onLeftYearSelect(year: number): void {
    this.leftViewDate = new Date(year, this.leftViewDate.getMonth(), 1);
    this.rightViewDate = this.dateService.addMonths(this.leftViewDate, 1);
    this.leftMode = 'month';
  }

  onRightYearSelect(year: number): void {
    this.rightViewDate = new Date(year, this.rightViewDate.getMonth(), 1);
    this.leftViewDate = this.dateService.subMonths(this.rightViewDate, 1);
    this.rightMode = 'month';
  }

  onLeftDecadeSelect(startYear: number): void {
    this.leftViewDate = new Date(startYear, this.leftViewDate.getMonth(), 1);
    this.leftMode = 'year';
  }

  onRightDecadeSelect(startYear: number): void {
    this.rightViewDate = new Date(startYear, this.rightViewDate.getMonth(), 1);
    this.rightMode = 'year';
  }

  getInputClasses(): Record<string, boolean> {
    return {
      'input-disabled bg-base-200/50 cursor-not-allowed opacity-60': this.disabled,
      'input-sm text-xs h-8': this.size === 'sm',
      'input-md text-sm h-10': this.size === 'md',
      'input-lg text-base h-12': this.size === 'lg',
      'input-primary': this.color === 'primary' && this.status === 'default' && this.isOpen,
      'input-secondary': this.color === 'secondary' && this.status === 'default' && this.isOpen,
      'input-accent': this.color === 'accent' && this.status === 'default' && this.isOpen,
      'input-error': this.status === 'error',
      'input-warning': this.status === 'warning',
      'input-success': this.status === 'success',
    };
  }
}
