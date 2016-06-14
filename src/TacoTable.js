import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import TacoTableHeader from './TacoTableHeader';
import TacoTableRow from './TacoTableRow';

const propTypes = {
  /* The column definitions */
  columns: React.PropTypes.array.isRequired,

  /* The data to be rendered as rows */
  data: React.PropTypes.array,

  /* allow configuration of which components to use for headers and rows */
  HeaderComponent: React.PropTypes.func,
  RowComponent: React.PropTypes.func,
};

const defaultProps = {
  HeaderComponent: TacoTableHeader,
  RowComponent: TacoTableRow,
};

class TacoTable extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  renderHeaders() {
    const { columns, HeaderComponent } = this.props;

    return (
      <thead>
        <tr>
          {columns.map((column, i) => <HeaderComponent key={i} column={column} />)}
        </tr>
      </thead>
    );
  }

  renderRows() {
    const { data, columns, RowComponent } = this.props;

    return (
      <tbody>
        {data.map((rowData, i) =>
          <RowComponent
            key={i}
            rowNumber={i}
            rowData={rowData}
            columns={columns}
            tableData={data}
          />
        )}
      </tbody>
    );
  }

  render() {
    console.log('Table render.');
    console.table(this.props.columns);
    console.log('Data = ', this.props.data);

    return (
      <div className="taco-table-container">
        <table className="taco-table">
          {this.renderHeaders()}
          {this.renderRows()}
        </table>
      </div>
    );
  }
}

TacoTable.propTypes = propTypes;
TacoTable.defaultProps = defaultProps;

export default TacoTable;
