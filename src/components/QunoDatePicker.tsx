import clsx from 'clsx';
import { Calendar } from './Calendar';
import { monthRelation } from './dateRangeModel';
import { DEFAULT_FORMATTERS, DEFAULT_LABELS } from './datePickerFormatters';
import { OffscreenPills } from './OffscreenPills';
import { SelectionHeader } from './SelectionHeader';
import { useDatePickerController } from './useDatePickerController';
import type {
  QunoDatePickerProps,
  ResolvedDatePickerConfig,
} from './datePickerTypes';
import type { JSX } from 'preact';

export const QunoDatePicker = ({
  value,
  defaultValue = null,
  initialMonth,
  locale = 'en-GB',
  labels,
  formatters,
  weekStartsOn = 1,
  className,
  classNames,
  getDayCellProps,
  autoNavigateDelay = 400,
  autoNavigateRepeatDelay = 650,
  onChange,
  onVisibleMonthChange,
}: QunoDatePickerProps): JSX.Element => {
  const config: ResolvedDatePickerConfig = {
    locale,
    labels: { ...DEFAULT_LABELS, ...labels },
    formatters: { ...DEFAULT_FORMATTERS, ...formatters },
    classNames,
    getDayCellProps,
  };
  const controller = useDatePickerController({
    value,
    defaultValue,
    initialMonth,
    weekStartsOn,
    autoNavigateDelay,
    autoNavigateRepeatDelay,
    onChange,
    onVisibleMonthChange,
  });
  const endpointPositions = controller.selection
    ? [
        monthRelation(controller.selection.start, controller.visibleMonth),
        monthRelation(controller.selection.end, controller.visibleMonth),
      ]
    : [];

  return (
    <section
      className={clsx('quno-date-picker', className, classNames?.root)}
      data-slot="root"
      data-pill-before={endpointPositions.includes('before') || undefined}
      data-pill-after={endpointPositions.includes('after') || undefined}
      aria-label={config.labels.calendar}
      onPointerUp={controller.stopEdgeNavigation}
    >
      <SelectionHeader
        selection={controller.selection}
        config={config}
        onClear={controller.clear}
      />
      <OffscreenPills
        selection={controller.selection}
        visibleMonth={controller.visibleMonth}
        position="before"
        config={config}
        onJump={controller.jumpToEndpoint}
      />
      <Calendar controller={controller} config={config} />
      <OffscreenPills
        selection={controller.selection}
        visibleMonth={controller.visibleMonth}
        position="after"
        config={config}
        onJump={controller.jumpToEndpoint}
      />
      {config.labels.hint && (
        <p
          className={clsx('quno-date-picker__hint', classNames?.hint)}
          data-slot="hint"
        >
          {config.labels.hint}
        </p>
      )}
    </section>
  );
};

export type {
  DateAction,
  DatePickerInteraction,
  QunoDatePickerClassNames,
  QunoDatePickerDayCellContext,
  QunoDatePickerDayCellCustomizer,
  QunoDatePickerDayCellProps,
  QunoDatePickerFormatters,
  QunoDatePickerLabels,
  QunoDatePickerProps,
  QunoDatePickerSlot,
} from './datePickerTypes';
