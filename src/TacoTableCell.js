import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import { getCellData } from './utils';

const propTypes = {
  /* The column definition */
  column: React.PropTypes.object.isRequired,

  /* The column definitions */
  columns: React.PropTypes.array,

  /* The data to render in this row */
  rowData: React.PropTypes.object.isRequired,

  /* The row number in the table */
  rowNumber: React.PropTypes.number,

  /* The table data */
  tableData: React.PropTypes.array,
};

const defaultProps = {

};

/**
 * Renders a cell's contents based on the renderer function. If no
 * renderer is provided, it just returns the raw cell data. In such
 * cases, the user should take care that cellData can be rendered
 * directly.
 *
 * @param {Any} cellData The data for the cell
 * @param {Object} column The column definition
 * @param {Object} rowData The data for the row
 * @param {Number} rowNumber The number of the row
 * @param {Array} tableData The array of data for the whole table
 * @param {Array} columns The column definitions for the whole table
 * @return {Renderable} The contents of the cell
 */
function renderCell(cellData, column, rowData, rowNumber, tableData, columns) {
  const { renderer } = column;

  // if renderer is provided, call it
  if (renderer != null) {
    return renderer(cellData, column, rowData, rowNumber, tableData, columns);
  }

  // otherwise, render the raw cell data
  return cellData;
}


class TacoTableCell extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { column, rowData, rowNumber, tableData, columns } = this.props;
    const { className, tdClassName } = column;

    const cellData = getCellData(column, rowData, rowNumber, tableData, columns);
    const rendered = renderCell(cellData, column, rowData, rowNumber, tableData, columns);
    return (
      <td className={classNames(className, tdClassName)}>
        {rendered}
      </td>
    );
  }
}

TacoTableCell.propTypes = propTypes;
TacoTableCell.defaultProps = defaultProps;

export default TacoTableCell;
