import React, { Component } from 'react';
import { USStateMap, DateSlider, TickDateRange } from './lib';
import { Button } from 'semantic-ui-react';
import 'rc-slider/assets/index.css';
import 'semantic-ui-css/semantic.min.css';

interface AppState {
    year: number,
    stateSelected: string,
    isCartogram: boolean,
    fakeStateColors: Map<number, Map<string, string>>
}

const MIN_YEAR = 2010;
const MAX_YEAR = 2019;

export class App extends Component<{}, AppState> {
    state: AppState = {
        year: MAX_YEAR,
        stateSelected: undefined,
        isCartogram: true,
        fakeStateColors: undefined
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

    // Just use some nice red/blue colors
    _colors =
        ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'];

    componentDidMount = () => {
        // You probably want to load some data here, we'll just make something up.
        let tempFakeStateColors = new Map<number, Map<string, string>>();
        const stateCodes: Array<string> = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
        for (let year = MIN_YEAR; year <= MAX_YEAR; ++year) {
            let data = new Map<string, string>();
            for (let i = 0; i < stateCodes.length; ++i) {
                let stateCode = stateCodes[i];
                data.set(stateCode, this._colors[(i + year) % this._colors.length]);
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
            <USStateMap isCartogram={this.state.isCartogram}
                stateColors={this.state.fakeStateColors.get(this.state.year)}
                stateTitles={new Map<string, string>()}
                stateSelectedCallback={this.onStateSelected}
                stateClearedCallback={this.onStateCleared}
                x={0}
                y={0}
                width={900}
                height={500}
                onError={this.onMapError} />
            <div style={{ marginTop: "5px" }}>
                <Button.Group>
                    <Button active={!this.state.isCartogram} onClick={() => this.setState({ isCartogram: false })}>Normal</Button>
                    <Button.Or />
                    <Button active={this.state.isCartogram} onClick={() => this.setState({ isCartogram: true })}>Cartogram</Button>
                </Button.Group>
            </div>
            <div>Year: {this.state.year}</div>
            <div>State selected: {this.state.stateSelected || "None"}</div>
            <DateSlider
                yearsPerTick={1}
                startTickDateRange={new TickDateRange(MIN_YEAR)}
                endTickDateRange={new TickDateRange(MAX_YEAR)}
                currentTickDateRange={new TickDateRange(this.state.year)}
                onTickDateRangeChange={this.onSliderDateChange}
              />
        </div>
    }
}
