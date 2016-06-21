import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';

import './ExampleClassName.scss';

/**
 * An example demonstrating how to use class names in columns
 * and have them vary for each cell.
 */

const columns = [
  {
    id: 'name',
    value: rowData => rowData.cellLine.label,
    header: 'Cell Line',
    type: DataType.String,
    tdClassName: 'cell-line-name',
  },
  {
    id: 'receptorStatus',
    header: 'Receptor Status',
    value: rowData => rowData.receptorStatus.label,
    type: DataType.String,
    thClassName: 'receptor-th',
    tdClassName: 'receptor-td',
  },
  {
    id: 'MLL3',
    type: DataType.String,
    tdClassName: cellData => {
      switch (cellData) {
        case 'MUT':
          return 'mutation';
        case 'WT':
          return 'wild-type';
      }

      return 'undefined-gene';
    }
  },
  {
    id: 'value',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(1),
    firstSortDirection: SortDirection.Ascending,
    className: 'value-col',
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

class ExampleClassName extends React.Component {
  render() {
    return (
      <TacoTable
        className='example-class-name'
        columns={columns}
        data={cellLinesData}
        sortable
      />
    );
  }
}

export default ExampleClassName;
