import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import TacoTableHeader from './TacoTableHeader';
import TacoTableRow from './TacoTableRow';

const propTypes = {
  /* The column definitions */
  columns: React.PropTypes.array.isRequired,

  /* The class names to apply to the table */
  className: React.PropTypes.string,

  /* The class name to apply to the table container */
  containerClassName: React.PropTypes.string,

  /* The data to be rendered as rows */
  data: React.PropTypes.array,

  /* Whether the table is striped */
  striped: React.PropTypes.bool,

  /* Whether the table takes up full width or not */
  fullWidth: React.PropTypes.bool,

  /* allow configuration of which components to use for headers and rows */
  HeaderComponent: React.PropTypes.func,
  RowComponent: React.PropTypes.func,
};

const defaultProps = {
  HeaderComponent: TacoTableHeader,
  RowComponent: TacoTableRow,
  striped: false,
  fullWidth: true,
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
    const { className, containerClassName, fullWidth, striped } = this.props;

    console.log('Table render.');
    console.table(this.props.columns);
    console.log('Data = ', this.props.data);

    return (
      <div className={classNames('taco-table-container', containerClassName)}>
        <table
          className={classNames('taco-table', className, {
            'table-full-width': fullWidth,
            'table-not-full-width': !fullWidth,
            'table-striped': striped,
          })}
        >
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
