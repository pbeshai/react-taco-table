import React from 'react';
import { TacoTable, DataType, Formatters, Summarizers,
  TdClassNames } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';

/**
 * An example demonstrating how to use column summarizers.
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

    // find the most frequently occurring value
    summarize: (column, tableData, columns) => {
      let mostFrequent;

      tableData.reduce((counts, rowData) => {
        const cellData = rowData.MLL3;
        if (!counts[cellData]) {
          counts[cellData] = 1;
        } else {
          counts[cellData] += 1;
        }

        if (mostFrequent == null || (counts[cellData] > counts[mostFrequent])) {
          mostFrequent = cellData;
        }

        return counts;
      }, {});

      return { mostFrequent };
    },

    // color the most frequently occuring value
    tdStyle: (cellData, summary, column, rowData) => {
      if (cellData === summary.mostFrequent) {
        return { color: '#34c', fontWeight: 'bold' };
      }

      return undefined;
    },
  },
  {
    id: 'value',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(1),
    // use the built-in summarizer to find minimum and maximum values
    summarize: Summarizers.minMaxSummarizer,

    // add highlight-max to max value and highlight-min to the min-value
    tdClassName: TdClassNames.minMaxClassName,
  },
  {
    id: 'value-max-only',
    value: rowData => rowData.value,
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(1),
    // use the built-in summarizer to find minimum and maximum values
    summarize: Summarizers.minMaxSummarizer,

    // add highlight-max to max value
    tdClassName: TdClassNames.maxClassName,
  },
  {
    id: 'rating',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(2),
    summarize: Summarizers.minMaxSummarizer,

    // manually style the min and max values
    tdStyle: (cellData, summary, column, rowData) => {
      if (cellData === summary.min) {
        return { color: '#c00', fontWeight: 'bold' };
      } else if (cellData === summary.max) {
        return { color: '#0a0', fontWeight: 'bold' };
      }

      return undefined;
    },
  },
  {
    id: 'level',
    type: DataType.NumberOrdinal,
    summarize: Summarizers.frequencySummarizer,

    // color the most frequently occuring value
    tdStyle: (cellData, summary, column, rowData) => {
      if (cellData === summary.mostFrequent) {
        return { color: '#34c', fontWeight: 'bold' };
      }

      return undefined;
    },
  },
];

class ExampleStyle extends React.Component {
  render() {
    return (
      <TacoTable
        columns={columns}
        data={cellLinesData}
        sortable
      />
    );
  }
}

export default ExampleStyle;
