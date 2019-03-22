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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var react_1 = require("react");
var d3 = require("d3");
var lodash_1 = require("lodash");
var topojson = require("topojson");
var polylabel_1 = require("polylabel");
var util_1 = require("util");
var parse_color_1 = require("parse-color");
require("./USStateMap.css");
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
        _this.getSVGPaths = function (stateCode, stateName, path, backgroundColors) {
            if (util_1.isNullOrUndefined(path)) {
                return [];
            }
            var color = (_this.props.stateColors && _this.props.stateColors.get(stateCode)) || 'rgb(240, 240, 240)';
            var titleExtra = _this.props.stateTitles && _this.props.stateTitles.get(stateCode);
            var parsedPath = _this.parsePath(path);
            var title = util_1.isNullOrUndefined(titleExtra) ? stateName : stateName + ": " + titleExtra;
            var textPosition;
            var parts = [];
            var filterText = "";
            // only use labelLines in non-cartogram mode - state codes fit inside all the states in cartogram mode
            if (!_this.props.isCartogram && _this.labelLines.has(stateCode)) {
                var labelLineInfo = _this.labelLines.get(stateCode);
                textPosition = labelLineInfo.lineTextPosition;
                var linePath = "M " + labelLineInfo.lineStart[0] + "," + labelLineInfo.lineStart[1] + " L " + labelLineInfo.lineEnd[0] + "," + labelLineInfo.lineEnd[1] + " Z";
                parts.push(react_1["default"].createElement("path", { key: stateCode + "line", name: stateCode + "line", d: linePath, className: "labelLine" }));
                backgroundColors.add(color);
                var filterName = _this.filterNameFromColor(color);
                filterText = "url(#" + filterName + ")";
            }
            else {
                textPosition = _this.getCenter(parsedPath);
            }
            parts.push(react_1["default"].createElement("path", { name: stateCode, d: path, style: { fill: color }, key: stateCode, onClick: _this.stateClick },
                react_1["default"].createElement("title", null, title)));
            parts.push(react_1["default"].createElement("text", { name: stateCode, x: textPosition[0], y: textPosition[1], key: stateCode + "text", dy: "0.25em", onClick: _this.stateClick, stroke: _this.getLabelColor(color), filter: filterText },
                react_1["default"].createElement("title", null, title),
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
                        usPromise = d3.json('data/us.json');
                        stateNamesPromise = d3.tsv('data/us-state-names.tsv', this.cleanStateName);
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
                        return [4 /*yield*/, d3.xml('data/cartograms/fivethirtyeight.svg', { headers: new Headers({ "Content-Type": "image/svg+xml" }) })];
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
    USStateMap.prototype.filterNameFromColor = function (color) {
        var parsedColor = parse_color_1["default"](color);
        return "color" + parsedColor.hex.substr(1);
    };
    USStateMap.prototype.getLabelColor = function (backgroundColor) {
        var backgroundParsedColor = parse_color_1["default"](backgroundColor);
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
            return polylabel_1["default"]([shapes[0]]);
        }
        else {
            // Very rough heuristic to find the "main" path
            // could look at bounding box instead
            var maxIndex = lodash_1["default"].maxBy(lodash_1["default"].range(0, shapes.length), function (index) { return shapes[index].length; });
            return polylabel_1["default"]([shapes[maxIndex]]);
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
    USStateMap.prototype.render = function () {
        if (util_1.isNullOrUndefined(this.state.drawingInfo)) {
            return react_1["default"].createElement("div", null, "Loading...");
        }
        // https://d3-geomap.github.io/map/choropleth/us-states/
        //const map = d3.geomap.choropleth().geofile('/d3-geomap/topojson/countries/USA.json').projection(this.projection);
        var paths = [];
        var backgroundColors = new Set();
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
                for (var _i = 0, _a = this.getSVGPaths(stateCode, stateNameObj.name, this.geoPath(topojson.feature(us, topoState)), backgroundColors); _i < _a.length; _i++) {
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
                for (var _i = 0, _a = that_1.getSVGPaths(stateCode, stateNameObj.name, pathString, backgroundColors); _i < _a.length; _i++) {
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
        var filters = [];
        for (var _b = 0, _c = Array.from(backgroundColors.values()); _b < _c.length; _b++) {
            var color = _c[_b];
            var filterName = this.filterNameFromColor(color);
            filters.push(react_1["default"].createElement("filter", { x: "0", y: "0", width: "1", height: "1", id: filterName, key: filterName },
                react_1["default"].createElement("feFlood", { floodColor: color }),
                react_1["default"].createElement("feComposite", { "in": "SourceGraphic" })));
        }
        return react_1["default"].createElement("svg", { width: this.props.width, height: this.props.height, onClick: this.rootClick },
            react_1["default"].createElement("g", { transform: "scale(" + scale + " " + scale + ") translate(" + (this.props.x + xOffset) + ", " + (this.props.y + yOffset) + ")", onClick: this.rootClick },
                react_1["default"].createElement("defs", null, filters),
                paths));
    };
    return USStateMap;
}(react_1.Component));
exports.USStateMap = USStateMap;
//# sourceMappingURL=USStateMap.js.map