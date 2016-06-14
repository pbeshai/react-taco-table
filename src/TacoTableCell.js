import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';

const propTypes = {
  /* The column definition */
  column: React.PropTypes.object.isRequired,

  /* The column definitions */
  columns: React.PropTypes.array,

  /* The data to render in this row */
  rowData: React.PropTypes.object.isRequired,

  /* The table data */
  tableData: React.PropTypes.array,
};

const defaultProps = {

};

function getCellData(column, rowData) {
  return column.value(rowData);
}

class TacoTableCell extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { column, rowData } = this.props;
    const { className, tdClassName, renderer } = column;

    const cellData = getCellData(column, rowData);

    return (
      <td className={classNames(className, tdClassName)}>
        {renderer(cellData)}
      </td>
    );
  }
}

TacoTableCell.propTypes = propTypes;
TacoTableCell.defaultProps = defaultProps;

export default TacoTableCell;
