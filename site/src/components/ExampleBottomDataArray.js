import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';

/**
 * An example demonstrating how to use bottomData with a precomputed
 * object for each bottom data row
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
    bottomDataRender: ({ column, rowData }) => column.renderer(rowData[column.id]),
  },
  {
    id: 'rating',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(2),
    bottomDataRender: ({ column, rowData }) => column.renderer(rowData[column.id]),
  },
  {
    id: 'level',
    debug: true,
    type: DataType.NumberOrdinal,
    bottomDataRender: ({ column, rowData }) => rowData[column.id],
  },
];

const bottomData = [
  { name: 'First', value: 82.321, level: 94 },
  { name: 'Second', value: 1.52, rating: 137, level: 12 },
];

class ExampleRowClassName extends React.Component {
  render() {
    return (
      <TacoTable
        className="example-row-class-name"
        columns={columns}
        data={cellLinesData}
        bottomData={bottomData}
        striped
        sortable
      />
    );
  }
}

export default ExampleRowClassName;
