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
 * - **domain** {Number[]} the domain to use for the color scale, if not provided, uses summary min and max
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
import * as Utils from '../Utils';
import * as Summarizers from '../Summarizers';
import DataType from '../DataType';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

// combine the modules into one big d3 module
const d3 = Object.assign({}, d3Scale, d3ScaleChromatic);

/**
 * Special color schemes available via d3-scale and d3-scale-chromatic
 * `interpolate${scheme}(t)` functions.
 *
 * See https://github.com/d3/d3-scale-chromatic
 * and https://github.com/d3/d3-scale#interpolateViridis
 *
 * @enum {String}
 */
const ColorSchemes = {
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
  YlOrRd: 'YlOrRd',
};

const defaultColorScheme = ColorSchemes.Blues;

/**
 * Compute the style for the td elements by setting the background and color
 * based on the sort value.
 *
 * @param {Object} cellData the data for the cell
 * @param {Object} summary the column summary
 * @param {Object} column The column definition
 * @param {Object} rowData the data for the row
 * @return {Object} the style object
 */
function tdStyle(cellData, summary, column, rowData) {
  let domain;
  let backgroundScale;
  let colorScale;
  let colorShift;
  let colorScheme;
  let reverseColors;

  // compute the sort value
  const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);

  // read in from plugin options
  if (column.plugins && column.plugins.heatmap) {
    domain = column.plugins.heatmap.domain;
    backgroundScale = column.plugins.heatmap.backgroundScale;
    colorScale = column.plugins.heatmap.colorScale;
    colorShift = column.plugins.heatmap.colorShift;
    colorScheme = column.plugins.heatmap.colorScheme;
    reverseColors = column.plugins.heatmap.reverseColors;
  }

  // default domain if not provided comes from summary
  if (!domain) {
    domain = [summary.min, summary.max];
  }

  // reverse the domain if specified to get the color scheme inverted
  if (reverseColors) {
    domain = domain.slice().reverse();
  }

  const domainScale = d3.scaleLinear().domain(domain)
    .range([0, 1])
    .clamp(true);


  // if a background scale is provided, use it
  let backgroundColor;
  if (backgroundScale) {
    if (backgroundScale.domain) {
      backgroundScale.domain(domain);
    }
    backgroundColor = backgroundScale(sortValue);
  }

  // if a color scale is provided, use it
  let color;
  if (colorScale) {
    if (colorScale.domain) {
      colorScale.domain(domain);
    }
    color = colorScale(sortValue);

  // if a color shift is defined, shift the background color by this amount (0, 1)
  } else if (backgroundScale && colorShift) {
    const shiftedValue = domainScale.invert((domainScale(sortValue) + colorShift) % 1);
    color = backgroundScale(shiftedValue);
  }

  // if no background scale and color scale provided, use default - magma
  if (backgroundScale == null) {
    colorScheme = colorScheme || defaultColorScheme;

    backgroundColor = d3[`interpolate${colorScheme}`](domainScale(sortValue));
    if (!colorScale) {
      colorShift = colorShift || 0.5;
      color = d3[`interpolate${colorScheme}`]((domainScale(sortValue) + colorShift) % 1);
    }
  }

  return {
    backgroundColor,
    color,
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
  return (column.type === DataType.Number &&
           (!column.plugins || (column.plugins && column.plugins.heatmap !== false))) ||
         (column.plugins && column.plugins.heatmap);
}

const Plugin = {
  id: 'heatmap',
  summarize: Summarizers.minMaxSummarizer,
  tdStyle,
  tdClassName: 'has-heatmap',
  columnTest,
  ColorSchemes,
};

export default Plugin;
