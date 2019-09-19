import { Component } from 'react';
import * as React from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { StateName, StateInfos } from './DataHandling';
import * as topojson from 'topojson'
import { isNullOrUndefined, isUndefined } from 'util';
// not sure why these are necessary this way?
let polylabel = require('polylabel');
let parseColor = require('parse-color');

import './USStateMap.css';

export enum GradientDirection {
    Up,
    Down,
    Left,
    Right
}

// TODO more fully featured, like
// gradient.addColorStop(0.0, color);
// gradient.addColorStop(0.4, color);
// gradient.addColorStop(1.0, "rgb(20, 118, 255)");
export interface ColorGradient {
    /**
     * The "main" color of the state, used to calculate what color text to use
     * Any CSS color should work (examples: 'red', '#123456', 'rgb(100, 200, 0)', etc.)
     * */
    mainColor: string,
    /**
     * The other color of the state.
     * Any CSS color should work (examples: 'red', '#123456', 'rgb(100, 200, 0)', etc.)
     */
    secondaryColor: string
    /**
     * The direction for the gradient to go in.
     * For eample, Up means the mainColor will be at the bottom and the secondaryColor will be at the top.
     */
    direction: GradientDirection
}

interface USStateMapProps {
    /**
     * Map of stateCode (i.e. 'AL', 'DC', 'TX', etc.) to what color it should be.
     * Any CSS color should work (examples: 'red', '#123456', 'rgb(100, 200, 0)', etc.)
     * */
    stateColors: Map<string, string | ColorGradient>,
    /**
     * Optional map of stateCode (i.e. 'AL', 'DC', 'TX', etc.) to the label on the tooltip.
     * */
    stateTitles?: Map<string, string>,
    /**
     * Optional callback when a state is tapped.  Argument passed is the stateCode (i.e. 'AL', 'DC', 'TX', etc.)
     * */
    stateSelectedCallback?: (stateCode: string) => void,
    /**
     * Optional callback when a part of the map that is not a state is tapped.
     * */
    stateClearedCallback?: () => void,
    /**
     * Whether the map is a cartogram (state sizes roughly proportional to population) or not.
     * */
    isCartogram: boolean,
    /**
     * Optional offset in the x direction for the map. Defaults to 0.
     * */
    x?: number,
    /**
     * Optional offset in the y direction for the map. Defaults to 0.
     * */
    y?: number,
    /**
     * Width of the map. 900 seems like a good value.
     * */
    width: number,
    /**
     * Height of the map. 500 seems like a good value.
     * */
    height: number,
    /**
     * Callback that is called when there's an error loading data.
     * */
    onError: (error: any) => void
};

interface USStateMapDrawingInfo {
    usTopoJson: any,
    cartogram: d3.Selection<HTMLElement, () => any, null, undefined>,
    stateInfos: StateInfos
};

interface USStateMapState {
    drawingInfo: USStateMapDrawingInfo
}

interface StateLineInfo {
    lineStart: [number, number],
    lineEnd: [number, number],
    lineTextPosition: [number, number]
};

export class USStateMap extends Component<USStateMapProps, USStateMapState>{
    projection: d3.GeoProjection;
    geoPath: d3.GeoPath;
    labelLines: Map<string, StateLineInfo>;

    constructor(props) {
        super(props);
        this.state = { drawingInfo: undefined };

        this.projection = d3.geoAlbersUsa().scale(1280);
        this.geoPath = d3.geoPath().projection(this.projection);

        this.updateD3(props);
        this.initLabelLines();
    }

    componentDidMount() {
        this.loadAllData();
    }

    private loadAllData(): void {
        this.getDataAsync().then(value => {
            this.setState({ drawingInfo: value });
        }).catch(error => {
            console.error("Error in USStateMap: " + error);
            if (this.props.onError) {
                this.props.onError(error);
            }
        });
    }

