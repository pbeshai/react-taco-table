import React from 'react';
import { TacoTable, DataType, Formatters } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';

/**
 * An example demonstrating various formatters
 */

const columns = [
  {
    id: 'decFormat1',
    type: DataType.Number,
    value: rowData => rowData.percent,
    header: 'decFormat(1)',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'decFormat2',
    type: DataType.Number,
    value: rowData => rowData.percent,
    header: 'decFormat(2)',
    renderer: Formatters.decFormat(2),
  },
  {
    id: 'decPercent1',
    type: DataType.Number,
    value: rowData => rowData.percent,
    header: 'decPercentFormat(1)',
    renderer: Formatters.decPercentFormat(1),
  },
  {
    id: 'percent1',
    type: DataType.Number,
    value: rowData => rowData.percent,
    header: 'percentFormat(1)',
    renderer: Formatters.percentFormat(1),
  },
  {
    id: 'plusMinus1',
    type: DataType.Number,
    value: rowData => rowData.value,
    header: 'plusMinusFormat(1)',
    renderer: Formatters.plusMinusFormat(1),
  },
  {
    id: 'seFormat1',
    type: DataType.Number,
    value: rowData => rowData.value,
    header: 'seFormat(1)',
    renderer: Formatters.seFormat(1),
  },
  {
    id: 'moneyFormat',
    type: DataType.Number,
    value: rowData => rowData.rating * 1000,
    header: 'moneyFormat',
    renderer: Formatters.moneyFormat,
  },
  {
    id: 'leadingZeroFormat',
    type: DataType.Number,
    value: rowData => rowData.level,
    header: 'leadingZeroFormat(2)',
    renderer: Formatters.leadingZeroFormat(2),
  },
];


class ExampleFormatters extends React.Component {
  render() {
    return (
      <TacoTable
        columns={columns}
        data={cellLinesData}
        rowHighlighting={false}
      />
    );
  }
}

export default ExampleFormatters;
