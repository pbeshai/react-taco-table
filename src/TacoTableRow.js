import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import TacoTableCell from './TacoTableCell';
const propTypes = {
  /* The column definitions */
  columns: React.PropTypes.array.isRequired,

  /* The data to render in this row */
  rowData: React.PropTypes.object.isRequired,

  /* The table data */
  tableData: React.PropTypes.array,
};

const defaultProps = {

};

class TacoTableRow extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { columns, rowData, tableData } = this.props;
    return (
      <tr>
        {columns.map((column, i) =>
          <TacoTableCell key={i} column={column} rowData={rowData} tableData={tableData} />
        )}
      </tr>
    );
  }
}

TacoTableRow.propTypes = propTypes;
TacoTableRow.defaultProps = defaultProps;

export default TacoTableRow;