    private async getDataAsync(): Promise<USStateMapDrawingInfo> {
        try {
            let usPromise = d3.json('data/us.json');
            let stateNamesPromise = d3.tsv('data/us-state-names.tsv', this.cleanStateName);
            let cartogramPromise = this.getCartogramAsync();
            let us = await usPromise;
            let stateNames = await stateNamesPromise;
            let cartogram = await cartogramPromise;
            return {
                usTopoJson: us,
                cartogram: cartogram,
                stateInfos: this.makeStateInfos(stateNames)
            };
        } catch (error) {
            console.error("Error in USStateMap: " + error);
            if (this.props.onError) {
                this.props.onError(error);
            }
        }
    }

    private cleanStateName(d: any): StateName {
        return {
            code: d.code,
            id: Number(d.id),
            name: d.name
        };
    }

    private makeStateInfos(names: StateName[]): StateInfos {
        let stateInfos: StateInfos = { codeToStateName: new Map<string, StateName>(), idToStateName: new Map<number, StateName>() };
        for (let name of names) {
            stateInfos.codeToStateName.set(name.code, name);
            stateInfos.idToStateName.set(name.id, name);
        }
        return stateInfos;
    }

    private async getCartogramAsync(): Promise<d3.Selection<HTMLElement, () => any, null, undefined>> {
        try {
            const xml = await d3.xml('data/cartograms/fivethirtyeight.svg', { headers: new Headers({ "Content-Type": "image/svg+xml" }) });
            return d3.select(xml.documentElement);
        } catch (error) {
            console.error("Error in USStateMap cartogram: " + error);
            if (this.props.onError) {
                this.props.onError(error);
            }
        }
    };

    initLabelLines() {
        this.labelLines = new Map<string, StateLineInfo>();
        this.labelLines.set('NH', { lineStart: [389, 155], lineEnd: [407, 187], lineTextPosition: [390, 150] });
        this.labelLines.set('VT', { lineStart: [371, 155], lineEnd: [399, 183], lineTextPosition: [372, 150] });
        this.labelLines.set('MA', { lineStart: [445, 195], lineEnd: [407, 198], lineTextPosition: [447, 195] });
        this.labelLines.set('RI', { lineStart: [445, 210], lineEnd: [410, 205], lineTextPosition: [447, 210] });
        this.labelLines.set('CT', { lineStart: [445, 225], lineEnd: [403, 206], lineTextPosition: [447, 225] });
        this.labelLines.set('NJ', { lineStart: [445, 240], lineEnd: [393, 218], lineTextPosition: [447, 240] });
        this.labelLines.set('DE', { lineStart: [445, 255], lineEnd: [391, 235], lineTextPosition: [447, 255] });
        this.labelLines.set('MD', { lineStart: [445, 270], lineEnd: [381, 230], lineTextPosition: [447, 270] });
        this.labelLines.set('DC', { lineStart: [445, 285], lineEnd: [379, 235], lineTextPosition: [447, 285] });
    }

    updateD3(props) {
        // Make the actual SVG be square, because that's how the paths (especially for Normal mode)
        // are laid out.
        let actualDimension = Math.min(props.width, props.height);
        this.projection
            .translate([actualDimension / 2, actualDimension / 2])
            .scale(actualDimension * 1.0);
    }

    stateClick = (event: React.MouseEvent<SVGElement>) => {
        let stateCode: string = event.currentTarget.attributes["name"].value;
        if (this.props.stateSelectedCallback) {
            this.props.stateSelectedCallback(stateCode);
        }
    };

    rootClick = (event: React.MouseEvent<SVGGElement>) => {
        // event.target is the childmost thing that got clicked on
        // (event.currentTarget is the element we registered on, which is not helpful)
        let target = event.target as SVGElement;
        if (isNullOrUndefined(target))
        {
            return;
        }
        let nameAttribute: string = target.attributes["name"];
        // TODO - this is a little brittle, I guess, it assumes that the root SVG
        // thing doesn't have a name
        if (isNullOrUndefined(nameAttribute))
        {
            if (this.props.stateClearedCallback) {
                this.props.stateClearedCallback();
            }
        }
    }

