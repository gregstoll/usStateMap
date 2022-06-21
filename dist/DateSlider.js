"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DateSlider = exports.TickDateRange = exports.DateSliderSpeedEnum = void 0;
var react_1 = require("react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var rc_slider_1 = require("rc-slider");
require("rc-slider/assets/index.css");
var DateSliderSpeedEnum;
(function (DateSliderSpeedEnum) {
    DateSliderSpeedEnum[DateSliderSpeedEnum["VerySlow"] = 2500] = "VerySlow";
    DateSliderSpeedEnum[DateSliderSpeedEnum["Slow"] = 1250] = "Slow";
    DateSliderSpeedEnum[DateSliderSpeedEnum["Normal"] = 500] = "Normal";
    DateSliderSpeedEnum[DateSliderSpeedEnum["Fast"] = 250] = "Fast";
    DateSliderSpeedEnum[DateSliderSpeedEnum["VeryFast"] = 0] = "VeryFast";
})(DateSliderSpeedEnum = exports.DateSliderSpeedEnum || (exports.DateSliderSpeedEnum = {}));
/** Represents a date range of a tick on the slider.
 * The year and month represent the end of the range, while the
 * beginning of the range can be calculated by looking at
 * ticksPerYear or yearsPerTick, although I expect most applications
 * will set these to be constants so your code can assume what they are. */
var TickDateRange = /** @class */ (function () {
    /**
     * Construct a new TickDateRange
     * @param endYear The ending year that this date range represents.
     * @param endMonth The ending year that this date range represents.
     * Note that this is 0-indexed, so 0=January and 11=December.
     * Optional: omitting this sets it to 11 (useful if ticks represent years)
     */
    function TickDateRange(endYear, endMonth) {
        this.endYear = endYear;
        var realEndMonth = endMonth === undefined ? 11 : endMonth;
        if (realEndMonth < 0 || realEndMonth > 11) {
            throw "endMonth is out of range (must be >= 0 and < 12, got ".concat(endMonth, ")");
        }
        this.endMonth = realEndMonth;
    }
    TickDateRange.prototype.equals = function (other) {
        return this.endYear == other.endYear && this.endMonth == other.endMonth;
    };
    return TickDateRange;
}());
exports.TickDateRange = TickDateRange;
var DateSlider = /** @class */ (function (_super) {
    __extends(DateSlider, _super);
    function DateSlider(props) {
        var _this = _super.call(this, props) || this;
        _this.onSliderChange = function (value) {
            _this.props.onTickDateRangeChange(_this.sliderIndexToDateRange(value));
        };
        _this.advanceDate = function () {
            if (!_this.state.isPlaying) {
                return;
            }
            //TODO - is this a race condition when we start playing from the end?
            if (_this.sliderAtEnd()) {
                _this.setState({ isPlaying: false });
                return;
            }
            // advance date
            var currentSliderIndex = _this.dateRangeToSliderIndex(_this.props.currentTickDateRange);
            var newDate = _this.sliderIndexToDateRange(currentSliderIndex + 1);
            _this.props.onTickDateRangeChange(newDate);
            _this.callAdvanceDateInFuture();
        };
        _this.callAdvanceDateInFuture = function () {
            setTimeout(_this.advanceDate, _this.state.playSpeed);
        };
        _this.clickStopPlayButton = function () {
            if (_this.state.isPlaying) {
                _this.setState({ isPlaying: false });
            }
            else {
                _this.setState({ isPlaying: true });
                if (_this.sliderAtEnd()) {
                    _this.props.onTickDateRangeChange(_this.props.startTickDateRange);
                }
                _this.callAdvanceDateInFuture();
            }
        };
        _this.changeSpeed = function (event, _a) {
            var value = _a.value;
            _this.setState({ playSpeed: value });
        };
        if ((_this.props.ticksPerYear === undefined) == (_this.props.yearsPerTick === undefined)) {
            console.error("Exactly one of DateSlider's ticksPerYear and yearsPerTick should be defined!");
            throw "Exactly one of DateSlider's ticksPerYear and yearsPerTick should be defined!";
        }
        _this.state = { isPlaying: false, playSpeed: (props.initialSpeed === null || props.initialSpeed === undefined) ? DateSliderSpeedEnum.Normal : props.initialSpeed };
        return _this;
    }
    /**
     * How many months the date advances per tick.
     * */
    DateSlider.prototype.monthChangePerTick = function () {
        if (this.props.ticksPerYear === undefined) {
            return this.props.yearsPerTick * 12;
        }
        else {
            return 12 / this.props.ticksPerYear;
        }
    };
    DateSlider.prototype.sliderIndexToDateRange = function (sliderIndex) {
        var newMonth = this.props.startTickDateRange.endMonth + this.monthChangePerTick() * sliderIndex;
        return new TickDateRange(this.props.startTickDateRange.endYear + Math.floor(newMonth / 12), newMonth % 12);
    };
    DateSlider.prototype.dateRangeToSliderIndex = function (dateRange) {
        var yearDifference = dateRange.endYear - this.props.startTickDateRange.endYear;
        var monthDifference = dateRange.endMonth - this.props.startTickDateRange.endMonth;
        var totalMonthDifference = 12 * yearDifference + monthDifference;
        return totalMonthDifference / this.monthChangePerTick();
    };
    DateSlider.prototype.sliderAtEnd = function () {
        return this.props.currentTickDateRange.equals(this.props.endTickDateRange);
    };
    DateSlider.pascalCaseToString = function (s) {
        var withSpaces = s.replace(/([A-Z])/g, " $1").trim();
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
    };
    DateSlider.speedOptions = function () {
        // https://stackoverflow.com/questions/21293063/how-to-programmatically-enumerate-an-enum-type
        var dateSliderSpeedNames = Object.keys(DateSliderSpeedEnum)
            .filter(function (k) { return typeof DateSliderSpeedEnum[k] === "number"; });
        return dateSliderSpeedNames.map(function (speed) { return { key: speed, text: DateSlider.pascalCaseToString(speed), value: DateSliderSpeedEnum[speed] }; });
    };
    DateSlider.prototype.render = function () {
        var _this = this;
        var playStopButton = React.createElement("div", null,
            React.createElement(semantic_ui_react_1.Button, { onClick: function () { return _this.clickStopPlayButton(); } }, this.state.isPlaying ? "Stop" : "Play"),
            "Speed: ",
            React.createElement(semantic_ui_react_1.Select, { options: DateSlider.speedOptions(), value: this.state.playSpeed, onChange: this.changeSpeed }));
        var sliderProps = (this.props.cssProps === null || this.props.cssProps === undefined) ? { width: 500 } : this.props.cssProps;
        // https://react-component.github.io/slider/examples/slider.html
        return (React.createElement("div", { style: sliderProps, className: "centerFixedWidth" },
            React.createElement(rc_slider_1["default"], { min: 0, max: this.dateRangeToSliderIndex(this.props.endTickDateRange), step: 1, value: this.dateRangeToSliderIndex(this.props.currentTickDateRange), onChange: this.onSliderChange }),
            !this.props.hidePlay && playStopButton));
    };
    return DateSlider;
}(react_1.Component));
exports.DateSlider = DateSlider;
//# sourceMappingURL=DateSlider.js.map