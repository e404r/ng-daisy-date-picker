# 🌼 ng-daisy-date-picker

> Modern Date & Range Picker for **Angular 21 & Angular 22+**, beautifully styled with **DaisyUI 5**, **Tailwind CSS**, and **date-fns**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://e404r.github.io/ng-daisy-date-picker/)
[![npm version](https://img.shields.io/npm/v/ng-daisy-date-picker?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/ng-daisy-date-picker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

👉 **Interactive Live Demo:** [https://e404r.github.io/ng-daisy-date-picker/](https://e404r.github.io/ng-daisy-date-picker/)

---

## 🌟 Features

- **Angular 21 & Angular 22+ Ready**: Pure Standalone Components, Signal-friendly, built for the latest Angular ecosystem.
- **DaisyUI 5 & Tailwind CSS**: Full theme support (`light`, `dark`, `synthwave`, `cyberpunk`, `emerald`, etc.), colors (`primary`, `secondary`, `accent`, `error`, etc.), and sizes (`sm`, `md`, `lg`).
- **Single DatePicker (`<daisy-date-picker>`)**: Day, Month, Year, and Decade view drill-down navigation.
- **Dual RangePicker (`<daisy-range-picker>`)**: Synchronized dual calendar panels with interactive continuous hover range preview.
- **TimePicker Support**: Optional integrated column time selection (Hours, Minutes, Seconds).
- **Quick Shortcuts & Presets**: Tag pills for Today, Yesterday, Last 7 Days, Last 30 Days, This Month, etc.
- **Angular Forms Integration**: Implements `ControlValueAccessor` (`[(ngModel)]`, `formControl`, `formControlName`, validation errors).
- **Flexible Positioning**: Uses `@angular/cdk/overlay` with viewport collision handling and z-index layering.
- **Lightweight & Modular**: Powered by modular `date-fns` utilities.

---

## 📦 Compatibility

| Package / Tool | Version Supported |
| :--- | :--- |
| **Angular** | **`^21.0.0` \|\| `^22.0.0` \|\| `>=21.0.0`** |
| **Node.js** | `>= 20.19.0` (Angular 21: `>=22.12.0`, Angular 22: `>=22.22.3`) |
| **Tailwind CSS** | `^4.0.0` or `^3.4.0` |
| **DaisyUI** | `^5.0.0` or `^4.0.0` |
| **date-fns** | `^3.0.0` \|\| `^4.0.0` |

---

## 🚀 Installation

```bash
npm install ng-daisy-date-picker @angular/cdk date-fns
```

In your global styles (`styles.css`):

```css
@import "@angular/cdk/overlay-prebuilt.css";
@import "tailwindcss";
@plugin "daisyui";
```

---

## 💻 Quick Usage

### 1. Single DatePicker

```html
<daisy-date-picker
  [(ngModel)]="selectedDate"
  color="primary"
  size="md"
  placeholder="Select date"
/>
```

With Time Picker & Presets:

```html
<daisy-date-picker
  [(ngModel)]="dateTime"
  [showTime]="true"
  [presets]="[
    { label: 'Today', value: today },
    { label: 'Tomorrow', value: tomorrow }
  ]"
/>
```

### 2. Date Range Picker

```html
<daisy-range-picker
  [(ngModel)]="dateRange"
  [presets]="[
    { label: 'Last 7 Days', value: last7Days },
    { label: 'This Month', value: thisMonth }
  ]"
  [placeholder]="['Start date', 'End date']"
/>
```

### 3. Reactive Forms

```html
<form [formGroup]="form">
  <daisy-date-picker formControlName="birthDate" />
  <daisy-range-picker formControlName="vacationPeriod" />
</form>
```

---

## 🛠 Project Structure

- `projects/ng-daisy-date-picker/`: Library source code.
- `projects/demo/`: Interactive showcase demo app with live theme switcher and playgrounds.

### Commands

```bash
# Build the library
npm run build ng-daisy-date-picker

# Run unit tests (Vitest)
npm test ng-daisy-date-picker

# Start demo showcase application
npm start
```