    isColorGradient(color: string | ColorGradient): color is ColorGradient {
        return (color as ColorGradient).direction !== undefined;
    }

    getSVGPaths = (stateCode: string, stateName: string, path: string, gradients: Set<ColorGradient>): Array<JSX.Element> => {
        if (isNullOrUndefined(path)) {
            return [];
        }
        const color = (this.props.stateColors && this.props.stateColors.get(stateCode)) || 'rgb(240, 240, 240)';
        const titleExtra = this.props.stateTitles && this.props.stateTitles.get(stateCode);
        const parsedPath = this.parsePath(path);
        const title = isNullOrUndefined(titleExtra) ? stateName : `${stateName}: ${titleExtra}`;
        let textPosition: [number, number];
        let parts = [];
        const primaryColor = this.isColorGradient(color) ? color.mainColor : color;
        if (this.isColorGradient(color)) {
            gradients.add(color);
        }
        const cssColor = this.isColorGradient(color) ? `url(#${this.gradientNameFromColorGradient(color)})` : color;
        // only use labelLines in non-cartogram mode - state codes fit inside all the states in cartogram mode
        if (!this.props.isCartogram && this.labelLines.has(stateCode)) {
            const labelLineInfo = this.labelLines.get(stateCode);
            textPosition = labelLineInfo.lineTextPosition;
            const linePath = `M ${labelLineInfo.lineStart[0]},${labelLineInfo.lineStart[1]} L ${labelLineInfo.lineEnd[0]},${labelLineInfo.lineEnd[1]} Z`;
            parts.push(<path key={stateCode + "line"} name={stateCode + "line"} d={linePath} className="labelLine"/>);
        }
        else {
            textPosition = this.getCenter(parsedPath);
        }
        parts.push(<path className="usState" name={stateCode} d={path} style={{ fill: cssColor }} key={stateCode} onClick={this.stateClick}>
            <title>{title}</title>
        </path>);
        if (!this.props.isCartogram && this.labelLines.has(stateCode)) {
            // https://stackoverflow.com/a/41902064/118417
            // This is a somewhat hacky but easy way to get a background for an SVG text element.
            // Note that we use "HH" since we know all of these state codes are two characters, and
            // "H" doesn't cause any weird edges. (try "XX" or "VV" to see the weirdness)
            parts.push(<text className="usStateText" name={stateCode} x={textPosition[0]} y={textPosition[1]} key={stateCode + "textBackground"}
                dy="0.25em" onClick={this.stateClick} stroke={cssColor} strokeWidth="0.6em"><title>{title}</title>HH</text>);
        }
        parts.push(<text className="usStateText" name={stateCode} x={textPosition[0]} y={textPosition[1]} key={stateCode + "text"}
            dy="0.25em" onClick={this.stateClick} stroke={this.getLabelColor(primaryColor)}><title>{title}</title>{stateCode}</text>);
        return parts;
    };

    gradientNameFromColorGradient(gradient: ColorGradient): string {
        const mainParsedColor = parseColor(gradient.mainColor);
        const secondaryParsedColor = parseColor(gradient.secondaryColor);
        return "gradient" + (mainParsedColor.hex as string).substr(1) + (secondaryParsedColor.hex as string).substr(1) + gradient.direction;
    }

    getLabelColor(backgroundColor: string): string {
        let backgroundParsedColor = parseColor(backgroundColor);
        // Used to use HSL, but I think this is more accurate
        let rgb: number[] = backgroundParsedColor.rgb;
        if (isNullOrUndefined(rgb)) {
            return "#222";
        }
        let grayscale = 0.2989 * rgb[0] + 0.5870 * rgb[1] + 0.1140 * rgb[2];
        if (grayscale > 0.5 * 255) {
            return "#222";
        } else {
            return "#ddd";
        }
    }

    getCenter(shapes: Array<Array<[number, number]>>): [number, number] {
        if (this.props.isCartogram) {
            return polylabel([shapes[0]]) as [number, number];
        }
        else {
            // Very rough heuristic to find the "main" path
            // could look at bounding box instead
            let maxIndex: number = _.maxBy(_.range(0, shapes.length), index => shapes[index].length);
            return polylabel([shapes[maxIndex]]) as [number, number];
        }
    }

