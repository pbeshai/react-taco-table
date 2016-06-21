import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';

/**
 * An example demonstrating how to use column groups without headers
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
  },
  {
    id: 'rating',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(2),
  },
  {
    id: 'level',
    type: DataType.NumberOrdinal,
  },
];

const columnGroups = [
  { columns: ['name', 'receptorStatus']  },
  { columns: ['value', 'rating', 'level'] },
];

class ExampleColumnGroups extends React.Component {
  render() {
    return (
      <TacoTable
        columns={columns}
        columnGroups={columnGroups}
        data={cellLinesData}
        striped
        sortable
      />
    );
  }
}

export default ExampleColumnGroups;
