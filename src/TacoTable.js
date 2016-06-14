import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import TacoTableHeader from './TacoTableHeader';
import TacoTableRow from './TacoTableRow';

const propTypes = {
  /* The column definitions */
  columns: React.PropTypes.array.isRequired,

  /* The data to be rendered as rows */
  data: React.PropTypes.array,
};

const defaultProps = {

};

class TacoTable extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  renderHeaders() {
    const { columns } = this.props;
    console.log(columns);
    return (
      <thead>
        <tr>
          {columns.map((column, i) => <TacoTableHeader key={i} column={column} />)}
        </tr>
      </thead>
    );
  }

  renderRows() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((rowData, i) =>
          <TacoTableRow key={i} rowData={rowData} columns={columns} tableData={data} />
        )}
      </tbody>
    );
  }

  render() {
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
