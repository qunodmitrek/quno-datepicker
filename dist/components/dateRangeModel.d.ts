export type IsoDate = `${number}-${number}-${number}`;
export type DateRange = {
    start: IsoDate;
    end: IsoDate;
};
export type Endpoint = 'start' | 'end';
export type DateAction = Endpoint | 'single';
export type DateActionContext = {
    defaultAction: Endpoint;
    alternatives: DateAction[];
};
export type MonthDirection = -1 | 1;
export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export declare const toIsoDate: (date: Date) => IsoDate;
export declare const fromIsoDate: (value: IsoDate) => Date;
export declare const todayIso: () => IsoDate;
export declare const compareDates: (left: IsoDate, right: IsoDate) => number;
export declare const addDays: (date: IsoDate, amount: number) => IsoDate;
export declare const differenceInDays: (left: IsoDate, right: IsoDate) => number;
export declare const startOfMonth: (date: IsoDate) => IsoDate;
export declare const endOfMonth: (date: IsoDate) => IsoDate;
export declare const addMonths: (date: IsoDate, amount: number) => IsoDate;
export declare const isInMonth: (date: IsoDate, month: IsoDate) => boolean;
export declare const normalizeRange: (first: IsoDate, second: IsoDate) => DateRange;
export declare const nearestEndpoint: (range: DateRange, date: IsoDate) => Endpoint;
export declare const editEndpoint: (range: DateRange, endpoint: Endpoint, date: IsoDate) => {
    range: DateRange;
    endpoint: Endpoint;
};
export declare const applyDateAction: (range: DateRange, date: IsoDate, action: DateAction) => DateRange;
export declare const dateActionContext: (range: DateRange, date: IsoDate) => DateActionContext;
export declare const selectDate: (range: DateRange | null, date: IsoDate) => DateRange;
export declare const moveRange: (range: DateRange, origin: IsoDate, date: IsoDate) => DateRange;
export declare const calendarGrid: (month: IsoDate, weekStartsOn?: WeekStart) => IsoDate[];
export declare const isWithinRange: (date: IsoDate, range: DateRange) => boolean;
export declare const monthRelation: (date: IsoDate, month: IsoDate) => "before" | "visible" | "after";
//# sourceMappingURL=dateRangeModel.d.ts.map