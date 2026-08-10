import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { IsoDate, MonthDirection } from './dateRangeModel';
import type { JSX } from 'preact';
type Props = {
    visibleMonth: IsoDate;
    monthMotion: MonthDirection | null;
    config: ResolvedDatePickerConfig;
    onNavigate: (direction: MonthDirection) => void;
};
export declare const CalendarHeader: ({ visibleMonth, monthMotion, config, onNavigate, }: Props) => JSX.Element;
export {};
//# sourceMappingURL=CalendarHeader.d.ts.map