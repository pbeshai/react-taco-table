import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters,
  Plugins } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';
import * as d3 from 'd3-scale';

/**
 * An example demonstrating how to add heatmap to cells via
 * the Heatmap plugin.
 */

const columns = [
  {
    id: 'name',
    value: rowData => rowData.cellLine.label,
    header: 'Cell Line',
    type: DataType.String,
  },
  {
    id: 'receptorStatus',
    header: 'Receptor Status',
    value: rowData => rowData.receptorStatus.label,
    type: DataType.String,
  },
  {
    id: 'MLL3',
    type: DataType.String,
  },
  {
    id: 'value-no-heatmap',
    type: DataType.Number,
    value: rowData => rowData.value,
    renderer: Formatters.plusMinusFormat(1),
    // explicitly turn off heatmap by setting it to false
    plugins: { heatmap: false },
  },
  // this column uses default heatmap options since it is DataType.Number
  {
    id: 'value',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(1),
  },
  {
    id: 'value-always',
    type: DataType.Number,
    value: rowData => rowData.value,
    renderer: Formatters.plusMinusFormat(1),
    plugins: {
      heatmap: {
        // specify to have it always count as highlighted
        highlight: 'always',
      },
    },
  },
  {
    id: 'rating',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(2),
  },
  {
    id: 'percent',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(2),
  },
  // Note that DataType.NumberOrdinal does not automatically get heatmapped
  {
    id: 'level',
    type: DataType.NumberOrdinal,
  },
];

const plugins = [
  Plugins.HighlightOnly(Plugins.HeatmapPlugin, { onColumnHighlight: true, onRowHighlight: true })
];

class ExampleHeatmapHighlightOnly extends React.Component {
  render() {
    return (
      <TacoTable
        columns={columns}
        data={cellLinesData}
        plugins={plugins}
        columnHighlighting={true}
        rowHighlighting={true}
        sortable
      />
    );
  }
}

export default ExampleHeatmapHighlightOnly;
