import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaisyDateMode } from '../../types';
import { DaisyDateService } from '../../services/date.service';

@Component({
  selector: 'daisy-calendar-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between px-3 py-2 border-b border-base-300 select-none">
      <!-- Left Super-prev / Prev Buttons -->
      <div class="flex items-center gap-0.5">
        @if (!hidePrev) {
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-base-content"
            (click)="superPrev.emit()"
            title="Previous Year / Decade"
          >
            <svg class="size-3.5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          </button>

          @if (mode === 'date') {
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-base-content"
              (click)="prev.emit()"
              title="Previous Month"
            >
              <svg class="size-3.5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          }
        }
      </div>

      <!-- Center Title / Mode Switchers -->
      <div class="flex items-center gap-1 font-semibold text-sm text-base-content">
        @if (mode === 'date') {
          <button
            type="button"
            class="btn btn-ghost btn-xs font-semibold hover:bg-base-200 px-1.5"
            (click)="modeChange.emit('month')"
          >
            {{ monthLabel }}
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-xs font-semibold hover:bg-base-200 px-1.5"
            (click)="modeChange.emit('year')"
          >
            {{ yearLabel }}
          </button>
        } @else if (mode === 'month') {
          <button
            type="button"
            class="btn btn-ghost btn-xs font-semibold hover:bg-base-200 px-1.5"
            (click)="modeChange.emit('year')"
          >
            {{ yearLabel }}
          </button>
        } @else if (mode === 'year') {
          <button
            type="button"
            class="btn btn-ghost btn-xs font-semibold hover:bg-base-200 px-1.5"
            (click)="modeChange.emit('decade')"
          >
            {{ decadeRangeLabel }}
          </button>
        } @else if (mode === 'decade') {
          <span class="px-1.5 text-xs text-base-content/70 font-medium">
            {{ centuryRangeLabel }}
          </span>
        }
      </div>

      <!-- Right Next / Super-next Buttons -->
      <div class="flex items-center gap-0.5">
        @if (!hideNext) {
          @if (mode === 'date') {
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-base-content"
              (click)="next.emit()"
              title="Next Month"
            >
              <svg class="size-3.5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          }

          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-base-content"
            (click)="superNext.emit()"
            title="Next Year / Decade"
          >
            <svg class="size-3.5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        }
      </div>
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
export class DaisyCalendarHeaderComponent {
  private readonly dateService = inject(DaisyDateService);

  @Input() viewDate: Date = new Date();
  @Input() mode: DaisyDateMode = 'date';
  @Input() hidePrev = false;
  @Input() hideNext = false;

  @Output() superPrev = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() superNext = new EventEmitter<void>();
  @Output() modeChange = new EventEmitter<DaisyDateMode>();

  get monthLabel(): string {
    return this.dateService.monthNames[this.viewDate.getMonth()];
  }

  get yearLabel(): string {
    return this.viewDate.getFullYear().toString();
  }

  get decadeRangeLabel(): string {
    const y = this.viewDate.getFullYear();
    const start = Math.floor(y / 10) * 10;
    return `${start}-${start + 9}`;
  }

  get centuryRangeLabel(): string {
    const y = this.viewDate.getFullYear();
    const start = Math.floor(y / 100) * 100;
    return `${start}-${start + 99}`;
  }
}
