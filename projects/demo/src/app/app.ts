import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  DaisyDatePickerComponent,
  DaisyRangePickerComponent,
  DaisyPreset,
  DaisyDateColor,
  DaisyDateSize,
  DaisyDateStatus,
} from 'ng-daisy-date-picker';
import {
  addDays,
  subDays,
  addWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DaisyDatePickerComponent,
    DaisyRangePickerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Theme management
  currentTheme = signal<string>('dark');
  readonly themes = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'dracula',
    'nord',
  ];

  // Section 1: Basic Date Picker
  basicDate = signal<Date | null>(new Date());
  formattedDate = signal<Date | null>(new Date());
  sizeVariant = signal<DaisyDateSize>('md');
  colorVariant = signal<DaisyDateColor>('primary');

  // Section 2: DateTime Picker & Presets
  dateTimeValue = signal<Date | null>(new Date());
  presetDateValue = signal<Date | null>(null);
  statusVariant = signal<DaisyDateStatus>('default');

  singlePresets: DaisyPreset<Date>[] = [
    { label: 'Today', value: () => new Date() },
    { label: 'Tomorrow', value: () => addDays(new Date(), 1) },
    { label: '+1 Week', value: () => addWeeks(new Date(), 1) },
    { label: '+1 Month', value: () => addMonths(new Date(), 1) },
  ];

  // Section 3: Range Picker
  basicRange = signal<[Date, Date] | null>([
    subDays(new Date(), 7),
    new Date(),
  ]);
  dateTimeRange = signal<[Date, Date] | null>(null);

  rangePresets: DaisyPreset<[Date, Date]>[] = [
    { label: 'Today', value: () => [new Date(), new Date()] },
    {
      label: 'Last 7 Days',
      value: () => [subDays(new Date(), 6), new Date()],
    },
    {
      label: 'Last 30 Days',
      value: () => [subDays(new Date(), 29), new Date()],
    },
    {
      label: 'This Month',
      value: () => [startOfMonth(new Date()), endOfMonth(new Date())],
    },
    {
      label: 'Last Month',
      value: () => [
        startOfMonth(subMonths(new Date(), 1)),
        endOfMonth(subMonths(new Date(), 1)),
      ],
    },
  ];

  // Section 4: Restrictions
  boundedDate = signal<Date | null>(null);
  minBound = subDays(new Date(), 10);
  maxBound = addDays(new Date(), 15);

  disabledWeekendsFn = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };

  // Section 5: Reactive Form
  demoForm: FormGroup;
  formSubmittedValue = signal<any>(null);

  constructor(private fb: FormBuilder) {
    this.demoForm = this.fb.group({
      bookingDate: [new Date(), [Validators.required]],
      vacationRange: [null, [Validators.required]],
    });

    // Apply default theme to HTML tag
    document.documentElement.setAttribute('data-theme', this.currentTheme());
  }

  setTheme(theme: string): void {
    this.currentTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  onSubmitForm(): void {
    if (this.demoForm.valid) {
      this.formSubmittedValue.set(this.demoForm.value);
    } else {
      this.demoForm.markAllAsTouched();
    }
  }

  onResetForm(): void {
    this.demoForm.reset();
    this.formSubmittedValue.set(null);
  }
}
