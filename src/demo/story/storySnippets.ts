export const packageSnippet = `import { QunoDatePicker, type DateRange } from '@quno/datepicker';
import '@quno/datepicker/styles.css';`;

export const basicUsageSnippet = `${packageSnippet}
import { useState } from 'preact/hooks';

const [dates, setDates] = useState<DateRange | null>(null);

<QunoDatePicker value={dates} onChange={setDates} />;`;

export const customDaysSnippet = `import {
  QunoDatePicker,
  type QunoDatePickerDayCellCustomizer,
} from '@quno/datepicker';

const styleDay: QunoDatePickerDayCellCustomizer = ({
  isToday,
  isWeekend,
}) => ({
  className: isWeekend ? 'booking-date--weekend' : undefined,
  title: isToday ? 'Today' : undefined,
});

<QunoDatePicker getDayCellProps={styleDay} />;`;

export const themingSnippet = `.booking-dates {
  --quno-picker-primary: #6d28d9;
  --quno-picker-primary-soft: #f0e8ff;
  --quno-picker-calendar-radius: 12px;
  --quno-picker-day-radius: 6px;
}

/* component.tsx */
<QunoDatePicker className="booking-dates" />`;
