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
    id: 'value-inferno',
    type: DataType.Number,
    value: rowData => rowData.value,
    renderer: Formatters.plusMinusFormat(1),
    plugins: {
      heatmap: {
        // specify an alternate built-in color scheme
        colorScheme: Plugins.HeatmapPlugin.ColorSchemes.Inferno,
      },
    },
  },

  {
    id: 'rating',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(2),
    plugins: {
      heatmap: {
        colorScheme: Plugins.HeatmapPlugin.ColorSchemes.YlOrRd,
        // specify an color scale -> always black
        colorScale: () => '#000',
      },
    },
  },
  // Note that DataType.NumberOrdinal does not automatically get heatmapped
  {
    id: 'level',
    type: DataType.NumberOrdinal,
  },
  {
    id: 'level-1',
    type: DataType.NumberOrdinal,
    value: rowData => rowData.level,
    plugins: {
      heatmap: {
        // specify a domain to use instead of min, max in the data
        domain: [2, 9],

        // specfy an alternate background scale
        backgroundScale: d3.scaleLinear().range(['#404', '#fff']).clamp(true),
      },
    },
  },
  {
    id: 'level-2',
    type: DataType.NumberOrdinal,
    value: rowData => rowData.level,
    plugins: {
      heatmap: {
        domain: [2, 9],
        backgroundScale: d3.scaleLinear().range(['#404', '#fff']).clamp(true),

        // base the color on the background color, shifted by 50%
        colorShift: 0.5,
      },
    },
  },
];

const plugins = [Plugins.HeatmapPlugin];

class ExampleHeatmap extends React.Component {
  render() {
    return (
      <TacoTable
        columns={columns}
        data={cellLinesData}
        plugins={plugins}
        sortable
      />
    );
  }
}

export default ExampleHeatmap;
