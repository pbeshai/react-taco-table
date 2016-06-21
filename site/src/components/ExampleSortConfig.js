import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';

/**
 * An example demonstrating sort configurations
 */

const columns = [
  {
    id: 'name',
    type: DataType.String,
    value: rowData => rowData.cellLine.label,
    header: 'String',
  },
  {
    id: 'value',
    type: DataType.Number,
    header: 'First sort descending',
    renderer: Formatters.decFormat(1),
    firstSortDirection: SortDirection.Descending,
  },
  {
    id: 'level-str',
    type: DataType.String,
    value: rowData => rowData.level,
    header: 'Number as string',
    firstSortDirection: SortDirection.Descending,
  },
  {
    id: 'level-num',
    type: DataType.Number,
    value: rowData => rowData.level,
    header: 'Number as number',
    firstSortDirection: SortDirection.Descending,
  },
  {
    id: 'name-length',
    type: DataType.String,
    sortType: DataType.Number,
    value: rowData => rowData.cellLine.label,
    sortValue: cellData => cellData.length,
    header: 'String as number',
  },
];


class ExampleFormatters extends React.Component {
  render() {
    return (
      <TacoTable
        columns={columns}
        data={cellLinesData}
        initialSortDirection={SortDirection.Ascending}
        initialSortColumnId={'name'}
      />
    );
  }
}

export default ExampleFormatters;
