import { type DateRange, type IsoDate, type WeekStart } from './dateRangeModel';
import type { DatePickerController } from './datePickerControllerTypes';
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
export declare const useDatePickerController: ({ value, defaultValue, initialMonth, weekStartsOn, autoNavigateDelay, autoNavigateRepeatDelay, onChange, onVisibleMonthChange, }: ControllerOptions) => DatePickerController;
export {};
//# sourceMappingURL=useDatePickerController.d.ts.map