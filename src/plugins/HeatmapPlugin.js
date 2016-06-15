/** @module HeatmapPlugin
 * Adds heatmap coloring to cells. By default colors based on min and max in the data and
 * the inferno color scheme via d3-scale.
 *
 * Plugin options found in `plugins.heatmap`
 *
 * - **domain** {Array} the domain to use for the color scale, if not provided, uses summary min and max
 * - **backgroundScale** {Function} the scale to use for the background-color
 * - **colorScale** {Function} the scale to use for the color
 * - **colorShift** {Number} if provided, shifts the background color to create the foreground color.
 *    It is a number between 0 and 1 describing how far to shift.
 * - **colorScheme** {String} if provided, specifies which d3-scale special scale to use. Options
 *    are: Viridis, Inferno, Magma, Plasma, Warm, Cool, Rainbow
 */
import * as Utils from '../Utils';
import * as Summarizers from '../Summarizers';
import DataType from '../DataType';
import * as d3 from 'd3-scale';
import keyMirror from 'keymirror';

/**
 * Special color schemes available via d3-scale `interpolate${scheme}(t)` functions.
 */
const ColorSchemes = keyMirror({
  Viridis: null,
  Inferno: null,
  Magma: null,
  Plasma: null,
  Warm: null,
  Cool: null,
  Rainbow: null,
});

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

  // compute the sort value
  const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);

  // read in from plugin options
  if (column.plugins && column.plugins.heatmap) {
    domain = column.plugins.heatmap.domain;
    backgroundScale = column.plugins.heatmap.backgroundScale;
    colorScale = column.plugins.heatmap.colorScale;
    colorShift = column.plugins.heatmap.colorShift;
    colorScheme = column.plugins.heatmap.colorScheme;
  }

  // default domain if not provided comes from summary
  if (!domain) {
    domain = [summary.min, summary.max];
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

  // if no background scale and color scale provided, use default - inferno
  if (backgroundScale == null) {
    colorScheme = colorScheme || ColorSchemes.Inferno;

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
  summarize: Summarizers.minMaxSummarizer,
  tdStyle,
  tdClassName: 'has-heatmap',
  columnTest,
  ColorSchemes,
};

export default Plugin;
