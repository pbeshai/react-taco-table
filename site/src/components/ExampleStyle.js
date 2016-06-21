import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters } from 'react-taco-table';
import cellLinesData from '../data/cell_lines.json';

/**
 * An example demonstrating how to use style in columns
 * and have them vary for each cell.
 */

const columns = [
  {
    id: 'name',
    value: rowData => rowData.cellLine.label,
    header: 'Cell Line',
    type: DataType.String,
    tdStyle: { fontWeight: 'bold' },
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
    id: 'value',
    type: DataType.Number,
    renderer: Formatters.plusMinusFormat(1),
    firstSortDirection: SortDirection.Ascending,
    tdStyle: cellData => {
      const opacity = (cellData + 3) / 4.5;
      return {
        backgroundColor: `rgba(100, 0, 100, ${opacity})`,
        color: cellData > 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
      };
    },
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
