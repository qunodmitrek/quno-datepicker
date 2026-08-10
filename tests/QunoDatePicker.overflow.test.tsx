import { fireEvent, render } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { QunoDatePicker } from '../src';
import { day, overflowDay, slot, weekday } from './datePickerTestUtils';

describe('QunoDatePicker overflow drag zone', () => {
  it('uses compact leading context and keeps a trailing adjacent week', () => {
    render(<QunoDatePicker initialMonth="2026-08-01" />);
    const dates = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="day"]'),
    ).map((element) => element.dataset.date ?? '');

    expect(dates.filter((date) => date < '2026-08-01')).toHaveLength(5);
    expect(
      dates.filter((date) => date > '2026-08-31').length,
    ).toBeGreaterThanOrEqual(7);
  });

  it('reveals and accepts previous dates in the weekday drag zone', () => {
    const onChange = vi.fn();
    render(
      <QunoDatePicker
        defaultValue={{ start: '2026-08-10', end: '2026-08-20' }}
        initialMonth="2026-08-01"
        onChange={onChange}
      />,
    );

    fireEvent.pointerDown(day('2026-08-10'));
    fireEvent.pointerEnter(weekday(6));
    expect(overflowDay('2026-07-25')).toBeVisible();
    expect(overflowDay('2026-07-26')).toBeVisible();
    expect(
      document.querySelector('[data-date="2026-07-24"]'),
    ).not.toBeInTheDocument();
    expect(overflowDay('2026-07-25')).toHaveClass('quno-date-picker__day');

    fireEvent.pointerEnter(weekday(5));
    expect(overflowDay('2026-07-24')).toBeVisible();
    expect(
      document.querySelector('[data-date="2026-07-23"]'),
    ).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.pointerUp(overflowDay('2026-07-25'));
    expect(onChange).toHaveBeenLastCalledWith({
      start: '2026-07-25',
      end: '2026-08-20',
    });
    expect(slot('month-heading')).toHaveTextContent('July 2026');
  });

  it('restores weekday labels after leaving the drag zone', () => {
    const onChange = vi.fn();
    render(
      <QunoDatePicker
        defaultValue={{ start: '2026-08-10', end: '2026-08-20' }}
        initialMonth="2026-08-01"
        onChange={onChange}
      />,
    );

    fireEvent.pointerDown(day('2026-08-10'));
    fireEvent.pointerEnter(weekday(6));
    expect(overflowDay('2026-07-25')).toBeVisible();

    fireEvent.pointerLeave(slot('weekdays'));
    expect(
      document.querySelector('[data-slot="overflow-day"]'),
    ).not.toBeInTheDocument();
    expect(weekday(6)).toHaveTextContent('Sat');

    fireEvent.pointerEnter(day('2026-08-05'));
    fireEvent.pointerUp(day('2026-08-05'));
    expect(onChange).toHaveBeenLastCalledWith({
      start: '2026-08-05',
      end: '2026-08-20',
    });
  });
});
