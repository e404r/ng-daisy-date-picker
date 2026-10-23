import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaisyDateColor, DaisyTimeValue } from '../../types';

@Component({
  selector: 'daisy-time-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex border-t sm:border-t-0 sm:border-l border-base-300 h-64 text-xs select-none">
      <!-- Hours Column -->
      <div class="flex flex-col w-14 overflow-y-auto border-r border-base-200 py-1 scrollbar-thin">
        <div class="text-center font-semibold py-1 text-base-content/50 uppercase text-[10px] sticky top-0 bg-base-100">
          Hr
        </div>
        @for (hour of hoursList; track hour) {
          <button
            type="button"
            class="py-1 px-2 text-center hover:bg-base-200 transition-colors"
            [ngClass]="hour === selectedHours ? getSelectedClass() : 'text-base-content'"
            (click)="selectHour(hour)"
          >
            {{ padZero(hour) }}
          </button>
        }
      </div>

      <!-- Minutes Column -->
      <div class="flex flex-col w-14 overflow-y-auto border-r border-base-200 py-1 scrollbar-thin">
        <div class="text-center font-semibold py-1 text-base-content/50 uppercase text-[10px] sticky top-0 bg-base-100">
          Min
        </div>
        @for (minute of minutesList; track minute) {
          <button
            type="button"
            class="py-1 px-2 text-center hover:bg-base-200 transition-colors"
            [ngClass]="minute === selectedMinutes ? getSelectedClass() : 'text-base-content'"
            (click)="selectMinute(minute)"
          >
            {{ padZero(minute) }}
          </button>
        }
      </div>

      <!-- Seconds Column (Optional) -->
      @if (showSeconds) {
        <div class="flex flex-col w-14 overflow-y-auto py-1 scrollbar-thin">
          <div class="text-center font-semibold py-1 text-base-content/50 uppercase text-[10px] sticky top-0 bg-base-100">
            Sec
          </div>
          @for (sec of secondsList; track sec) {
            <button
              type="button"
              class="py-1 px-2 text-center hover:bg-base-200 transition-colors"
              [ngClass]="sec === selectedSeconds ? getSelectedClass() : 'text-base-content'"
              (click)="selectSecond(sec)"
            >
              {{ padZero(sec) }}
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
      .scrollbar-thin {
        scrollbar-width: thin;
      }
    `,
  ],
})
export class DaisyTimePickerComponent implements OnChanges {
  @Input() value: Date | null = null;
  @Input() showSeconds = false;
  @Input() color: DaisyDateColor = 'primary';

  @Output() timeChange = new EventEmitter<DaisyTimeValue>();

  selectedHours = 0;
  selectedMinutes = 0;
  selectedSeconds = 0;

  readonly hoursList = Array.from({ length: 24 }, (_, i) => i);
  readonly minutesList = Array.from({ length: 60 }, (_, i) => i);
  readonly secondsList = Array.from({ length: 60 }, (_, i) => i);

  ngOnChanges(changes: SimpleChanges): void {
    if (this.value) {
      this.selectedHours = this.value.getHours();
      this.selectedMinutes = this.value.getMinutes();
      this.selectedSeconds = this.value.getSeconds();
    }
  }

  selectHour(h: number): void {
    this.selectedHours = h;
    this.emitChange();
  }

  selectMinute(m: number): void {
    this.selectedMinutes = m;
    this.emitChange();
  }

  selectSecond(s: number): void {
    this.selectedSeconds = s;
    this.emitChange();
  }

  private emitChange(): void {
    this.timeChange.emit({
      hours: this.selectedHours,
      minutes: this.selectedMinutes,
      seconds: this.selectedSeconds,
    });
  }

  padZero(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  getSelectedClass(): string {
    switch (this.color) {
      case 'secondary':
        return 'bg-secondary text-secondary-content font-bold';
      case 'accent':
        return 'bg-accent text-accent-content font-bold';
      case 'neutral':
        return 'bg-neutral text-neutral-content font-bold';
      default:
        return 'bg-primary text-primary-content font-bold';
    }
  }
}
