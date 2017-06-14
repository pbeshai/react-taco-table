'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Utils = require('../Utils');

var Utils = _interopRequireWildcard(_Utils);

var _Summarizers = require('../Summarizers');

var Summarizers = _interopRequireWildcard(_Summarizers);

var _DataType = require('../DataType');

var _DataType2 = _interopRequireDefault(_DataType);

var _d3Scale = require('d3-scale');

var d3Scale = _interopRequireWildcard(_d3Scale);

var _d3ScaleChromatic = require('d3-scale-chromatic');

var d3ScaleChromatic = _interopRequireWildcard(_d3ScaleChromatic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// combine the modules into one big d3 module
var d3 = Object.assign({}, d3Scale, d3ScaleChromatic);

/**
 * Special color schemes available via d3-scale and d3-scale-chromatic
 * `interpolate${scheme}(t)` functions.
 *
 * See https://github.com/d3/d3-scale-chromatic
 * and https://github.com/d3/d3-scale#interpolateViridis
 *
 * @enum {String}
 */
/**
 * Adds heatmap coloring to cells. By default colors based on min and max
 * in the data and the magma color scheme via `d3-scale`.
 *
 * This plugin provides the following fields:
 * - id: `heatmap`
 * - tdClassName: `has-heatmap`
 * - summarize: minMaxSummarizer
 * - tdStyle
 * - columnTest
 * - ColorSchemes
 *
 * ## Plugin Options
 *
 * Plugin options found in `column.plugins.heatmap` since the plugin has id `heatmap`.
 *
 * - **domain** {Number[]} the domain to use for the color scale, if not provided, uses columnSummary min and max
 * - **backgroundScale** {Function} the scale to use for the background-color
 * - **colorScale** {Function} the scale to use for the color
 * - **colorShift** {Number} if provided, shifts the background color to create the foreground color.
 *    It is a number between 0 and 1 describing how far to shift.
 * - **colorScheme** {String} if provided, specifies which d3-scale/d3-scale-chromatic special
 *    scale to use. Options are: Viridis, Inferno, Magma, Plasma, Warm, Cool, Rainbow, CubehelixDefault,
 *    BrBG, PRGn, PiYG, PuOr, RdBu, RdGy, RdYlBu, RdYlGn, Spectral, Blues, Greens, Greys,
 *    Oranges, Purples, Reds, BuGn, BuPu, GnBu, OrRd, PuBuGn, PuBu, PuRd, RdPu, YlGnBu,
 *    YlGn, YlOrBr, YlOrRd
 * - **reverseColors** {Boolean} If true, the colors in the scheme will be applied in reverse order
 *
 * @module plugins/HeatmapPlugin
 */
var ColorSchemes = {
  // from d3-scale
  Viridis: 'Viridis',
  Inferno: 'Inferno',
  Magma: 'Magma',
  Plasma: 'Plasma',
  Warm: 'Warm',
  Cool: 'Cool',
  Rainbow: 'Rainbow',
  CubehelixDefault: 'CubehelixDefault',

  // from d3-scale-chromatic
  BrBG: 'BrBG',
  PRGn: 'PRGn',
  PiYG: 'PiYG',
  PuOr: 'PuOr',
  RdBu: 'RdBu',
  RdGy: 'RdGy',
  RdYlBu: 'RdYlBu',
  RdYlGn: 'RdYlGn',
  Spectral: 'Spectral',
  Blues: 'Blues',
  Greens: 'Greens',
  Greys: 'Greys',
  Oranges: 'Oranges',
  Purples: 'Purples',
  Reds: 'Reds',
  BuGn: 'BuGn',
  BuPu: 'BuPu',
  GnBu: 'GnBu',
  OrRd: 'OrRd',
  PuBuGn: 'PuBuGn',
  PuBu: 'PuBu',
  PuRd: 'PuRd',
  RdPu: 'RdPu',
  YlGnBu: 'YlGnBu',
  YlGn: 'YlGn',
  YlOrBr: 'YlOrBr',
  YlOrRd: 'YlOrRd'
};

var defaultColorScheme = ColorSchemes.Blues;

/**
 * Compute the style for the td elements by setting the background and color
 * based on the sort value.
 *
 * @param {Object} cellData the data for the cell
 * @param {Object} props Additional properties for the cell
 * @param {Object} props.columnSummary the column summary
 * @param {Object} props.column The column definition
 * @param {Object} props.rowData the data for the row
 * @param {Boolean} props.isBottomData whether the row is in bottom data area
 * @return {Object} the style object
 */
function tdStyle(cellData, _ref) {
  var columnSummary = _ref.columnSummary,
      column = _ref.column,
      rowData = _ref.rowData,
      isBottomData = _ref.isBottomData;

  var domain = void 0;
  var backgroundScale = void 0;
  var colorScale = void 0;
  var colorShift = void 0;
  var colorScheme = void 0;
  var reverseColors = void 0;
  var includeBottomData = void 0;

  // read in from plugin options
  if (column.plugins && column.plugins.heatmap) {
    domain = column.plugins.heatmap.domain;
    backgroundScale = column.plugins.heatmap.backgroundScale;
    colorScale = column.plugins.heatmap.colorScale;
    colorShift = column.plugins.heatmap.colorShift;
    colorScheme = column.plugins.heatmap.colorScheme;
    reverseColors = column.plugins.heatmap.reverseColors;
    includeBottomData = column.plugins.heatmap.includeBottomData;
  }

  // skip in bottom data area unless this column explicitly says to include it
  if (isBottomData && !includeBottomData) {
    return undefined;
  }

  // compute the sort value
  var sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);

  // do not heatmap null or undefined values
  if (sortValue == null) {
    return undefined;
  }

  // default domain if not provided comes from columnSummary
  if (!domain) {
    // if we didn't get a min/max, just use [0, 1]
    var colMin = columnSummary.min == null ? 0 : columnSummary.min;
    var colMax = columnSummary.max == null ? 1 : columnSummary.max;
    domain = [colMin, colMax];
  }

  // reverse the domain if specified to get the color scheme inverted
  if (reverseColors) {
    domain = domain.slice().reverse();
  }

  var domainScale = d3.scaleLinear().domain(domain).range([0, 1]).clamp(true);

  // if a background scale is provided, use it
  var backgroundColor = void 0;
  if (backgroundScale) {
    if (backgroundScale.domain) {
      backgroundScale.domain(domain);
    }
    backgroundColor = backgroundScale(sortValue);
  }

  // if a color scale is provided, use it
  var color = void 0;
  if (colorScale) {
    if (colorScale.domain) {
      colorScale.domain(domain);
    }
    color = colorScale(sortValue);

    // if a color shift is defined, shift the background color by this amount (0, 1)
  } else if (backgroundScale && colorShift) {
    var shiftedValue = domainScale.invert((domainScale(sortValue) + colorShift) % 1);
    color = backgroundScale(shiftedValue);
  }

  // if no background scale and color scale provided, use default - magma
  if (backgroundScale == null) {
    colorScheme = colorScheme || defaultColorScheme;

    backgroundColor = d3['interpolate' + colorScheme](domainScale(sortValue));
    if (!colorScale) {
      colorShift = colorShift || 0.5;
      color = d3['interpolate' + colorScheme]((domainScale(sortValue) + colorShift) % 1);
    }
  }

  return {
    backgroundColor: backgroundColor,
    color: color
  };
}

/**
 * Apply this plugin if it is a number and plugins.heatmap isn't explicitly set to false
 * OR if plugins.heatmap is set
 *
 * @param {Object} column The column definition
 * @return {Boolean} true to run the plugin on the column, false to not
 */
function columnTest(column) {
  return column.type === _DataType2.default.Number && (!column.plugins || column.plugins && column.plugins.heatmap !== false) || column.plugins && column.plugins.heatmap;
}

var Plugin = {
  id: 'heatmap',
  summarize: Summarizers.minMaxSummarizer,
  tdStyle: tdStyle,
  tdClassName: 'has-heatmap',
  columnTest: columnTest,
  ColorSchemes: ColorSchemes
};

exports.default = Plugin;
