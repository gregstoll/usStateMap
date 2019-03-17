import React, { Component } from 'react';
import { StateMap, MapDateSlider, TickDateRange } from './lib';
import 'rc-slider/assets/index.css';
import 'semantic-ui-css/semantic.min.css';
import parseColor from 'parse-color';

interface AppState {
    year: number,
    fakeStateColors: Map<number, Map<string, string>>,
    stateSelected: string
}

const MIN_YEAR = 2010;
const MAX_YEAR = 2019;

export class App extends Component<{}, AppState> {
    state: AppState = {
        year: MAX_YEAR,
        fakeStateColors: undefined,
        stateSelected: undefined
    }

    onStateSelected = (stateCode: string) => {
        this.setState({ stateSelected: stateCode });
    }

    onStateCleared = () => {
        this.setState({ stateSelected: undefined });
    }

    onMapError = (error) => {
        alert("Error: " + this._errorStringFromError(error));
    }

    randomColor = () => {
        // Just use some nice red/blue colors
        const _colors =
            ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'];
        let idx = Math.floor(Math.random() * _colors.length);
        return _colors[idx];
    };

    componentDidMount = () => {
        // You probably want to load some data here, we'll just make something up.
        let tempFakeStateColors = new Map<number, Map<string, string>>();
        const stateCodes: Array<string> = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
        for (let year = MIN_YEAR; year <= MAX_YEAR; ++year) {
            let data = new Map<string, string>();
            for (let stateCode of stateCodes) {
                data.set(stateCode, this.randomColor());
            }

            tempFakeStateColors.set(year, data);
        }
        this.setState({ fakeStateColors: tempFakeStateColors });
    }

    _errorStringFromError = (error: any) => {
        // JS exceptions have this
        if (error.hasOwnProperty("message")) {
            return error.message;
        }
        return error;
    }

    onSliderDateChange = (date: TickDateRange) => {
        this.setState({ year: date.endYear });
    }

    render = () => {
        if (this.state.fakeStateColors === undefined) {
            return <div>Loading</div>;
        }
        return <div style={{ width: 640, margin: "15px auto" }}>
            <StateMap isCartogram={true}
                stateColors={this.state.fakeStateColors.get(this.state.year)}
                stateTitles={new Map<string, string>()}
                stateSelectedCallback={this.onStateSelected}
                stateClearedCallback={this.onStateCleared}
                x={0}
                y={0}
                width={900}
                height={500}
                onError={this.onMapError} />
            <div>Year: {this.state.year}</div>
            <div>State selected: {this.state.stateSelected || "None"}</div>
            <MapDateSlider
                yearsPerTick={1}
                startTickDateRange={new TickDateRange(MIN_YEAR, 11)}
                endTickDateRange={new TickDateRange(MAX_YEAR, 11)}
                currentTickDateRange={new TickDateRange(this.state.year, 11)}
                onTickDateRangeChange={this.onSliderDateChange}
              />
        </div>
    }
}
