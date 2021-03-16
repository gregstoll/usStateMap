"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.USStateMap = exports.ColorGradient = exports.GradientDirection = void 0;
var react_1 = require("react");
var React = require("react");
var d3 = require("d3");
var _ = require("lodash");
var topojson = require("topojson");
var util_1 = require("util");
// not sure why these are necessary this way?
var polylabel = require('polylabel');
var parseColor = require('parse-color');
require("./USStateMap.css");
function getD3Url(path) {
    if (process.env.NODE_ENV !== "production") {
        return process.env.PUBLIC_URL + '/' + path;
    }
    return path;
}
var GradientDirection;
(function (GradientDirection) {
    GradientDirection[GradientDirection["Up"] = 0] = "Up";
    GradientDirection[GradientDirection["Down"] = 1] = "Down";
    GradientDirection[GradientDirection["Left"] = 2] = "Left";
    GradientDirection[GradientDirection["Right"] = 3] = "Right";
})(GradientDirection = exports.GradientDirection || (exports.GradientDirection = {}));
var ColorGradient = /** @class */ (function () {
    function ColorGradient(mainColor, secondaryColor, direction, mainColorStop, secondaryColorStop) {
        this.mainColor = mainColor;
        this.secondaryColor = secondaryColor;
        this.direction = direction;
        if (mainColorStop === undefined) {
            this.mainColorStop = 0;
        }
        else {
            if (mainColorStop < 0 || mainColorStop > 1) {
                throw "mainColorStop must be between 0-1, got " + mainColorStop;
            }
            this.mainColorStop = mainColorStop;
        }
        if (secondaryColorStop === undefined) {
            this.secondaryColorStop = 1;
        }
        else {
            if (secondaryColorStop < 0 || secondaryColorStop > 1) {
                throw "secondaryColorStop must be between 0-1, got " + secondaryColorStop;
            }
            if (secondaryColorStop < mainColorStop) {
                throw "secondaryColorStop (" + secondaryColorStop + ") must be greater than or equal to mainColorStop (" + mainColorStop + ")";
            }
            this.secondaryColorStop = secondaryColorStop;
        }
    }
    return ColorGradient;
}());
exports.ColorGradient = ColorGradient;
;
;
;
var USStateMap = /** @class */ (function (_super) {
    __extends(USStateMap, _super);
    function USStateMap(props) {
        var _this = _super.call(this, props) || this;
        _this.stateClick = function (event) {
            var stateCode = event.currentTarget.attributes["name"].value;
            if (_this.props.stateSelectedCallback) {
                _this.props.stateSelectedCallback(stateCode);
            }
        };
        _this.rootClick = function (event) {
            // event.target is the childmost thing that got clicked on
            // (event.currentTarget is the element we registered on, which is not helpful)
            var target = event.target;
            if (util_1.isNullOrUndefined(target)) {
                return;
            }
            var nameAttribute = target.attributes["name"];
            // TODO - this is a little brittle, I guess, it assumes that the root SVG
            // thing doesn't have a name
            if (util_1.isNullOrUndefined(nameAttribute)) {
                if (_this.props.stateClearedCallback) {
                    _this.props.stateClearedCallback();
                }
            }
        };
        _this.getSVGPaths = function (stateCode, stateName, path, gradients) {
            if (util_1.isNullOrUndefined(path)) {
                return [];
            }
            var color = (_this.props.stateColors && _this.props.stateColors.get(stateCode)) || 'rgb(240, 240, 240)';
            var titleExtra = _this.props.stateTitles && _this.props.stateTitles.get(stateCode);
            var parsedPath = _this.parsePath(path);
            var title = util_1.isNullOrUndefined(titleExtra) ? stateName : stateName + ": " + titleExtra;
            var textPosition;
            var parts = [];
            var primaryColor = _this.isColorGradient(color) ? color.mainColor : color;
            if (_this.isColorGradient(color)) {
                gradients.add(color);
            }
            var cssColor = _this.isColorGradient(color) ? "url(#" + _this.gradientNameFromColorGradient(color) + ")" : color;
            // only use labelLines in non-cartogram mode - state codes fit inside all the states in cartogram mode
            if (!_this.props.isCartogram && _this.labelLines.has(stateCode)) {
                var labelLineInfo = _this.labelLines.get(stateCode);
                textPosition = labelLineInfo.lineTextPosition;
                var linePath = "M " + labelLineInfo.lineStart[0] + "," + labelLineInfo.lineStart[1] + " L " + labelLineInfo.lineEnd[0] + "," + labelLineInfo.lineEnd[1] + " Z";
                parts.push(React.createElement("path", { key: stateCode + "line", name: stateCode + "line", d: linePath, className: "labelLine" }));
            }
            else {
                textPosition = _this.getCenter(parsedPath);
            }
            parts.push(React.createElement("path", { className: "usState", name: stateCode, d: path, style: { fill: cssColor }, key: stateCode, onClick: _this.stateClick },
                React.createElement("title", null, title)));
            if (!_this.props.isCartogram && _this.labelLines.has(stateCode)) {
                // https://stackoverflow.com/a/41902064/118417
                // This is a somewhat hacky but easy way to get a background for an SVG text element.
                // Note that we use "HH" since we know all of these state codes are two characters, and
                // "H" doesn't cause any weird edges. (try "XX" or "VV" to see the weirdness)
                parts.push(React.createElement("text", { className: "usStateText", name: stateCode, x: textPosition[0], y: textPosition[1], key: stateCode + "textBackground", dy: "0.25em", onClick: _this.stateClick, stroke: cssColor, strokeWidth: "0.6em" },
                    React.createElement("title", null, title),
                    "HH"));
            }
            parts.push(React.createElement("text", { className: "usStateText", name: stateCode, x: textPosition[0], y: textPosition[1], key: stateCode + "text", dy: "0.25em", onClick: _this.stateClick, stroke: _this.getLabelColor(primaryColor) },
                React.createElement("title", null, title),
                stateCode));
            return parts;
        };
        _this.state = { drawingInfo: undefined };
        _this.projection = d3.geoAlbersUsa().scale(1280);
        _this.geoPath = d3.geoPath().projection(_this.projection);
        _this.updateD3(props);
        _this.initLabelLines();
        return _this;
    }
    USStateMap.prototype.componentDidMount = function () {
        this.loadAllData();
    };
    USStateMap.prototype.loadAllData = function () {
        var _this = this;
        this.getDataAsync().then(function (value) {
            _this.setState({ drawingInfo: value });
        })["catch"](function (error) {
            console.error("Error in USStateMap: " + error);
            if (_this.props.onError) {
                _this.props.onError(error);
            }
        });
    };
    USStateMap.prototype.getDataAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usPromise, stateNamesPromise, cartogramPromise, us, stateNames, cartogram, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        usPromise = d3.json(getD3Url('data/us.json'));
                        stateNamesPromise = d3.tsv(getD3Url('data/us-state-names.tsv'), this.cleanStateName);
                        cartogramPromise = this.getCartogramAsync();
                        return [4 /*yield*/, usPromise];
                    case 1:
                        us = _a.sent();
                        return [4 /*yield*/, stateNamesPromise];
                    case 2:
                        stateNames = _a.sent();
                        return [4 /*yield*/, cartogramPromise];
                    case 3:
                        cartogram = _a.sent();
                        return [2 /*return*/, {
                                usTopoJson: us,
                                cartogram: cartogram,
                                stateInfos: this.makeStateInfos(stateNames)
                            }];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Error in USStateMap: " + error_1);
                        if (this.props.onError) {
                            this.props.onError(error_1);
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    USStateMap.prototype.cleanStateName = function (d) {
        return {
            code: d.code,
            id: Number(d.id),
            name: d.name
        };
    };
    USStateMap.prototype.makeStateInfos = function (names) {
        var stateInfos = { codeToStateName: new Map(), idToStateName: new Map() };
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            stateInfos.codeToStateName.set(name_1.code, name_1);
            stateInfos.idToStateName.set(name_1.id, name_1);
        }
        return stateInfos;
    };
    USStateMap.prototype.getCartogramAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var xml, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, d3.xml(getD3Url('data/cartograms/fivethirtyeight.svg'), { headers: new Headers({ "Content-Type": "image/svg+xml" }) })];
                    case 1:
                        xml = _a.sent();
                        return [2 /*return*/, d3.select(xml.documentElement)];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error in USStateMap cartogram: " + error_2);
                        if (this.props.onError) {
                            this.props.onError(error_2);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    USStateMap.prototype.initLabelLines = function () {
        this.labelLines = new Map();
        this.labelLines.set('NH', { lineStart: [389, 155], lineEnd: [407, 187], lineTextPosition: [390, 150] });
        this.labelLines.set('VT', { lineStart: [371, 155], lineEnd: [399, 183], lineTextPosition: [372, 150] });
        this.labelLines.set('MA', { lineStart: [445, 195], lineEnd: [407, 198], lineTextPosition: [447, 195] });
        this.labelLines.set('RI', { lineStart: [445, 210], lineEnd: [410, 205], lineTextPosition: [447, 210] });
        this.labelLines.set('CT', { lineStart: [445, 225], lineEnd: [403, 206], lineTextPosition: [447, 225] });
        this.labelLines.set('NJ', { lineStart: [445, 240], lineEnd: [393, 218], lineTextPosition: [447, 240] });
        this.labelLines.set('DE', { lineStart: [445, 255], lineEnd: [391, 235], lineTextPosition: [447, 255] });
        this.labelLines.set('MD', { lineStart: [445, 270], lineEnd: [381, 230], lineTextPosition: [447, 270] });
        this.labelLines.set('DC', { lineStart: [445, 285], lineEnd: [379, 235], lineTextPosition: [447, 285] });
    };
    USStateMap.prototype.updateD3 = function (props) {
        // Make the actual SVG be square, because that's how the paths (especially for Normal mode)
        // are laid out.
        var actualDimension = Math.min(props.width, props.height);
        this.projection
            .translate([actualDimension / 2, actualDimension / 2])
            .scale(actualDimension * 1.0);
    };
    USStateMap.prototype.isColorGradient = function (color) {
        return color.direction !== undefined;
    };
    USStateMap.prototype.gradientNameFromColorGradient = function (gradient) {
        var mainParsedColor = parseColor(gradient.mainColor);
        var secondaryParsedColor = parseColor(gradient.secondaryColor);
        return "gradient" + mainParsedColor.hex.substr(1) + secondaryParsedColor.hex.substr(1) + gradient.direction;
    };
    USStateMap.prototype.getLabelColor = function (backgroundColor) {
        var backgroundParsedColor = parseColor(backgroundColor);
        // Used to use HSL, but I think this is more accurate
        var rgb = backgroundParsedColor.rgb;
        if (util_1.isNullOrUndefined(rgb)) {
            return "#222";
        }
        var grayscale = 0.2989 * rgb[0] + 0.5870 * rgb[1] + 0.1140 * rgb[2];
        if (grayscale > 0.5 * 255) {
            return "#222";
        }
        else {
            return "#ddd";
        }
    };
    USStateMap.prototype.getCenter = function (shapes) {
        if (this.props.isCartogram) {
            return polylabel([shapes[0]]);
        }
        else {
            // Very rough heuristic to find the "main" path
            // could look at bounding box instead
            var maxIndex = _.maxBy(_.range(0, shapes.length), function (index) { return shapes[index].length; });
            return polylabel([shapes[maxIndex]]);
        }
    };
    USStateMap.prototype.parsePath = function (str) {
        var polys = str.replace(/^M|Z$/g, "").split("ZM").map(function (poly) {
            return poly.split("L").map(function (pair) {
                // in Edge these are space-delimited??
                return pair.trim().replace(" ", ",").split(",").map(function (xOrY) {
                    return parseFloat(xOrY);
                });
            });
        });
        return polys;
    };
    USStateMap.prototype.makeSVGGradient = function (gradient) {
        function colorStopToPercentageText(colorStop) {
            return Math.round(colorStop * 100) + "%";
        }
        var gradientName = this.gradientNameFromColorGradient(gradient);
        var x1 = 0;
        var x2 = 0;
        var y1 = 0;
        var y2 = 0;
        switch (gradient.direction) {
            case GradientDirection.Up:
                y1 = 1;
                break;
            case GradientDirection.Down:
                y2 = 1;
                break;
            case GradientDirection.Left:
                x1 = 1;
                break;
            case GradientDirection.Right:
                x2 = 1;
                break;
        }
        var stops = [];
        stops.push(React.createElement("stop", { offset: "0%", stopColor: gradient.mainColor, key: "main" }));
        if (gradient.mainColorStop > 0) {
            stops.push(React.createElement("stop", { offset: colorStopToPercentageText(gradient.mainColorStop), stopColor: gradient.mainColor, key: "main2" }));
        }
        if (gradient.secondaryColorStop < 1) {
            stops.push(React.createElement("stop", { offset: colorStopToPercentageText(gradient.secondaryColorStop), stopColor: gradient.secondaryColor, key: "secondary2" }));
        }
        stops.push(React.createElement("stop", { offset: "100%", stopColor: gradient.secondaryColor, key: "secondary" }));
        return (React.createElement("linearGradient", { x1: x1, x2: x2, y1: y1, y2: y2, id: gradientName, key: gradientName }, stops));
    };
    USStateMap.prototype.render = function () {
        if (util_1.isNullOrUndefined(this.state.drawingInfo)) {
            return React.createElement("div", null, "Loading...");
        }
        // https://d3-geomap.github.io/map/choropleth/us-states/
        //const map = d3.geomap.choropleth().geofile('/d3-geomap/topojson/countries/USA.json').projection(this.projection);
        var paths = [];
        var gradients = new Set();
        var scale = 1, xOffset = 0, yOffset = 0;
        if (!this.props.isCartogram) {
            var us = this.state.drawingInfo.usTopoJson;
            scale = 1.75;
            yOffset = -50 * scale;
            var geometries = us.objects.states.geometries;
            for (var i = 0; i < geometries.length; ++i) {
                var topoState = geometries[i];
                var stateId = topoState.id;
                var stateNameObj = this.state.drawingInfo.stateInfos.idToStateName.get(stateId);
                var stateCode = stateNameObj.code;
                for (var _i = 0, _a = this.getSVGPaths(stateCode, stateNameObj.name, this.geoPath(topojson.feature(us, topoState)), gradients); _i < _a.length; _i++) {
                    var path = _a[_i];
                    paths.push(path);
                }
            }
        }
        else {
            var that_1 = this;
            this.state.drawingInfo.cartogram.selectAll("path").each(function () {
                var thisPath = this;
                var stateCode = thisPath.getAttribute("id");
                var stateNameObj = that_1.state.drawingInfo.stateInfos.codeToStateName.get(stateCode);
                var pathString = thisPath.getAttribute("d");
                for (var _i = 0, _a = that_1.getSVGPaths(stateCode, stateNameObj.name, pathString, gradients); _i < _a.length; _i++) {
                    var path = _a[_i];
                    paths.push(path);
                }
            });
        }
        // Make text elements go to the end so they draw on top
        // first normal paths, then text background, then lines (pointing to text), then text
        var getPathValue = function (x) {
            if (x.type == 'text') {
                if (x.props.name.endsWith("textBackground")) {
                    return 2;
                }
                return 0;
            }
            // must be a path
            var name = x.props.name;
            if (name.endsWith("line")) {
                return 1;
            }
            return 3;
        };
        paths.sort(function (a, b) {
            var aValue = getPathValue(a);
            var bValue = getPathValue(b);
            if (aValue > bValue) {
                return -1;
            }
            if (aValue < bValue) {
                return 1;
            }
            return 0;
        });
        var gradientElements = [];
        for (var _b = 0, _c = Array.from(gradients.values()); _b < _c.length; _b++) {
            var gradient = _c[_b];
            gradientElements.push(this.makeSVGGradient(gradient));
        }
        var xTranslation = xOffset + (util_1.isUndefined(this.props.x) ? 0 : this.props.x);
        var yTranslation = yOffset + (util_1.isUndefined(this.props.y) ? 0 : this.props.y);
        return React.createElement("svg", { width: this.props.width, height: this.props.height, onClick: this.rootClick },
            React.createElement("g", { className: "usStateG", transform: "scale(" + scale + " " + scale + ") translate(" + xTranslation + ", " + yTranslation + ")", onClick: this.rootClick },
                React.createElement("defs", null, gradientElements),
                paths));
    };
    return USStateMap;
}(react_1.Component));
exports.USStateMap = USStateMap;
//# sourceMappingURL=USStateMap.js.map