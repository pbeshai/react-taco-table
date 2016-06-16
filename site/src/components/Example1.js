import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters,
  Utils, Summarizers, TdClassNames, Plugins } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';
import * as d3 from 'd3-scale';

import './example1.scss';

// add some random values to the data
cellLinesData.forEach(d => {
  d.value1 = Math.random() * 100;
  d.value2 = Math.random() * 5 - 3;
  d.value3 = Math.ceil(Math.random() * 10);
});


const columns = [
  {
    id: 'name',
    value: rowData => rowData.cellLine,
    className: 'shared-class',
    header: 'Cell Line',
    renderer: cellData => <b>{cellData.label}</b>,
    sortValue: cellData => cellData.label,
    tdClassName: 'td-class-name',
    thClassName: 'th-class-name',
    type: DataType.String,
    width: 250,
  },
  {
    id: 'receptorStatus',
    header: 'Receptor Status',
    renderer: cellData => cellData.label,
    sortValue: cellData => cellData.label,
    type: DataType.String,
  },
  {
    id: 'BRCA1',
    type: DataType.String,
  },
  {
    id: 'value1',
    type: DataType.Number,
    renderer: Formatters.decFormat(1),
    firstSortDirection: SortDirection.Descending,
    summarize: Summarizers.minMaxSummarizer,
    tdStyle: (cellData, summary, column, rowData) => {
      const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);

      if (sortValue === summary.min) {
        return { color: 'red' };
      } else if (sortValue === summary.max) {
        return { color: 'green' };
      }

      return undefined;
    },
    tdClassName: TdClassNames.minMaxClassName,
    plugins: { heatmap: false },
  },
  {
    id: 'value2',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(1),
    firstSortDirection: SortDirection.Ascending,
  },
  {
    id: 'value2-2',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(2),
    value: (rowData) => rowData.value2,
    plugins: {
      heatmap: {
        colorScheme: Plugins.HeatmapPlugin.ColorSchemes.Inferno,
      },
    },
  },
  {
    id: 'value2-3',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(1),
    value: (rowData) => rowData.value2,
    plugins: {
      heatmap: {
        colorScheme: Plugins.HeatmapPlugin.ColorSchemes.Rainbow,
        colorScale: () => 'black',
      },
    },
  },
  {
    id: 'value3',
    type: DataType.NumberOrdinal,
    plugins: {
      heatmap: {
        domain: [3, 6],
        backgroundScale: d3.scaleLinear().range(['#000', '#fff']).clamp(true),
        colorScale: () => 'red',
      },
    },
  },
  {
    id: 'value3-2',
    type: DataType.NumberOrdinal,
    value: (rowData) => rowData.value3,
    plugins: {
      heatmap: {
        domain: [3, 6],
        backgroundScale: d3.scaleLinear().range(['#000', '#fff']).clamp(true),
      },
    },
  },
  {
    id: 'value3-3',
    type: DataType.NumberOrdinal,
    value: (rowData) => rowData.value3,
    plugins: {
      heatmap: {
        domain: [3, 6],
        backgroundScale: d3.scaleLinear().range(['#000', '#fff']).clamp(true),
        colorShift: 0.5,
      },
    },
  },
  {
    id: 'value3-4',
    type: DataType.NumberOrdinal,
    value: (rowData) => rowData.value3,
    plugins: {
      heatmap: {
        domain: [3, 6],
        colorScheme: Plugins.HeatmapPlugin.ColorSchemes.CubehelixDefault,
        highlight: 'always',
      },
    },
  },

  {
    id: 'Nothing',
    value: () => null,
    type: DataType.None,
  },
];

function rowClassName(rowData, rowNumber) {
  if (rowNumber % 5 === 0) {
    return 'five-row';
  }

  return undefined;
}

const plugins = [Plugins.HighlightOnly(Plugins.HeatmapPlugin, { onColumnHighlight: true, onRowHighlight: true })];
const columnGroups = [
  { columns: ['name', 'receptorStatus'], header: 'Group 1' },
  { columns: ['BRCA1'], header: 'Group 2', className: 'big-group' },
  { columns: ['Nothing'] },
];

class Example1 extends React.Component {
  render() {
    return (
      <div>
        <TacoTable
          columns={columns}
          columnGroups={columnGroups}
          columnHighlighting={true}
          data={cellLinesData}
          initialSortColumn={'name'}
          initialSortDirection={SortDirection.Descending}
          plugins={plugins}
          rowClassName={rowClassName}
          striped
          sortable
        />
      </div>
    );
  }
}

export default Example1;
