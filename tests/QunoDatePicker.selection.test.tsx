import { fireEvent, render, screen } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { QunoDatePicker, type DateRange } from '../src';
import { clickDay, day, drag, slot } from './datePickerTestUtils';

describe('QunoDatePicker selection', () => {
  it('supports empty, single-day, edited range, and clear', () => {
    const changes: Array<DateRange | null> = [];
    render(
      <QunoDatePicker
        initialMonth="2026-08-01"
        onChange={(value) => changes.push(value)}
      />,
    );

    clickDay('2026-08-10');
    expect(changes.at(-1)).toEqual({
      start: '2026-08-10',
      end: '2026-08-10',
    });
    fireEvent.pointerEnter(day('2026-08-15'));
    expect(changes).toHaveLength(1);
    expect(day('2026-08-15')).not.toHaveAttribute('data-preview');
    expect(day('2026-08-15')).not.toHaveAttribute('data-range-end');
    expect(day('2026-08-10')).toHaveAttribute('data-range-start', 'true');
    expect(day('2026-08-10')).toHaveAttribute('data-range-end', 'true');
    expect(slot('selection-summary')).toHaveTextContent('10 Aug 2026');
    clickDay('2026-08-15');
    expect(changes.at(-1)).toEqual({
      start: '2026-08-10',
      end: '2026-08-15',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(changes.at(-1)).toBeNull();
    expect(slot('month-heading')).toHaveTextContent('August 2026');
  });

  it('does not paint or commit a prospective period on hover', () => {
    const onChange = vi.fn();
    render(
      <QunoDatePicker
        defaultValue={{ start: '2026-08-10', end: '2026-08-20' }}
        initialMonth="2026-08-01"
        onChange={onChange}
      />,
    );

    fireEvent.pointerEnter(day('2026-08-15'));
    expect(onChange).not.toHaveBeenCalled();
    expect(day('2026-08-20')).toHaveAttribute('data-range-end', 'true');
    expect(day('2026-08-20')).not.toHaveAttribute('data-preview-action');
    expect(day('2026-08-15')).not.toHaveAttribute('data-preview-endpoint');
    expect(day('2026-08-15')).not.toHaveAttribute('data-range-end');
    expect(slot('selection-summary')).toHaveTextContent(
      '10 Aug 2026 – 20 Aug 2026',
    );
  });

  it('drags an endpoint across the other endpoint and swaps it', () => {
    const onChange = vi.fn();
    render(
      <QunoDatePicker
        defaultValue={{ start: '2026-08-10', end: '2026-08-20' }}
        initialMonth="2026-08-01"
        onChange={onChange}
      />,
    );

    fireEvent.pointerDown(day('2026-08-20'));
    fireEvent.pointerEnter(day('2026-08-07'));
    fireEvent.pointerEnter(day('2026-08-05'));
    fireEvent.pointerUp(day('2026-08-05'));
    expect(onChange).toHaveBeenLastCalledWith({
      start: '2026-08-05',
      end: '2026-08-10',
    });
  });

  it('drags the whole range and preserves its inclusive duration', () => {
    const onChange = vi.fn();
    render(
      <QunoDatePicker
        defaultValue={{ start: '2026-08-10', end: '2026-08-15' }}
        initialMonth="2026-08-01"
        onChange={onChange}
      />,
    );

    drag('2026-08-12', '2026-08-18');
    expect(onChange).toHaveBeenLastCalledWith({
      start: '2026-08-16',
      end: '2026-08-21',
    });
  });
});