    parsePath(str: string): Array<Array<[number, number]>> {
        var polys = str.replace(/^M|Z$/g, "").split("ZM").map(function (poly: string) {
            return poly.split("L").map(function (pair: string) {
                // in Edge these are space-delimited??
                return pair.trim().replace(" ", ",").split(",").map(function (xOrY: string) {
                    return parseFloat(xOrY);
                });
            });
        });
        return polys as Array<Array<[number, number]>>;
    }

    render() {
        if (isNullOrUndefined(this.state.drawingInfo)) {
            return <div>Loading...</div>;
        }
        // https://d3-geomap.github.io/map/choropleth/us-states/
        //const map = d3.geomap.choropleth().geofile('/d3-geomap/topojson/countries/USA.json').projection(this.projection);
        let paths: JSX.Element[] = [];
        let gradients = new Set<ColorGradient>();
        let scale = 1, xOffset = 0, yOffset = 0;
        if (!this.props.isCartogram) {
            const us = this.state.drawingInfo.usTopoJson;
            scale = 1.75;
            yOffset = -50 * scale;
            const geometries = us.objects.states.geometries;
            for (let i = 0; i < geometries.length; ++i) {
                let topoState = geometries[i];
                let stateId = topoState.id;
                let stateNameObj = this.state.drawingInfo.stateInfos.idToStateName.get(stateId);
                let stateCode = stateNameObj.code;
                for (let path of this.getSVGPaths(stateCode, stateNameObj.name, this.geoPath(topojson.feature(us, topoState)), gradients)) {
                    paths.push(path);
                }
            }
        }
        else {
            let that = this;
            this.state.drawingInfo.cartogram.selectAll("path").each(function () {
                let thisPath = this as SVGPathElement;
                let stateCode = thisPath.getAttribute("id");
                let stateNameObj = that.state.drawingInfo.stateInfos.codeToStateName.get(stateCode);
                let pathString = thisPath.getAttribute("d");
                for (let path of that.getSVGPaths(stateCode, stateNameObj.name, pathString, gradients)) {
                    paths.push(path);
                }
            });
        }
        // Make text elements go to the end so they draw on top
        // first normal paths, then text background, then lines (pointing to text), then text
        let getPathValue = (x: JSX.Element): number => {
            if (x.type == 'text') {
                if (x.props.name.endsWith("textBackground")) {
                    return 2;
                }
                return 0;
            }
            // must be a path
            let name = x.props.name;
            if (name.endsWith("line")) {
                return 1;
            }
            return 3;
        }
        paths.sort((a, b) => {
            let aValue = getPathValue(a);
            let bValue = getPathValue(b);
            if (aValue > bValue) {
                return -1;
            }
            if (aValue < bValue) {
                return 1;
            }
            return 0;
        });
        let gradientElements: JSX.Element[] = [];
        for (let gradient of Array.from(gradients.values())) {
            let gradientName = this.gradientNameFromColorGradient(gradient);
            //TODO use direction
            gradientElements.push(<linearGradient x1="0" x2="1" y1="0" y2="0" id={gradientName} key={gradientName}>
                <stop offset="0%" stopColor={gradient.mainColor}/>
                <stop offset="100%" stopColor={gradient.secondaryColor}/>
            </linearGradient>);
        }
        let xTranslation = xOffset + (isUndefined(this.props.x) ? 0 : this.props.x);
        let yTranslation = yOffset + (isUndefined(this.props.y) ? 0 : this.props.y);
        return <svg width={this.props.width} height={this.props.height} onClick={this.rootClick}>
            <g className="usStateG" transform={`scale(${scale} ${scale}) translate(${xTranslation}, ${yTranslation})`} onClick={this.rootClick}>
                <defs>
                    {gradientElements}
                </defs>
                {paths}
            </g>
        </svg>;
    }
}
