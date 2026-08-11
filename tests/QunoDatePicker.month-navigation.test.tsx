import { act, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QunoDatePicker } from '../src';
import { clickDay, slot } from './datePickerTestUtils';

const openMonthNavigation = (): void => {
  fireEvent.click(
    screen.getByRole('button', { name: /Open month and year navigation/ }),
  );
};

afterEach(() => vi.useRealTimers());

describe('QunoDatePicker month and year navigation', () => {
  it('toggles the quick jump within the calendar frame', () => {
    render(<QunoDatePicker initialMonth="2026-08-01" />);

    openMonthNavigation();
    expect(slot('calendar')).toHaveAttribute('data-view', 'month-navigation');
    expect(slot('month-navigation')).toBeVisible();
    expect(document.querySelector('[data-slot="grid"]')).toBeNull();
    expect(screen.getAllByRole('button', { name: 'August 2026' })[0])
      .toHaveAttribute('aria-current', 'date');
    expect(document.querySelectorAll('[data-slot="month-option"]').length)
      .toBeLessThanOrEqual(72);

    fireEvent.click(
      screen.getByRole('button', { name: /Close month and year navigation/ }),
    );
    expect(slot('calendar')).toHaveAttribute('data-view', 'dates');
    expect(slot('grid')).toBeVisible();

    openMonthNavigation();
    fireEvent.keyDown(
      screen.getByRole('button', { name: /Close month and year navigation/ }),
      { key: 'Escape' },
    );
    expect(slot('calendar')).toHaveAttribute('data-view', 'dates');
  });

  it('jumps to a month without changing the selected range', () => {
    const onChange = vi.fn();
    const onVisibleMonthChange = vi.fn();
    render(
      <QunoDatePicker
        initialMonth="2026-08-01"
        defaultValue={{ start: '2026-08-10', end: '2026-08-18' }}
        onChange={onChange}
        onVisibleMonthChange={onVisibleMonthChange}
      />,
    );

    openMonthNavigation();
    const navigation = slot<HTMLDivElement>('month-navigation');
    Object.defineProperties(navigation, {
      clientHeight: { configurable: true, value: 326 },
      scrollHeight: { configurable: true, value: 2034 },
    });
    navigation.scrollTop = 1500;
    fireEvent.scroll(navigation);
    fireEvent.click(screen.getByRole('button', { name: 'February 2030' }));

    expect(slot('month-heading')).toHaveTextContent('February 2030');
    expect(slot('calendar')).toHaveAttribute('data-view', 'dates');
    expect(slot('grid')).toHaveAttribute('data-month-motion', 'next');
    expect(onVisibleMonthChange).toHaveBeenLastCalledWith('2030-02-01');
    expect(onChange).not.toHaveBeenCalled();
    expect(slot('selection-summary')).toHaveTextContent('10 Aug 2026');
    expect(slot('selection-summary')).toHaveTextContent('18 Aug 2026');

    clickDay('2030-02-14');
    expect(onChange).toHaveBeenLastCalledWith({
      start: '2026-08-10',
      end: '2030-02-14',
    });
  });

  it('restores the date view when either header arrow navigates', () => {
    render(<QunoDatePicker initialMonth="2026-08-01" />);

    openMonthNavigation();
    fireEvent.click(slot('next-button'));

    expect(slot('calendar')).toHaveAttribute('data-view', 'dates');
    expect(slot('month-heading')).toHaveTextContent('September 2026');

    openMonthNavigation();
    fireEvent.click(slot('previous-button'));

    expect(slot('calendar')).toHaveAttribute('data-view', 'dates');
    expect(slot('month-heading')).toHaveTextContent('August 2026');
  });

  it('restores the date view when Start or End navigates', () => {
    render(
      <QunoDatePicker
        initialMonth="2026-08-01"
        defaultValue={{ start: '2026-07-20', end: '2026-09-08' }}
      />,
    );

    openMonthNavigation();
    fireEvent.click(screen.getByRole('button', { name: /End 8 Sept 2026/ }));
    expect(slot('calendar')).toHaveAttribute('data-view', 'dates');
    expect(slot('month-heading')).toHaveTextContent('September 2026');

    openMonthNavigation();
    fireEvent.click(screen.getByRole('button', { name: /Start 20 Jul 2026/ }));
    expect(slot('calendar')).toHaveAttribute('data-view', 'dates');
    expect(slot('month-heading')).toHaveTextContent('July 2026');
  });

  it('extends the year list as its scroller reaches either edge', () => {
    vi.useFakeTimers();
    render(<QunoDatePicker initialMonth="2026-08-01" />);
    openMonthNavigation();
    const navigation = slot<HTMLDivElement>('month-navigation');
    Object.defineProperties(navigation, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 1000 },
    });

    navigation.scrollTop = 850;
    fireEvent.scroll(navigation);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(navigation).toHaveAttribute('data-last-year', '2035');
    expect(document.querySelectorAll('[data-slot="year-group"]').length)
      .toBeLessThanOrEqual(6);
    expect(document.querySelectorAll('[data-slot="month-option"]').length)
      .toBeLessThanOrEqual(72);

    navigation.scrollTop = 0;
    fireEvent.scroll(navigation);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(navigation).toHaveAttribute('data-first-year', '2017');
    expect(document.querySelectorAll('[data-slot="year-group"]').length)
      .toBeLessThanOrEqual(6);
    expect(document.querySelectorAll('[data-slot="month-option"]').length)
      .toBeLessThanOrEqual(72);
  });

  it('loads only one earlier chunk after an iPhone momentum-scroll burst', () => {
    vi.useFakeTimers();
    render(<QunoDatePicker initialMonth="2022-08-01" />);
    openMonthNavigation();
    const navigation = slot<HTMLDivElement>('month-navigation');
    Object.defineProperties(navigation, {
      clientHeight: { configurable: true, value: 326 },
      scrollHeight: { configurable: true, value: 2034 },
    });

    for (let event = 0; event < 20; event += 1) {
      navigation.scrollTop = 0;
      fireEvent.scroll(navigation);
      act(() => {
        vi.advanceTimersByTime(40);
      });
    }
    expect(navigation).toHaveAttribute('data-first-year', '2018');

    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(navigation).toHaveAttribute('data-first-year', '2013');
  });

  it('localizes and styles the new navigation contracts', () => {
    render(
      <QunoDatePicker
        initialMonth="2026-08-01"
        labels={{
          openMonthNavigation: 'Jump to month',
          monthNavigation: 'Month jump choices',
        }}
        formatters={{
          monthOption: (month) => `M${month.slice(5, 7)}`,
          year: (month) => `Y${month.slice(0, 4)}`,
        }}
        classNames={{
          monthNavigation: 'consumer-month-navigation',
          monthOption: 'consumer-month-option',
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Jump to month/ }));
    expect(
      screen.getByRole('group', { name: 'Month jump choices' }),
    ).toHaveClass('consumer-month-navigation');
    expect(screen.getByText('Y2026')).toBeVisible();
    expect(screen.getAllByText('M01')[0]).toHaveClass('consumer-month-option');
  });
});
