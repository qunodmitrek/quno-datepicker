import clsx from 'clsx';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { WeekdayStrip } from './WeekdayStrip';
import type { DatePickerController } from './useDatePickerController';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { JSX } from 'preact';

type Props = {
  controller: DatePickerController;
  config: ResolvedDatePickerConfig;
};

export const Calendar = ({ controller, config }: Props): JSX.Element => {
  const { classNames } = config;
  return (
    <div
      className={clsx('quno-date-picker__calendar-shell', classNames?.calendar)}
      data-slot="calendar"
    >
      {(['previous', 'next'] as const).map((direction) => (
        <div
          key={direction}
          className={clsx(
            'quno-date-picker__edge',
            `quno-date-picker__edge--${direction}`,
            classNames?.edge,
          )}
          data-slot="edge"
          data-direction={direction}
          aria-hidden="true"
          onPointerEnter={() =>
            controller.startEdgeNavigation(direction === 'previous' ? -1 : 1)
          }
          onPointerLeave={controller.stopEdgeNavigation}
        />
      ))}

      <CalendarHeader
        visibleMonth={controller.visibleMonth}
        config={config}
        onNavigate={controller.navigate}
      />

      <WeekdayStrip controller={controller} config={config} />

      <CalendarGrid
        dates={controller.gridDates}
        visibleMonth={controller.visibleMonth}
        selection={controller.selection}
        renderedSelection={controller.renderedSelection}
        config={config}
        onBegin={controller.beginDrag}
        onEnter={controller.enterDay}
        onFinish={controller.finishDrag}
      />
    </div>
  );
};
