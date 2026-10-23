/*
 * Public API Surface of ng-daisy-date-picker
 */

export * from './lib/types';
export * from './lib/services/date.service';
export * from './lib/components/calendar-header/calendar-header.component';
export * from './lib/components/calendar-body/calendar-body.component';
export * from './lib/components/time-picker/time-picker.component';
export * from './lib/components/calendar-footer/calendar-footer.component';
export * from './lib/components/date-picker/date-picker.component';
export * from './lib/components/range-picker/range-picker.component';

import { DaisyDatePickerComponent } from './lib/components/date-picker/date-picker.component';
import { DaisyRangePickerComponent } from './lib/components/range-picker/range-picker.component';

export const DAISY_DATE_PICKER_DIRECTIVES = [
  DaisyDatePickerComponent,
  DaisyRangePickerComponent,
] as const;
