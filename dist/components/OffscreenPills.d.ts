import { type DateRange, type IsoDate } from './dateRangeModel';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { JSX } from 'preact';
type Position = 'before' | 'after';
type Props = {
    selection: DateRange | null;
    visibleMonth: IsoDate;
    position: Position;
    config: ResolvedDatePickerConfig;
    onJump: (date: IsoDate) => void;
};
export declare const OffscreenPills: ({ selection, visibleMonth, position, config, onJump, }: Props) => JSX.Element | null;
export {};
//# sourceMappingURL=OffscreenPills.d.ts.map