import { Component } from 'react';
import * as React from 'react';
import { Button, Select } from 'semantic-ui-react';
import * as _ from 'lodash';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { isUndefined, isNullOrUndefined } from 'util';

export enum DateSliderSpeedEnum {
    VerySlow = 2500,
    Slow = 1250,
    Normal = 500,
    Fast = 250,
    VeryFast = 0
}

type DateSliderSpeed = keyof typeof DateSliderSpeedEnum

export interface DateSliderProps {
    /** 
     *  The number of ticks per year, if a year is made up of multiple ticks.  If this
     *  is defined it should be divisible by 12 (i.e. 1, 2, 3, 4, 6, or 12)
     *  Exactly one of this and yearsPerTick should be defined (the other should be undefined) */
    ticksPerYear?: number,
    /** 
     *  The number of years per tick, if a tick covers multiple years.
     *  Exactly one of this and ticksPerYear should be defined (the other should be undefined) */
    yearsPerTick?: number,
    /**
     *  The TickDateRange of the first tick of the slider. */
    startTickDateRange: TickDateRange,
    /**
     *  The TickDateRange of the last tick of the slider. */
    endTickDateRange: TickDateRange,
    /**
     *  The TickDateRange of the current tick. */
    currentTickDateRange: TickDateRange,
    /**
     *  Callback called when the tick changes (whether the user changes it or
     *  it automatically advances because it's playing) */
    onTickDateRangeChange: (tickDateRange: TickDateRange) => void,
    /**
     * Whether to hide the Play/Stop button and speed controls.  Default
     * is to show them. */
    hidePlay?: boolean,
    /**
     * The initial speed of the slider.  Default is Normal.
     */
    initialSpeed?: DateSliderSpeedEnum
    /**
     * CSS properties to apply to the div containing the slider.
     * Default is {width: 500}
     */
    cssProps?: React.CSSProperties
}

/** Represents a date range of a tick on the slider.
 * The year and month represent the end of the range, while the 
 * beginning of the range can be calculated by looking at
 * ticksPerYear or yearsPerTick, although I expect most applications
 * will set these to be constants so your code can assume what they are. */
export class TickDateRange {
    /** The ending year that this date range represents. */
    public readonly endYear: number;
    /**
     * The ending month that this date range represents.
     * Note that this is 0-indexed, so 0=January and 11=December.
     */
    public readonly endMonth: number
    /**
     * Construct a new TickDateRange
     * @param endYear The ending year that this date range represents.
     * @param endMonth The ending year that this date range represents.
     * Note that this is 0-indexed, so 0=January and 11=December.
     * Optional: omitting this sets it to 11 (useful if ticks represent years)
     */
    constructor(endYear: number, endMonth?: number) {
        this.endYear = endYear;
        let realEndMonth: number = isUndefined(endMonth) ? 11 : endMonth;
        if (realEndMonth < 0 || realEndMonth > 11) {
            throw `endMonth is out of range (must be >= 0 and < 12, got ${endMonth})`;
        }
        this.endMonth = realEndMonth;
    }
    equals(other: TickDateRange): boolean {
        return this.endYear == other.endYear && this.endMonth == other.endMonth;
    }
}

interface DateSliderState {
    isPlaying: boolean,
    playSpeed: DateSliderSpeedEnum
}

export class DateSlider extends Component<DateSliderProps, DateSliderState> {
    constructor(props : DateSliderProps) {
        super(props);
        if ((this.props.ticksPerYear === undefined) == (this.props.yearsPerTick === undefined)) {
            console.error("Exactly one of DateSlider's ticksPerYear and yearsPerTick should be defined!");
            throw "Exactly one of DateSlider's ticksPerYear and yearsPerTick should be defined!";
        }
        this.state = { isPlaying: false, playSpeed: isNullOrUndefined(props.initialSpeed) ? DateSliderSpeedEnum.Normal : props.initialSpeed };
    }

