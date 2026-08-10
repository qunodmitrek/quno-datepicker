import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { DateRange } from './dateRangeModel';
import type { JSX } from 'preact';
type Props = {
    selection: DateRange | null;
    config: ResolvedDatePickerConfig;
    onClear: () => void;
};
export declare const SelectionHeader: ({ selection, config, onClear, }: Props) => JSX.Element;
export {};
//# sourceMappingURL=SelectionHeader.d.ts.map