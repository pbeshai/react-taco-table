import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters, Summarizers } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';

/**
 * An example demonstrating how to use bottomData
 */

const columns = [
  {
    id: 'name',
    value: rowData => rowData.cellLine,
    header: 'Cell Line',
    renderer: cellData => <b>{cellData.label}</b>,
    sortValue: cellData => cellData.label,
    type: DataType.String,
    width: 250,
    bottomDataRender: 'Summary',
  },
  {
    id: 'receptorStatus',
    header: 'Receptor Status',
    renderer: cellData => cellData.label,
    sortValue: cellData => cellData.label,
    type: DataType.String,
  },
  {
    id: 'MLL3',
    type: DataType.String,
  },
  {
    id: 'value',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(1),
    firstSortDirection: SortDirection.Ascending,
    summarize: Summarizers.meanSummarizer,
    bottomDataRender: (columnSummary, column, rowData, tableData, columns) => {
      return column.renderer(columnSummary.mean);
    },
  },
  {
    id: 'rating',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(2),
    summarize: Summarizers.meanSummarizer,
    bottomDataRender: (columnSummary, column, rowData, tableData, columns) => {
      return column.renderer(columnSummary.sum);
    },
  },
  {
    id: 'level',
    debug: true,
    type: DataType.NumberOrdinal,
    summarize: Summarizers.weightedAverageSummarizer('rating'),
    bottomDataRender: (columnSummary, column, rowData, tableData, columns) => {
      return Formatters.decFormat(1, columnSummary.weightedAverage);
    },
  },
];


class ExampleRowClassName extends React.Component {
  render() {
    return (
      <TacoTable
        className="example-row-class-name"
        columns={columns}
        data={cellLinesData}
        bottomData
        striped
        sortable
      />
    );
  }
}

export default ExampleRowClassName;
