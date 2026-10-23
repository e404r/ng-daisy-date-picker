import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import {
  OverlayModule,
  ConnectedPosition,
} from '@angular/cdk/overlay';
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
  selector: 'daisy-date-picker',
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
      useExisting: forwardRef(() => DaisyDatePickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative inline-block w-full font-sans">
      <!-- Input Trigger -->
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

        <!-- Input Text / Display Value -->
        <span
          class="grow truncate text-left"
          [class.text-base-content/40]="!displayValue"
          [class.text-base-content]="displayValue"
        >
          {{ displayValue || placeholder }}
        </span>

        <!-- Clear Button or Suffix Caret -->
        @if (allowClear && displayValue && !disabled) {
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-circle size-4 min-h-0 text-base-content/50 hover:text-base-content"
            (click)="onClear($event)"
            title="Clear date"
          >
            ✕
          </button>
        } @else {
          <svg class="size-3.5 shrink-0 text-base-content/40 transition-transform duration-200" [class.rotate-180]="isOpen" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        }
      </div>

      <!-- CDK Connected Overlay Popup -->
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
          <!-- Top Panel: Calendar and Optional TimePicker Side-by-Side -->
          <div class="flex flex-col sm:flex-row">
            <!-- Calendar Section -->
            <div class="w-68 flex flex-col">
              <daisy-calendar-header
                [viewDate]="viewDate"
                [mode]="mode"
                (prev)="onHeaderPrev()"
                (next)="onHeaderNext()"
                (superPrev)="onHeaderSuperPrev()"
                (superNext)="onHeaderSuperNext()"
                (modeChange)="onModeChange($event)"
              />

              <daisy-calendar-body
                [viewDate]="viewDate"
                [mode]="mode"
                [selectedDate]="tempDate || innerValue"
                [color]="color"
                [disabledDate]="disabledDate"
                [minDate]="minDate"
                [maxDate]="maxDate"
                (dateSelect)="onDateSelect($event)"
                (monthSelect)="onMonthSelect($event)"
                (yearSelect)="onYearSelect($event)"
                (decadeSelect)="onDecadeSelect($event)"
              />
            </div>

            <!-- Optional TimePicker Section -->
            @if (showTime) {
              <daisy-time-picker
                [value]="tempDate || innerValue"
                [showSeconds]="showSeconds"
                [color]="color"
                (timeChange)="onTimeChange($event)"
              />
            }
          </div>

          <!-- Footer Section (Presets + Today / OK) -->
          @if (presets.length > 0 || showToday || showTime) {
            <daisy-calendar-footer
              [presets]="presets"
              [showToday]="showToday"
              [showOk]="showTime"
              [color]="color"
              (presetSelect)="onPresetSelect($event)"
              (todaySelect)="onTodaySelect()"
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
export class DaisyDatePickerComponent implements ControlValueAccessor {
  private readonly dateService = inject(DaisyDateService);

  @Input() placeholder = 'Select date';
  @Input() format?: string;
  @Input() showTime = false;
  @Input() showSeconds = false;
  @Input() showToday = true;
  @Input() allowClear = true;
  @Input() disabled = false;
  @Input() size: DaisyDateSize = 'md';
  @Input() color: DaisyDateColor = 'primary';
  @Input() status: DaisyDateStatus = 'default';
  @Input() disabledDate?: DaisyDisabledDateFn;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() presets: DaisyPreset<Date>[] = [];
  @Input() panelClass = '';

  @Output() valueChange = new EventEmitter<Date | null>();
  @Output() openChange = new EventEmitter<boolean>();
  @Output() ok = new EventEmitter<Date | null>();

  isOpen = false;
  mode: DaisyDateMode = 'date';
  innerValue: Date | null = null;
  tempDate: Date | null = null;
  viewDate: Date = new Date();

  // CDK Overlay Positions (bottom-start preferred, fallbacks to top-start, etc.)
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

  // ControlValueAccessor callbacks
  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  get activeFormat(): string {
    if (this.format) return this.format;
    if (this.showTime) {
      return this.showSeconds ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd HH:mm';
    }
    return 'yyyy-MM-dd';
  }

  get displayValue(): string {
    return this.dateService.format(this.innerValue, this.activeFormat);
  }

  // ControlValueAccessor Implementation
  writeValue(value: Date | string | null): void {
    if (value instanceof Date) {
      this.innerValue = this.dateService.isValid(value) ? value : null;
    } else if (typeof value === 'string' && value) {
      const parsed = new Date(value);
      this.innerValue = this.dateService.isValid(parsed) ? parsed : null;
    } else {
      this.innerValue = null;
    }

    if (this.innerValue) {
      this.viewDate = this.dateService.clone(this.innerValue);
      this.tempDate = this.dateService.clone(this.innerValue);
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
    this.mode = 'date';
    if (this.innerValue) {
      this.viewDate = this.dateService.clone(this.innerValue);
      this.tempDate = this.dateService.clone(this.innerValue);
    } else {
      this.viewDate = new Date();
      this.tempDate = null;
    }
    this.openChange.emit(true);
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.onTouched();
    this.openChange.emit(false);
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.setValue(null);
  }

  onDateSelect(date: Date): void {
    let finalDate = date;
    if (this.showTime && this.tempDate) {
      finalDate = this.dateService.setTime(
        date,
        this.tempDate.getHours(),
        this.tempDate.getMinutes(),
        this.tempDate.getSeconds()
      );
    }

    if (this.showTime) {
      this.tempDate = finalDate;
    } else {
      this.setValue(finalDate);
      this.close();
    }
  }

  onTimeChange(time: DaisyTimeValue): void {
    const base = this.tempDate || this.innerValue || new Date();
    this.tempDate = this.dateService.setTime(base, time.hours, time.minutes, time.seconds);
  }

  onPresetSelect(preset: DaisyPreset<any>): void {
    const val = typeof preset.value === 'function' ? preset.value() : preset.value;
    if (val && this.dateService.isValid(val)) {
      this.setValue(val);
      this.close();
    }
  }

  onTodaySelect(): void {
    const today = new Date();
    if (!this.dateService.isDateDisabled(today, this.disabledDate, this.minDate, this.maxDate)) {
      if (this.showTime) {
        this.tempDate = today;
        this.viewDate = today;
      } else {
        this.setValue(today);
        this.close();
      }
    }
  }

  onOkSelect(): void {
    const chosen = this.tempDate || this.innerValue;
    if (chosen) {
      this.setValue(chosen);
      this.ok.emit(chosen);
    }
    this.close();
  }

  private setValue(date: Date | null): void {
    this.innerValue = date;
    this.tempDate = date ? this.dateService.clone(date) : null;
    this.onChange(this.innerValue);
    this.valueChange.emit(this.innerValue);
  }

  // Header Navigations
  onHeaderPrev(): void {
    this.viewDate = this.dateService.subMonths(this.viewDate, 1);
  }

  onHeaderNext(): void {
    this.viewDate = this.dateService.addMonths(this.viewDate, 1);
  }

  onHeaderSuperPrev(): void {
    if (this.mode === 'date' || this.mode === 'month') {
      this.viewDate = this.dateService.subYears(this.viewDate, 1);
    } else if (this.mode === 'year') {
      this.viewDate = this.dateService.subYears(this.viewDate, 10);
    } else if (this.mode === 'decade') {
      this.viewDate = this.dateService.subYears(this.viewDate, 100);
    }
  }

  onHeaderSuperNext(): void {
    if (this.mode === 'date' || this.mode === 'month') {
      this.viewDate = this.dateService.addYears(this.viewDate, 1);
    } else if (this.mode === 'year') {
      this.viewDate = this.dateService.addYears(this.viewDate, 10);
    } else if (this.mode === 'decade') {
      this.viewDate = this.dateService.addYears(this.viewDate, 100);
    }
  }

  onModeChange(newMode: DaisyDateMode): void {
    this.mode = newMode;
  }

  onMonthSelect(monthIndex: number): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), monthIndex, 1);
    this.mode = 'date';
  }

  onYearSelect(year: number): void {
    this.viewDate = new Date(year, this.viewDate.getMonth(), 1);
    this.mode = 'month';
  }

  onDecadeSelect(startYear: number): void {
    this.viewDate = new Date(startYear, this.viewDate.getMonth(), 1);
    this.mode = 'year';
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