    /**
     * How many months the date advances per tick.
     * */
    monthChangePerTick() {
        if (isUndefined(this.props.ticksPerYear)) {
            return this.props.yearsPerTick * 12;
        }
        else {
            return 12 / this.props.ticksPerYear;
        }
    }
    sliderIndexToDateRange(sliderIndex: number): TickDateRange {
        let newMonth = this.props.startTickDateRange.endMonth + this.monthChangePerTick() * sliderIndex;
        return new TickDateRange(this.props.startTickDateRange.endYear + Math.floor(newMonth / 12), newMonth % 12);
    }
    dateRangeToSliderIndex(dateRange: TickDateRange): number {
        let yearDifference = dateRange.endYear - this.props.startTickDateRange.endYear;
        let monthDifference = dateRange.endMonth - this.props.startTickDateRange.endMonth;
        let totalMonthDifference = 12 * yearDifference + monthDifference;
        return totalMonthDifference / this.monthChangePerTick();
    }
    onSliderChange = (value: number) => {
        this.props.onTickDateRangeChange(this.sliderIndexToDateRange(value));
    }
    advanceDate = () => {
        if (!this.state.isPlaying) {
            return;
        }
        //TODO - is this a race condition when we start playing from the end?
        if (this.sliderAtEnd()) {
            this.setState({ isPlaying: false });
            return;
        }
        // advance date
        let currentSliderIndex = this.dateRangeToSliderIndex(this.props.currentTickDateRange);
        let newDate = this.sliderIndexToDateRange(currentSliderIndex + 1);
        this.props.onTickDateRangeChange(newDate);
        this.callAdvanceDateInFuture();
    }
    callAdvanceDateInFuture = () => {
        setTimeout(this.advanceDate, this.state.playSpeed);
    }
    sliderAtEnd(): boolean {
        return this.props.currentTickDateRange.equals(this.props.endTickDateRange);
    }
    clickStopPlayButton = () => {
        if (this.state.isPlaying) {
            this.setState({ isPlaying: false });
        } else {
            this.setState({ isPlaying: true });
            if (this.sliderAtEnd()) {
                this.props.onTickDateRangeChange(this.props.startTickDateRange);
            }
            this.callAdvanceDateInFuture();
        }
    }

    static pascalCaseToString(s: string) : string {
        let withSpaces = s.replace(/([A-Z])/g, " $1").trim();
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
    }
    static speedOptions() {
        // https://stackoverflow.com/questions/21293063/how-to-programmatically-enumerate-an-enum-type
        const dateSliderSpeedNames = Object.keys(DateSliderSpeedEnum)
            .filter(k => typeof DateSliderSpeedEnum[k as any] === "number") as DateSliderSpeed[];
        return dateSliderSpeedNames.map(speed => {return {key: speed, text: DateSlider.pascalCaseToString(speed), value: DateSliderSpeedEnum[speed]}});
    }

    changeSpeed = (event, { value } ) => {
        this.setState({ playSpeed: value });
    }

    render() {
        let playStopButton =
            <div>
                <Button onClick={() => this.clickStopPlayButton()}>{this.state.isPlaying ? "Stop" : "Play"}</Button>
                Speed: <Select options={DateSlider.speedOptions()} value={this.state.playSpeed} onChange={this.changeSpeed} />
            </div>;
        let sliderProps = isNullOrUndefined(this.props.cssProps) ? {width: 500} : this.props.cssProps;
        // https://react-component.github.io/slider/examples/slider.html
        return (
            <div style={sliderProps} className="centerFixedWidth">
                <Slider
                    min={0}
                    max={this.dateRangeToSliderIndex(this.props.endTickDateRange)}
                    step={1}
                    value={this.dateRangeToSliderIndex(this.props.currentTickDateRange)}
                    onChange={this.onSliderChange} />
                {!this.props.hidePlay && playStopButton}
            </div>
        );
    }
}
