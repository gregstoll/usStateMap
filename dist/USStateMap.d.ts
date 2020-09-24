import { Component } from 'react';
import * as React from 'react';
import * as d3 from 'd3';
import { StateInfos } from './DataHandling';
import './USStateMap.css';
export declare enum GradientDirection {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3
}
export declare class ColorGradient {
    /**
     * The "main" color of the state, used to calculate what color text to use
     * Any CSS color should work (examples: 'red', '#123456', 'rgb(100, 200, 0)', etc.)
     * */
    readonly mainColor: string;
    /**
     * The other color of the state.
     * Any CSS color should work (examples: 'red', '#123456', 'rgb(100, 200, 0)', etc.)
     */
    readonly secondaryColor: string;
    /**
     * The direction for the gradient to go in.
     * For example, Up means the mainColor will be at the bottom and the secondaryColor will be at the top.
     */
    readonly direction: GradientDirection;
    /**
     * Optional parameter between 0-1 indicating how far through the gradient the main color should go
     * Defaults to 0.  Must be less than or equal to secondaryColorStop.
     * For example, setting this to 0.4 and secondaryColorStop to 0.7 will do the equivalent of:
     * gradient.addColorStop(0.0, mainColor);
     * gradient.addColorStop(0.4, mainColor);
     * gradient.addColorStop(0.7, secondaryColor);
     * gradient.addColorStop(1.0, secondaryColor);
     */
    readonly mainColorStop: number;
    /**
     * Optional parameter between 0-1 indicating how far through the gradient the secondary color should go
     * Defaults to 1.  Must be greater than or equal to mainColorStop.
     * For example, setting this to 0.7 and mainColorStop to 0.4 will do the equivalent of:
     * gradient.addColorStop(0.0, mainColor);
     * gradient.addColorStop(0.4, mainColor);
     * gradient.addColorStop(0.7, secondaryColor);
     * gradient.addColorStop(1.0, secondaryColor);
     */
    readonly secondaryColorStop: number;
    constructor(mainColor: string, secondaryColor: string, direction: GradientDirection, mainColorStop?: number, secondaryColorStop?: number);
}
interface USStateMapProps {
    /**
     * Map of stateCode (i.e. 'AL', 'DC', 'TX', etc.) to what color it should be.
     * Any CSS color should work (examples: 'red', '#123456', 'rgb(100, 200, 0)', etc.)
     * */
    stateColors: Map<string, string | ColorGradient>;
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
    stateClick: (event: React.MouseEvent<SVGElement>) => void;
    rootClick: (event: React.MouseEvent<SVGGElement>) => void;
    isColorGradient(color: string | ColorGradient): color is ColorGradient;
    getSVGPaths: (stateCode: string, stateName: string, path: string, gradients: Set<ColorGradient>) => Array<JSX.Element>;
    gradientNameFromColorGradient(gradient: ColorGradient): string;
    getLabelColor(backgroundColor: string): string;
    getCenter(shapes: Array<Array<[number, number]>>): [number, number];
    parsePath(str: string): Array<Array<[number, number]>>;
    makeSVGGradient(gradient: ColorGradient): JSX.Element;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=USStateMap.d.ts.map