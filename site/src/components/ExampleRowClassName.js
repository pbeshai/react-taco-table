import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';

import './ExampleRowClassName.scss';

/**
 * An example demonstrating how to use rowClassName
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

function rowClassName(rowData, rowNumber) {
  if (rowData.MLL3 === 'MUT') {
    return 'special-row';
  }

  return undefined;
}


class ExampleRowClassName extends React.Component {
  render() {
    return (
      <div>
        <TacoTable
          className='example-row-class-name'
          columns={columns}
          data={cellLinesData}
          rowClassName={rowClassName}
          striped
          sortable
        />
      </div>
    );
  }
}

export default ExampleRowClassName;
