import { render } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { QunoDatePicker, type DateRange } from '../src';
import { clickDay, drag } from './datePickerTestUtils';

const renderRange = () => {
  const onChange = vi.fn();
  render(
    <QunoDatePicker
      defaultValue={{ start: '2026-08-10', end: '2026-08-20' }}
      initialMonth="2026-08-01"
      onChange={onChange}
    />,
  );
  return onChange;
};

const clickThrough = (date: string, expected: DateRange[]): void => {
  const onChange = renderRange();
  expected.forEach((range, index) => {
    clickDay(date);
    expect(onChange).toHaveBeenNthCalledWith(index + 1, range);
  });
  expect(document.querySelector('[data-slot="date-action-menu"]')).toBeNull();
};

describe('QunoDatePicker repeated date clicks', () => {
  it.each([
    [
      'before',
      '2026-08-08',
      [
        { start: '2026-08-08', end: '2026-08-20' },
        { start: '2026-08-08', end: '2026-08-10' },
        { start: '2026-08-08', end: '2026-08-08' },
      ],
    ],
    [
      'after',
      '2026-08-25',
      [
        { start: '2026-08-10', end: '2026-08-25' },
        { start: '2026-08-20', end: '2026-08-25' },
        { start: '2026-08-25', end: '2026-08-25' },
      ],
    ],
  ])('cycles a date %s the range through endpoint and solo states', (_, date, expected) => {
    clickThrough(date, expected as DateRange[]);
  });

  it.each([
    [
      '2026-08-12',
      [
        { start: '2026-08-12', end: '2026-08-20' },
        { start: '2026-08-10', end: '2026-08-12' },
        { start: '2026-08-12', end: '2026-08-12' },
      ],
    ],
    [
      '2026-08-18',
      [
        { start: '2026-08-10', end: '2026-08-18' },
        { start: '2026-08-18', end: '2026-08-20' },
        { start: '2026-08-18', end: '2026-08-18' },
      ],
    ],
    [
      '2026-08-15',
      [
        { start: '2026-08-10', end: '2026-08-15' },
        { start: '2026-08-15', end: '2026-08-20' },
        { start: '2026-08-15', end: '2026-08-15' },
      ],
    ],
  ])('starts with the contextual endpoint for %s, then cycles', (date, expected) => {
    clickThrough(date, expected as DateRange[]);
  });

  it('starts a new cycle when a different date is clicked', () => {
    const onChange = renderRange();

    clickDay('2026-08-12');
    clickDay('2026-08-18');
    clickDay('2026-08-18');

    expect(onChange).toHaveBeenNthCalledWith(1, {
      start: '2026-08-12',
      end: '2026-08-20',
    });
    expect(onChange).toHaveBeenNthCalledWith(2, {
      start: '2026-08-12',
      end: '2026-08-18',
    });
    expect(onChange).toHaveBeenNthCalledWith(3, {
      start: '2026-08-18',
      end: '2026-08-20',
    });
  });

  it.each(['2026-08-10', '2026-08-20'])(
    'skips equivalent roles without restoring the range for endpoint %s',
    (date) => {
      const onChange = renderRange();

      clickDay(date);
      clickDay(date);
      clickDay(date);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith({ start: date, end: date });
    },
  );

  it('discards the original range after reaching single day', () => {
    const onChange = renderRange();

    clickDay('2026-08-08');
    clickDay('2026-08-08');
    clickDay('2026-08-08');
    clickDay('2026-08-08');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith({
      start: '2026-08-08',
      end: '2026-08-08',
    });
  });

  it('does not emit when every cycle role is equivalent', () => {
    const onChange = vi.fn();
    render(
      <QunoDatePicker
        defaultValue={{ start: '2026-08-15', end: '2026-08-15' }}
        initialMonth="2026-08-01"
        onChange={onChange}
      />,
    );

    clickDay('2026-08-15');
    clickDay('2026-08-15');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('treats movement from the repeated date as a drag, not another click', () => {
    const onChange = renderRange();

    clickDay('2026-08-12');
    drag('2026-08-12', '2026-08-08');

    expect(onChange).toHaveBeenLastCalledWith({
      start: '2026-08-08',
      end: '2026-08-20',
    });
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
