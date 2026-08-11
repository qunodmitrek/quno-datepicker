import clsx from 'clsx';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { WeekdayStrip } from './WeekdayStrip';
import type { DatePickerController } from './datePickerControllerTypes';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { JSX } from 'preact';
import { useState } from 'preact/hooks';

type Props = {
  controller: DatePickerController;
  config: ResolvedDatePickerConfig;
};

export const Calendar = ({ controller, config }: Props): JSX.Element => {
  const [touchOverflowIndex, setTouchOverflowIndex] = useState<number | null>(
    null,
  );
  const { classNames } = config;
  const movingSelection =
    controller.interaction.type === 'drag-range' ||
    controller.interaction.type === 'drag-endpoint';
  return (
    <div
      className={clsx('quno-date-picker__calendar-shell', classNames?.calendar)}
      data-slot="calendar"
      data-dragging={movingSelection ? 'move' : undefined}
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
        monthMotion={controller.monthMotion}
        config={config}
        onNavigate={controller.navigate}
      />

      <WeekdayStrip
        controller={controller}
        config={config}
        touchOverflowIndex={touchOverflowIndex}
      />

      <CalendarGrid
        key={controller.visibleMonth}
        dates={controller.gridDates}
        visibleMonth={controller.visibleMonth}
        monthMotion={controller.monthMotion}
        movingSelection={movingSelection}
        interactionActive={controller.interaction.type !== 'idle'}
        cycleDate={controller.cycleDate}
        cyclePreview={controller.cyclePreview}
        selection={controller.selection}
        renderedSelection={controller.renderedSelection}
        config={config}
        onBegin={controller.beginDrag}
        onEnter={controller.enterDay}
        onFinish={controller.finishDrag}
        onCancel={controller.cancelDrag}
        onOverflowChange={setTouchOverflowIndex}
      />
    </div>
  );
};
