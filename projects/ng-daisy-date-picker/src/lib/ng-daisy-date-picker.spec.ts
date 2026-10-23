import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DaisyDatePickerComponent } from './components/date-picker/date-picker.component';
import { DaisyRangePickerComponent } from './components/range-picker/range-picker.component';
import { DaisyDateService } from './services/date.service';

describe('DaisyDateService', () => {
  let service: DaisyDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaisyDateService);
  });

  it('should format date correctly', () => {
    const d = new Date(2026, 9, 23); // Oct 23, 2026
    expect(service.format(d, 'yyyy-MM-dd')).toBe('2026-10-23');
  });

  it('should generate 42 cells (6 full weeks) for month grid', () => {
    const d = new Date(2026, 9, 1);
    const grid = service.generateCalendarGrid(d, null);
    expect(grid.length).toBe(6);
    expect(grid[0].length).toBe(7);
  });

  it('should generate 12 months grid', () => {
    const d = new Date(2026, 0, 1);
    const grid = service.generateMonthGrid(d, null);
    expect(grid.length).toBe(4);
    expect(grid[0].length).toBe(3);
    expect(grid.flat().length).toBe(12);
  });
});

describe('DaisyDatePickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaisyDatePickerComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DaisyDatePickerComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should write and display date properly', () => {
    const fixture = TestBed.createComponent(DaisyDatePickerComponent);
    const component = fixture.componentInstance;
    const testDate = new Date(2026, 4, 15);
    component.writeValue(testDate);
    fixture.detectChanges();

    expect(component.innerValue).toEqual(testDate);
    expect(component.displayValue).toBe('2026-05-15');
  });

  it('should toggle open state', () => {
    const fixture = TestBed.createComponent(DaisyDatePickerComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isOpen).toBe(false);
    component.toggleOpen();
    expect(component.isOpen).toBe(true);
    component.close();
    expect(component.isOpen).toBe(false);
  });
});

describe('DaisyRangePickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaisyRangePickerComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DaisyRangePickerComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should write and display range properly', () => {
    const fixture = TestBed.createComponent(DaisyRangePickerComponent);
    const component = fixture.componentInstance;
    const start = new Date(2026, 4, 1);
    const end = new Date(2026, 4, 10);
    component.writeValue([start, end]);
    fixture.detectChanges();

    expect(component.innerValue).toEqual([start, end]);
    expect(component.displayStart).toBe('2026-05-01');
    expect(component.displayEnd).toBe('2026-05-10');
  });
});
