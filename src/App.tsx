import React, { Component } from 'react';
import { StateMap, MapDateSlider, MapDate } from './lib';

export class App extends Component<{}, {}> {

    onStateSelected = (stateCode: string) => {
    }

    onStateCleared = () => {
    }

    onMapError = (error) => {
        alert("Error: " + this._errorStringFromError(error));
    }

    _errorStringFromError = (error: any) => {
        // JS exceptions have this
        if (error.hasOwnProperty("message")) {
            return error.message;
        }
        return error;
    }

    onSliderDateChange = (date: MapDate) => {
    }

    render = () => {
      return <div style={{ width: 640, margin: "15px auto" }}>
        <StateMap isCartogram={true}
            stateColors={new Map<string, string>()}
            stateTitles={new Map<string, string>()}
            stateSelectedCallback={this.onStateSelected}
            stateClearedCallback={this.onStateCleared}
            x={0}
            y={0}
            width={900}
            height={500}
            onError={this.onMapError} />
          <MapDateSlider
              yearsPerTick={1}
              ticksPerYear={undefined}
              startDate={new MapDate(2010, 11)}
              endDate={new MapDate(2019, 11)}
              currentDate={new MapDate(2019, 11)}
              onDateChange={this.onSliderDateChange} />
        </div>
    }
}
