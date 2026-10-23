import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaisyDateColor, DaisyPreset } from '../../types';

@Component({
  selector: 'daisy-calendar-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="px-3 py-2 border-t border-base-300 flex flex-wrap items-center justify-between gap-2 text-xs bg-base-100/50"
    >
      <!-- Presets Tags / Shortcuts -->
      <div class="flex flex-wrap items-center gap-1.5 grow">
        @for (preset of presets; track preset.label) {
          <button
            type="button"
            class="badge badge-sm badge-outline cursor-pointer hover:bg-base-200 transition-colors py-2 px-2 text-[11px]"
            (click)="presetSelect.emit(preset)"
          >
            {{ preset.label }}
          </button>
        }
      </div>

      <!-- Action Buttons (Today / OK) -->
      <div class="flex items-center gap-1.5 ms-auto">
        @if (showToday) {
          <button
            type="button"
            class="btn btn-ghost btn-xs text-base-content/80 hover:text-base-content"
            (click)="todaySelect.emit()"
          >
            {{ todayLabel }}
          </button>
        }

        @if (showOk) {
          <button
            type="button"
            class="btn btn-xs"
            [ngClass]="getOkBtnClass()"
            (click)="okSelect.emit()"
          >
            OK
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
export class DaisyCalendarFooterComponent {
  @Input() presets: DaisyPreset<any>[] = [];
  @Input() showToday = false;
  @Input() todayLabel = 'Today';
  @Input() showOk = false;
  @Input() color: DaisyDateColor = 'primary';

  @Output() presetSelect = new EventEmitter<DaisyPreset<any>>();
  @Output() todaySelect = new EventEmitter<void>();
  @Output() okSelect = new EventEmitter<void>();

  getOkBtnClass(): string {
    switch (this.color) {
      case 'secondary':
        return 'btn-secondary text-secondary-content';
      case 'accent':
        return 'btn-accent text-accent-content';
      case 'neutral':
        return 'btn-neutral text-neutral-content';
      default:
        return 'btn-primary text-primary-content';
    }
  }
}
