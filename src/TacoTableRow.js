import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import TacoTableCell from './TacoTableCell';
const propTypes = {
  /* The column definitions */
  columns: React.PropTypes.array.isRequired,

  /* The data to render in this row */
  rowData: React.PropTypes.object.isRequired,

  /* The row number in the table */
  rowNumber: React.PropTypes.number,

  /* The table data */
  tableData: React.PropTypes.array,

  /* Allow configuration of what component to use to render cells */
  CellComponent: React.PropTypes.func,
};

const defaultProps = {
  CellComponent: TacoTableCell,
};

class TacoTableRow extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { columns, rowData, rowNumber, tableData, CellComponent } = this.props;
    return (
      <tr>
        {columns.map((column, i) =>
          <CellComponent
            key={i}
            column={column}
            columns={columns}
            rowNumber={rowNumber}
            rowData={rowData}
            tableData={tableData}
          />
        )}
      </tr>
    );
  }
}

TacoTableRow.propTypes = propTypes;
TacoTableRow.defaultProps = defaultProps;

export default TacoTableRow;
