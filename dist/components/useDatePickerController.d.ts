import { type DateRange, type IsoDate, type MonthDirection, type WeekStart } from './dateRangeModel';
import type { DatePickerInteraction } from './datePickerTypes';
type ControllerOptions = {
    value?: DateRange | null;
    defaultValue: DateRange | null;
    initialMonth?: IsoDate;
    weekStartsOn: WeekStart;
    autoNavigateDelay: number;
    autoNavigateRepeatDelay: number;
    onChange?: (value: DateRange | null) => void;
    onVisibleMonthChange?: (month: IsoDate) => void;
};
export type DatePickerController = {
    selection: DateRange | null;
    renderedSelection: DateRange | null;
    visibleMonth: IsoDate;
    monthMotion: MonthDirection | null;
    interaction: DatePickerInteraction;
    gridDates: IsoDate[];
    weekdays: number[];
    beginDrag: (date: IsoDate) => void;
    enterDay: (date: IsoDate) => void;
    finishDrag: (date: IsoDate) => void;
    clear: () => void;
    navigate: (direction: MonthDirection) => void;
    startEdgeNavigation: (direction: MonthDirection) => void;
    stopEdgeNavigation: () => void;
    jumpToEndpoint: (date: IsoDate) => void;
};
export declare const useDatePickerController: ({ value, defaultValue, initialMonth, weekStartsOn, autoNavigateDelay, autoNavigateRepeatDelay, onChange, onVisibleMonthChange, }: ControllerOptions) => DatePickerController;
export {};
//# sourceMappingURL=useDatePickerController.d.ts.map