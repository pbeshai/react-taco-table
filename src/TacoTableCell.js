import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import { getCellData, renderCell } from './utils';

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




/** TODO: Add your class def here */
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
