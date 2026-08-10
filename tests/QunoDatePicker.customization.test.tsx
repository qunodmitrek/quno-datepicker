import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { QunoDatePicker } from '../src';
import { day, slot } from './datePickerTestUtils';

describe('QunoDatePicker customization', () => {
  it('exposes labels, formatters, week starts, and style hooks', () => {
    render(
      <QunoDatePicker
        initialMonth="2026-08-01"
        weekStartsOn={0}
        className="consumer-root"
        classNames={{ day: 'consumer-day', monthHeading: 'consumer-month' }}
        labels={{
          calendar: 'Booking dates',
          chooseDate: 'Pick dates',
          clear: 'Reset dates',
          previousMonth: 'Back one month',
        }}
        formatters={{
          month: (month) => `Month:${month.slice(0, 7)}`,
          weekday: (dayIndex) => `Day:${dayIndex}`,
        }}
      />,
    );

    expect(slot('root')).toHaveClass('consumer-root');
    expect(slot('month-heading')).toHaveClass('consumer-month');
    expect(slot('month-heading')).toHaveTextContent('Month:2026-08');
    expect(day('2026-08-10')).toHaveClass('consumer-day');
    expect(screen.getByRole('button', { name: 'Back one month' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Reset dates' })).toBeDisabled();
    expect(slot('selection-summary')).toHaveTextContent('Pick dates');
    expect(document.querySelector('[data-slot="weekday"]')).toHaveTextContent(
      'Day:0',
    );
  });
});
