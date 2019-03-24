import { Component } from 'react';
import * as React from 'react';
import * as d3 from 'd3';
import { StateInfos } from './DataHandling';
import './USStateMap.css';
interface USStateMapProps {
    /**
     * Map of stateCode (i.e. 'AL', 'DC', 'TX', etc.) to what color it should be.
     * Any CSS color should work (examples: 'red', '#123456', 'rgb(100, 200, 0)', etc.)
     * */
    stateColors: Map<string, string>;
    /**
     * Optional map of stateCode (i.e. 'AL', 'DC', 'TX', etc.) to the label on the tooltip.
     * */
    stateTitles?: Map<string, string>;
    /**
     * Optional callback when a state is tapped.  Argument passed is the stateCode (i.e. 'AL', 'DC', 'TX', etc.)
     * */
    stateSelectedCallback?: (stateCode: string) => void;
    /**
     * Optional callback when a part of the map that is not a state is tapped.
     * */
    stateClearedCallback?: () => void;
    /**
     * Whether the map is a cartogram (state sizes roughly proportional to population) or not.
     * */
    isCartogram: boolean;
    /**
     * Optional offset in the x direction for the map. Defaults to 0.
     * */
    x?: number;
    /**
     * Optional offset in the y direction for the map. Defaults to 0.
     * */
    y?: number;
    /**
     * Width of the map. 900 seems like a good value.
     * */
    width: number;
    /**
     * Height of the map. 500 seems like a good value.
     * */
    height: number;
    /**
     * Callback that is called when there's an error loading data.
     * */
    onError: (error: any) => void;
}
interface USStateMapDrawingInfo {
    usTopoJson: any;
    cartogram: d3.Selection<HTMLElement, () => any, null, undefined>;
    stateInfos: StateInfos;
}
interface USStateMapState {
    drawingInfo: USStateMapDrawingInfo;
}
interface StateLineInfo {
    lineStart: [number, number];
    lineEnd: [number, number];
    lineTextPosition: [number, number];
}
export declare class USStateMap extends Component<USStateMapProps, USStateMapState> {
    projection: d3.GeoProjection;
    geoPath: d3.GeoPath;
    labelLines: Map<string, StateLineInfo>;
    constructor(props: any);
    componentDidMount(): void;
    private loadAllData;
    private getDataAsync;
    private cleanStateName;
    private makeStateInfos;
    private getCartogramAsync;
    initLabelLines(): void;
    updateD3(props: any): void;
    stateClick: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    rootClick: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    getSVGPaths: (stateCode: string, stateName: string, path: string, backgroundColors: Set<string>) => JSX.Element[];
    filterNameFromColor(color: string): string;
    getLabelColor(backgroundColor: string): string;
    getCenter(shapes: Array<Array<[number, number]>>): [number, number];
    parsePath(str: string): Array<Array<[number, number]>>;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=USStateMap.d.ts.map