# usStateMap
React component for displaying colors on a US state map

See the included app for usage, or see [stateElectionMap](https://github.com/gregstoll/stateElectionMap) for another example.

The main components are:

## USStateMap
The main map component.  It has props:
  - `stateColors: Map<string, string>`
     Map of stateCode (i.e. 'AL', 'DC', 'TX', etc.) to what color it should be.
     Any CSS color should work (examples: 'red', '#123456', 'rgb(100, 200, 0)', etc.)
  - `stateTitles?: Map<string, string>`
     Optional map of stateCode (i.e. 'AL', 'DC', 'TX', etc.) to the label on the tooltip.
  - `stateSelectedCallback?: (stateCode: string) => void`
     Optional callback when a state is tapped.  Argument passed is the stateCode (i.e. 'AL', 'DC', 'TX', etc.)
  - `stateClearedCallback?: () => void`
     Optional callback when a part of the map that is not a state is tapped.
  - `isCartogram: boolean`
     Whether the map is a cartogram (state sizes roughly proportional to population) or not.
  - `x?: number`
     Optional offset in the x direction for the map. Defaults to 0.
  - `y?: number`
     Optional offset in the y direction for the map. Defaults to 0.
  - `width: number`
     Width of the map. 900 seems like a good value.
  - `height: number`
     Height of the map. 500 seems like a good value.
  - `onError: (error: any) => void`
     Callback that is called when there's an error loading data.

## DateSlider
A slider that can display months or years.  It has props:
  - `ticksPerYear?: number`
     The number of ticks per year, if a year is made up of multiple ticks.  If this
     is defined it should be divisible by 12 (i.e. 1, 2, 3, 4, 6, or 12)
     Exactly one of this and `yearsPerTick` should be defined (the other should be undefined)
  - `yearsPerTick?: number`
     The number of years per tick, if a tick covers multiple years.
     Exactly one of this and `ticksPerYear` should be defined (the other should be undefined)
  - `startTickDateRange: TickDateRange`
     The `TickDateRange` of the first tick of the slider.
  - `endTickDateRange: TickDateRange`
     The `TickDateRange` of the last tick of the slider.
  - `currentTickDateRange: TickDateRange`
     The `TickDateRange` of the current tick.
  - `onTickDateRangeChange: (tickDateRange: TickDateRange) => void`
     Callback called when the tick changes (whether the user changes it or
     it automatically advances because it's playing)
  - `hidePlay?: boolean`
     Whether to hide the Play/Stop button and speed controls.  Default
     is to show them.

## TickDateRange
Represents a date range of a tick on the slider.
The year and month represent the end of the range, while the beginning of the range can be calculated by looking at `ticksPerYear` or `yearsPerTick`, although I expect most applications will set these to be constants so your code can assume what they are.
It has properties:
  - `endYear: number`
     The ending year that this date range represents.
  - `endMonth: number`
     The ending month that this date range represents.
     Note that this is 0-indexed, so 0=January and 11=December.
