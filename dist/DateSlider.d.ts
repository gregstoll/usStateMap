import { Component } from 'react';
import * as React from 'react';
import 'rc-slider/assets/index.css';
export declare enum DateSliderSpeedEnum {
    VerySlow = 2500,
    Slow = 1250,
    Normal = 500,
    Fast = 250,
    VeryFast = 0
}
export interface DateSliderProps {
    /**
     *  The number of ticks per year, if a year is made up of multiple ticks.  If this
     *  is defined it should be divisible by 12 (i.e. 1, 2, 3, 4, 6, or 12)
     *  Exactly one of this and yearsPerTick should be defined (the other should be undefined) */
    ticksPerYear?: number;
    /**
     *  The number of years per tick, if a tick covers multiple years.
     *  Exactly one of this and ticksPerYear should be defined (the other should be undefined) */
    yearsPerTick?: number;
    /**
     *  The TickDateRange of the first tick of the slider. */
    startTickDateRange: TickDateRange;
    /**
     *  The TickDateRange of the last tick of the slider. */
    endTickDateRange: TickDateRange;
    /**
     *  The TickDateRange of the current tick. */
    currentTickDateRange: TickDateRange;
    /**
     *  Callback called when the tick changes (whether the user changes it or
     *  it automatically advances because it's playing) */
    onTickDateRangeChange: (tickDateRange: TickDateRange) => void;
    /**
     * Whether to hide the Play/Stop button and speed controls.  Default
     * is to show them. */
    hidePlay?: boolean;
    /**
     * The initial speed of the slider.  Default is Normal.
     */
    initialSpeed?: DateSliderSpeedEnum;
    /**
     * CSS properties to apply to the div containing the slider.
     * Default is {width: 500}
     */
    cssProps?: React.CSSProperties;
}
/** Represents a date range of a tick on the slider.
 * The year and month represent the end of the range, while the
 * beginning of the range can be calculated by looking at
 * ticksPerYear or yearsPerTick, although I expect most applications
 * will set these to be constants so your code can assume what they are. */
export declare class TickDateRange {
    /** The ending year that this date range represents. */
    readonly endYear: number;
    /**
     * The ending month that this date range represents.
     * Note that this is 0-indexed, so 0=January and 11=December.
     */
    readonly endMonth: number;
    /**
     * Construct a new TickDateRange
     * @param endYear The ending year that this date range represents.
     * @param endMonth The ending year that this date range represents.
     * Note that this is 0-indexed, so 0=January and 11=December.
     * Optional: omitting this sets it to 11 (useful if ticks represent years)
     */
    constructor(endYear: number, endMonth?: number);
    equals(other: TickDateRange): boolean;
}
interface DateSliderState {
    isPlaying: boolean;
    playSpeed: DateSliderSpeedEnum;
}
export declare class DateSlider extends Component<DateSliderProps, DateSliderState> {
    constructor(props: DateSliderProps);
    /**
     * How many months the date advances per tick.
     * */
    monthChangePerTick(): number;
    sliderIndexToDateRange(sliderIndex: number): TickDateRange;
    dateRangeToSliderIndex(dateRange: TickDateRange): number;
    onSliderChange: (value: number) => void;
    advanceDate: () => void;
    callAdvanceDateInFuture: () => void;
    sliderAtEnd(): boolean;
    clickStopPlayButton: () => void;
    static pascalCaseToString(s: string): string;
    static speedOptions(): {
        key: "VerySlow" | "Slow" | "Normal" | "Fast" | "VeryFast";
        text: string;
        value: DateSliderSpeedEnum;
    }[];
    changeSpeed: (event: any, { value }: {
        value: any;
    }) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=DateSlider.d.ts.map