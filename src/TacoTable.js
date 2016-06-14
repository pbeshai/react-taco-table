import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import TacoTableHeader from './TacoTableHeader';
import TacoTableRow from './TacoTableRow';
import SortDirection from './SortDirection';
import { sortData, getColumnById } from './utils';

const propTypes = {
  /* The column definitions */
  columns: React.PropTypes.array.isRequired,

  /* The class names to apply to the table */
  className: React.PropTypes.string,

  /* The class name to apply to the table container */
  containerClassName: React.PropTypes.string,

  /* The data to be rendered as rows */
  data: React.PropTypes.array,

  /* Column ID of the data to sort by initially */
  initialSortColumnId: React.PropTypes.string,

  /* Direction by which to sort initially */
  initialSortDirection: React.PropTypes.bool,

  /* Whether the table can be sorted or not */
  sortable: React.PropTypes.bool,

  /* Whether the table is striped */
  striped: React.PropTypes.bool,

  /* Whether the table takes up full width or not */
  fullWidth: React.PropTypes.bool,

  /* allow configuration of which components to use for headers and rows */
  HeaderComponent: React.PropTypes.func,
  RowComponent: React.PropTypes.func,
};

const defaultProps = {
  initialSortDirection: SortDirection.Ascending,
  striped: false,
  sortable: true,
  fullWidth: true,
  HeaderComponent: TacoTableHeader,
  RowComponent: TacoTableRow,
};

/** TODO: add your class def here. */
class TacoTable extends React.Component {
  constructor(props) {
    super(props);

    // store the data in the state to have a unified interface for sortable and
    // non-sortable tables. Take a slice to ensure we do not modify the original
    this.state = {
      data: props.data.slice(),
    };

    // if sortable, do the initial sort
    if (props.sortable) {
      const sortColumn = getColumnById(props.columns, props.initialSortColumnId);
      const sortColumnId = props.initialSortColumnId;

      if (sortColumn) {
        // get the sort direction by interpreting initialSortDir then firstSortDir then default Asc
        let sortDirection;
        if (props.initialSortDirection == null) {
          if (sortColumn.firstSortDirection == null) {
            sortDirection = SortDirection.Ascending;
          } else {
            sortDirection = sortColumn.firstSortDirection;
          }
        } else {
          sortDirection = props.initialSortDirection;
        }

        Object.assign(this.state, {
          sortColumnId,
          sortDirection,
          data: sortData(this.state.data, props.initialSortColumnId,
            props.initialSortDirection, props.columns),
        });
      }
    }

    // bind handlers
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.sort = this.sort.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Callback when a header is clicked. If a sortable table, sorts the table.
   *
   * @param {Object} column The column that was clicked.
   */
  handleHeaderClick(columnId) {
    const { sortable } = this.props;

    if (sortable) {
      const sortResults = this.sort(columnId);
      if (sortResults) {
        this.setState(sortResults);
      }
    }
  }

  /**
   * Sort the table based on a column
   *
   * @param {String} columnId the ID of the column to sort by
   */
  sort(columnId) {
    const { columns } = this.props;
    const { sortColumnId, data } = this.state;
    let { sortDirection } = this.state;
    const column = getColumnById(columns, columnId);

    if (!column) {
      return undefined;
    }

    // if there was no sort direction before or the column ID changed, use the firstSort
    if (sortDirection == null || columnId !== sortColumnId) {
      sortDirection = column.firstSortDirection;

    // if it is the same column, invert direction
    } else if (columnId === sortColumnId) {
      sortDirection = !sortDirection;

    // otherwise just default to ascending
    } else {
      sortDirection = SortDirection.Ascending;
    }

    const newState = {
      sortDirection: sortDirection == null ? SortDirection.Ascending : sortDirection,
      sortColumnId: columnId,
    };

    newState.data = sortData(data, newState.sortColumnId, newState.sortDirection, columns);
    return newState;
  }

  /**
   * Renders the headers of the table in a thead
   *
   * @return {React.Component} <thead>
   */
  renderHeaders() {
    const { columns, HeaderComponent, sortable } = this.props;

    return (
      <thead>
        <tr>
          {columns.map((column, i) =>
            <HeaderComponent
              key={i}
              column={column}
              sortableTable={sortable}
              onClick={this.handleHeaderClick}
            />
          )}
        </tr>
      </thead>
    );
  }

  /**
   * Renders the rows of the table in a tbody
   *
   * @return {React.Component} <tbody>
   */
  renderRows() {
    const { columns, RowComponent } = this.props;
    const { data } = this.state;

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
    const { columns, className, containerClassName, fullWidth, striped, sortable } = this.props;
    const { data } = this.state;
    // console.log('Table render.');
    // console.table(columns);
    // console.log('Data = ', data);

    return (
      <div className={classNames('taco-table-container', containerClassName)}>
        <table
          className={classNames('taco-table', className, {
            'table-full-width': fullWidth,
            'table-not-full-width': !fullWidth,
            'table-striped': striped,
            'table-sortable': sortable,
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
