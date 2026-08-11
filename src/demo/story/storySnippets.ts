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
  date,
  isToday,
  isWeekend,
  weekday,
}) => {
  const isNonWorking = weekday === 3; // Sunday is 0; Wednesday is 3.
  const isHoliday = date === '2026-08-27';
  return {
    className: [
      isToday && 'booking-date--today',
      isWeekend && 'booking-date--weekend',
      isNonWorking && 'booking-date--non-working',
      isHoliday && 'booking-date--holiday',
    ].filter(Boolean).join(' '),
    title: isHoliday ? 'Clinic holiday' : undefined,
  };
};

<QunoDatePicker getDayCellProps={styleDay} />;`;

export const localizationSnippet = `<QunoDatePicker
  locale="fr-FR"
  weekStartsOn={1}
  labels={{
    calendar: 'Sélecteur de période',
    selectedPeriod: 'Période sélectionnée',
    chooseDate: 'Choisir une date',
    clear: 'Effacer',
    start: 'Début',
    end: 'Fin',
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    openMonthNavigation: 'Ouvrir la navigation par mois et année',
    closeMonthNavigation: 'Fermer la navigation par mois et année',
    monthNavigation: 'Choisir un mois et une année',
    hint: '',
  }}
/>`;

export const weekStartSnippet = `import { useState } from 'preact/hooks';
import { QunoDatePicker, type WeekStart } from '@quno/datepicker';

const [weekStartsOn, setWeekStartsOn] =
  useState<WeekStart>(1);

<button onClick={() => setWeekStartsOn(0)}>Sunday</button>
<button onClick={() => setWeekStartsOn(1)}>Monday</button>
<button onClick={() => setWeekStartsOn(6)}>Saturday</button>

<QunoDatePicker weekStartsOn={weekStartsOn} />;`;

export const themingSnippet = `.booking-dates {
  --quno-picker-width: min(100%, 320px);
  --quno-picker-day-size: 36px;
  --quno-picker-primary: #6d28d9;
  --quno-picker-primary-soft: #f0e8ff;
  --quno-picker-selection-surface: #f0e8ff;
  --quno-picker-cycle-preview: #db2777;
  --quno-picker-pill-surface: #f0e8ff;
  --quno-picker-pill-border: #6d28d9;
  --quno-picker-pill-text: #4c1d95;
  --quno-picker-pill-radius: 8px;
  --quno-picker-pill-shadow: 4px 4px 0 #db2777;
  --quno-picker-pills-direction: row;
  --quno-picker-pills-wrap: nowrap;
  --quno-picker-pills-gap: 6px;
  --quno-picker-calendar-radius: 12px;
  --quno-picker-day-radius: 6px;
}

/* component.tsx */
<QunoDatePicker className="booking-dates" />`;
