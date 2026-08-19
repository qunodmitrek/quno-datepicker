import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { classNames as cx } from './classNames';
import { MonthNavigation } from './MonthNavigation';
import { WeekdayStrip } from './WeekdayStrip';
import type { DatePickerController } from './datePickerControllerTypes';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { ComponentChildren, JSX } from 'preact';
import { useState } from 'preact/hooks';

type Props = {
  controller: DatePickerController;
  config: ResolvedDatePickerConfig;
  monthNavigationOpen: boolean;
  onMonthNavigationOpenChange: (open: boolean) => void;
  footer?: ComponentChildren;
};

export const Calendar = ({
  controller,
  config,
  monthNavigationOpen,
  onMonthNavigationOpenChange,
  footer,
}: Props): JSX.Element => {
  const [touchOverflowIndex, setTouchOverflowIndex] = useState<number | null>(
    null,
  );
  const movingSelection =
    controller.interaction.type === 'drag-range' ||
    controller.interaction.type === 'drag-endpoint';
  return (
    <div
      className={cx(
        'quno-date-picker__calendar-shell',
        config.classNames?.calendar,
      )}
      data-slot="calendar"
      data-view={monthNavigationOpen ? 'month-navigation' : 'dates'}
      data-dragging={movingSelection ? 'move' : undefined}
      onKeyDown={(event) => {
        if (!monthNavigationOpen || event.key !== 'Escape') return;
        event.preventDefault();
        onMonthNavigationOpenChange(false);
      }}
    >
      {!monthNavigationOpen &&
        (['previous', 'next'] as const).map((direction) => (
          <div
            key={direction}
            className={cx(
              'quno-date-picker__edge',
              `quno-date-picker__edge--${direction}`,
              config.classNames?.edge,
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
        monthNavigationOpen={monthNavigationOpen}
        onNavigate={(direction) => {
          controller.navigate(direction);
          onMonthNavigationOpenChange(false);
        }}
        onToggleMonthNavigation={() =>
          onMonthNavigationOpenChange(!monthNavigationOpen)
        }
      />

      {monthNavigationOpen ? (
        <MonthNavigation
          visibleMonth={controller.visibleMonth}
          config={config}
          onSelect={(month) => {
            controller.goToMonth(month);
            onMonthNavigationOpenChange(false);
          }}
        />
      ) : (
        <>
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
          {footer && (
            <div
              className={cx('quno-date-picker__calendar-footer', config.classNames?.calendarFooter)}
              data-slot="calendar-footer"
            >
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
};
