import type {
  DateAction as ModelDateAction,
  DateRange,
  Endpoint,
  IsoDate,
  WeekStart,
} from './dateRangeModel';
import type { JSX } from 'preact';

export type IdleInteraction = {
  type: 'idle';
};

export type DatePickerInteraction =
  | IdleInteraction
  | {
      type: 'create';
      origin: IsoDate;
      current: DateRange;
      moved: boolean;
    }
  | {
      type: 'paint-pending';
      origin: IsoDate;
      original: DateRange;
      current: DateRange;
      moved: false;
    }
  | {
      type: 'drag-endpoint';
      origin: IsoDate;
      endpoint: Endpoint;
      anchor: IsoDate;
      current: DateRange;
      moved: boolean;
    }
  | {
      type: 'drag-range';
      origin: IsoDate;
      original: DateRange;
      current: DateRange;
      moved: boolean;
    };

export type QunoDatePickerLabels = {
  calendar: string;
  selectedPeriod: string;
  chooseDate: string;
  clear: string;
  start: string;
  end: string;
  previousMonth: string;
  nextMonth: string;
  chooseAction: string;
  startDate: string;
  endDate: string;
  thisDate: string;
  hint: string;
};

export type QunoDatePickerFormatters = {
  date: (date: IsoDate, locale: string) => string;
  month: (month: IsoDate, locale: string) => string;
  dayLabel: (date: IsoDate, locale: string) => string;
  weekday: (dayIndex: number, locale: string) => string;
};

export type QunoDatePickerDayCellContext = {
  date: IsoDate;
  weekday: WeekStart;
  isToday: boolean;
  isWeekend: boolean;
  isOutside: boolean;
  isSelected: boolean;
  isCommitted: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
};

export type QunoDatePickerDayCellProps = {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
};

export type QunoDatePickerDayCellCustomizer = (
  context: QunoDatePickerDayCellContext,
) => QunoDatePickerDayCellProps | undefined;

export type QunoDatePickerSlot =
  | 'root'
  | 'selectionHeader'
  | 'selectionEyebrow'
  | 'selectionSummary'
  | 'clearButton'
  | 'pills'
  | 'pill'
  | 'calendar'
  | 'edge'
  | 'monthHeader'
  | 'previousButton'
  | 'monthHeading'
  | 'nextButton'
  | 'actionMenu'
  | 'actionTitle'
  | 'actionButton'
  | 'weekdays'
  | 'weekday'
  | 'overflowDay'
  | 'grid'
  | 'day'
  | 'handle'
  | 'hint';

export type QunoDatePickerClassNames = Partial<
  Record<QunoDatePickerSlot, string>
>;

export type QunoDatePickerProps = {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  initialMonth?: IsoDate;
  locale?: string;
  labels?: Partial<QunoDatePickerLabels>;
  formatters?: Partial<QunoDatePickerFormatters>;
  weekStartsOn?: WeekStart;
  className?: string;
  classNames?: QunoDatePickerClassNames;
  getDayCellProps?: QunoDatePickerDayCellCustomizer;
  autoNavigateDelay?: number;
  autoNavigateRepeatDelay?: number;
  onChange?: (value: DateRange | null) => void;
  onVisibleMonthChange?: (month: IsoDate) => void;
};

export type ResolvedDatePickerConfig = {
  locale: string;
  labels: QunoDatePickerLabels;
  formatters: QunoDatePickerFormatters;
  classNames?: QunoDatePickerClassNames;
  getDayCellProps?: QunoDatePickerDayCellCustomizer;
};

export type DateAction = ModelDateAction;
