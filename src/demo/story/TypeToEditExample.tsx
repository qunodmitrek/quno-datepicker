import {
  QunoDatePicker,
  type DateRange,
  type IsoDate,
} from '../../index';
import { parseDateInput, QunoDateInput } from '../../date-input';
import type { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

const expectedRange: DateRange = { start: '2025-08-19', end: '2026-08-19' };
const initialValue: DateRange = { start: '2026-05-21', end: '2026-08-18' };
const initialMonth: IsoDate = '2026-08-01';
const monthOf = (date: IsoDate): IsoDate => `${date.slice(0, 7)}-01` as IsoDate;

const changedEndpoint = (before: DateRange | null, after: DateRange | null): IsoDate | null => {
  if (!after) return null;
  if (before?.start === after.start && before.end === after.end) return null;
  if (!before || before.start !== after.start && before.end === after.end) return after.start;
  if (before.end !== after.end && before.start === after.start) return after.end;
  return after.end;
};

export const TypeToEditExample = (): JSX.Element => {
  const [value, setValue] = useState<DateRange | null>(initialValue);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [preview, setPreview] = useState<DateRange | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<IsoDate>(initialMonth);
  const [calendarRevision, setCalendarRevision] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent): void => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
      setPreview(null);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const moveCalendar = (before: DateRange | null, next: DateRange | null): void => {
    const endpoint = changedEndpoint(before, next);
    if (endpoint && monthOf(endpoint) !== calendarMonth) {
      setCalendarMonth(monthOf(endpoint));
      setCalendarRevision((revision) => revision + 1);
    }
  };
  const changeValue = (next: DateRange | null): void => {
    moveCalendar(preview ?? value, next);
    setPreview(null);
    setValue(next);
  };
  const previewDraft = (text: string): void => {
    const result = parseDateInput(text, {
      expectedRange, referenceDate: '2026-08-19', preferredDateOrder: 'dmy', parserLanguages: ['en', 'de'],
    });
    if (result.status !== 'success') return;
    moveCalendar(preview ?? value, result.value);
    setPreview(result.value);
  };
  const previewArrow: JSX.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    const input = event.currentTarget;
    setTimeout(() => previewDraft(input.value), 0);
  };
  const closeWhenFocusLeaves = (): void => {
    setTimeout(() => {
      if (rootRef.current?.contains(document.activeElement)) return;
      setOpen(false);
      setPreview(null);
    }, 0);
  };

  return (
    <div className="story__type-to-edit" ref={rootRef}>
      <header className="story__type-to-edit-summary">
        <div className="story__type-to-edit-input story__type-to-edit-input--summary">
          <QunoDateInput
            value={value}
            onChange={changeValue}
            onFocus={() => {
              setFocused(true);
              setOpen(true);
            }}
            onInput={() => {
              setPreview(null);
            }}
            onKeyDown={previewArrow}
            onBlur={() => {
              setFocused(false);
              closeWhenFocusLeaves();
            }}
            expectedRange={expectedRange}
            referenceDate="2026-08-19"
            preferredDateOrder="dmy"
            parserLanguages={['en', 'de']}
            placeholder="Choose a period"
            aria-label="Choose a period"
          />
        </div>
        {focused && value && (
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => changeValue(null)}>
            Clear
          </button>
        )}
      </header>
      {open && (
        <div className="story__type-to-edit-calendar">
          <QunoDatePicker
            key={calendarRevision}
            className={`story__picker story__picker--without-summary story__picker--type-to-edit${preview ? ' story__picker--draft' : ''}`}
            value={preview ?? value}
            onChange={changeValue}
            onVisibleMonthChange={setCalendarMonth}
            initialMonth={calendarMonth}
            labels={{ hint: '' }}
          />
        </div>
      )}
    </div>
  );
};
