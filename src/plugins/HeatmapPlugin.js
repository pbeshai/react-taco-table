/** @module HeatmapPlugin */
import * as Utils from '../Utils';
import * as Summarizers from '../Summarizers';
import DataType from '../DataType';
import { scaleLinear, interpolateInferno } from 'd3-scale';

function tdStyle(cellData, summary, column, rowData) {
  let domain;
  if (column.plugins && column.plugins.heatmap && column.plugins.heatmap.domain) {
    domain = column.plugins.heatmap.domain;
  } else {
    domain = [summary.min, summary.max];
  }

  const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
  const minMaxScale = scaleLinear().domain(domain).range([0, 1]);

  return {
    backgroundColor: interpolateInferno(minMaxScale(sortValue)),
    color: interpolateInferno((minMaxScale(sortValue) + 0.5) % 1),
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

const plugin = {
  summarize: Summarizers.minMaxSummarizer,
  tdStyle,
  tdClassName: 'has-heatmap',
  columnTest,
};

export default plugin;
