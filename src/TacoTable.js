import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import TacoTableHeader from './TacoTableHeader';
import TacoTableRow from './TacoTableRow';
import SortDirection from './SortDirection';
import { sortData, getColumnById, validateColumns } from './Utils';

import './style/taco-table.scss';

const propTypes = {
  columns: React.PropTypes.array.isRequired,
  columnGroups: React.PropTypes.array,
  columnHighlighting: React.PropTypes.bool,
  className: React.PropTypes.string,
  data: React.PropTypes.array,
  fullWidth: React.PropTypes.bool,
  initialSortColumnId: React.PropTypes.string,
  initialSortDirection: React.PropTypes.bool,
  plugins: React.PropTypes.array,
  rowClassName: React.PropTypes.func,
  rowHighlighting: React.PropTypes.bool,
  sortable: React.PropTypes.bool,
  striped: React.PropTypes.bool,
  HeaderComponent: React.PropTypes.func,
  RowComponent: React.PropTypes.func,
};

const defaultProps = {
  columnHighlighting: false,
  initialSortDirection: SortDirection.Ascending,
  striped: false,
  sortable: true,
  fullWidth: true,
  rowHighlighting: true,
  HeaderComponent: TacoTableHeader,
  RowComponent: TacoTableRow,
};

/**
 * React component for rendering a table, uses `<table className="taco-table">`
 *
 * Note that `Renderable` means anything React can render (e.g., String, Number,
 * React.Component, etc.).
 *
 * ### Column Definition
 *
 * Columns are defined by objects with the following format:
 *
 * | Name | Type     | Description   |
 * | :----| :------  | :------------ |
 * | `id` | String | The id of the column. Typically corresponds to a key in the rowData object. |
 * | `[className]` | String | The class name to be applied to both `<td>` and `<th>` |
 * | `[firstSortDirection]` | Boolean | The direction which this column gets sorted by on first click |
 * | `[header]` | Renderable | What is rendered in the column header. If not provided, uses the columnId. |
 * | `[renderer]` | Function | `function (cellData, column, rowData, rowNumber, tableData, columns)`<br>The function that renders the value in the table. Can return anything React can render. |
 * | `[rendererOptions]` | Object | Object of options that can be read by the renderer |
 * | `[simpleRenderer]` | Function | `function (cellData, column, rowData, rowNumber, tableData, columns)`<br>The function that render the cell's value in a simpler format. Must return a String or Number. |
 * | `[sortType]` | String | The `DataType` of the column to be used strictly for sorting, if not provided, uses `type` - number, string, etc |
 * | `[sortValue]` | Function | `function (cellData, rowData)`<br>Function to use when sorting instead of `value`. |
 * | `[summarize]` | Function | `function (column, tableData, columns)`<br>Produces an object representing a summary of the column (e.g., min and max) to be used in the |
 * | `[tdClassName]` | Function or String | `function (cellData, columnSummary, column, rowData, highlightedColumn, highlightedRow, rowNumber, tableData, columns)`<br>A function that returns a class name based on the cell data and column summary or other information. If a string is provided, it is used directly as the class name. |
 * | `[tdStyle]` | Function or Object | `function (cellData, columnSummary, column, rowData, highlightedColumn, highlightedRow, rowNumber, tableData, columns)`<br>A function that returns the style to be applied to the cell. If an object is provided, it is used directly as the style attribute. |
 * | `[thClassName]` | String | The class name to be applied to `<th>` only |
 * | `[type]` | String | The `DataType` of the column - number, string, etc |
 * | `[value]` | Function or String | `function (rowData, rowNumber, tableData, columns)`<br>Function to produce cellData's value. If a String, reads that as a key into the rowData object. If not provided, columnId is used as a key into the rowData object. |
 * | `[width]` | Number or String | The value to set for the style `width` property on the column. |
 *
 *
 * ### Column Groups
 *
 * Column groups are defined by objects with the following format:
 *
 * | Name | Type     | Description   |
 * | :----| :------  | :------------ |
 * | `[className]` | String | The className to apply to cells and headers in this group |
 * | `columns` | String[] | The column IDs to render |
 * | `[header]` | Renderable | What shows up in the table header if provided |
 *
 *
 * ### Plugins
 *
 * Plugins are defined by objects with the following format:
 *
 * | Name | Type     | Description   |
 * | :----| :------  | :------------ |
 * | `[columnTest]` | Function | A function that takes a column and returns true or false if it the plugin should be run on this column. Default is true for everything. |
 * | `id` | String | The ID of the plugin |
 * | `[summarize]` | Function | A column summarizer function |
 * | `[tdStyle]` | Function or Object | The TD style function |
 * | `[tdClassName]` | Function or String | The TD class name function |
 *
 *
 * @prop {Object[]} columns   The column definitions
 * @prop {Object[]} columnGroups   How to group columns - an array of
 *   `{ header:String, columns:[colId1, colId2, ...], className:String}`
 * @prop {Boolean} columnHighlighting=false   Whether or not to turn on mouse listeners
 *    for column highlighting
 * @prop {String} className   The class names to apply to the table
 * @prop {Object[]} data   The data to be rendered as rows
 * @prop {String} initialSortColumnId   Column ID of the data to sort by initially
 * @prop {Boolean} initialSortDirection=true(Ascending)   Direction by which to sort initially
 * @prop {Object[]} plugins   Collection of plugins to run to compute cell style,
 *    cell class name, column summaries
 * @prop {Boolean} sortable=true   Whether the table can be sorted or not
 * @prop {Boolean} striped=false   Whether the table is striped
 * @prop {Boolean} fullWidth=true   Whether the table takes up full width or not
 * @prop {Function} rowClassName   Function that maps (rowData, rowNumber) to a class name
 * @prop {Boolean} rowHighlighting=true   Whether or not to turn on mouse
 *    listeners for row highlighting
 * @prop {Function} HeaderComponent=TacoTableHeader   allow configuration of which
 *     component to use for headers
 * @prop {Function} RowComponent=TacoTableRow   allow configuration of which
 *     component to use for rows
 * @extends React.Component
 */
class TacoTable extends React.Component {
  /**
   * @param {Object} props React props
   */
  constructor(props) {
    super(props);

    // check for column warnings
    if (process.env.NODE_ENV !== 'production') {
      validateColumns(props.columns);
    }

    // store the data in the state to have a unified interface for sortable and
    // non-sortable tables. Take a slice to ensure we do not modify the original
    this.state = {
      data: props.data.slice(),
      columnSummaries: this.summarizeColumns(props),
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
    this.handleRowHighlight = this.handleRowHighlight.bind(this);
    this.handleColumnHighlight = this.handleColumnHighlight.bind(this);
    this.sort = this.sort.bind(this);
  }

  /**
   * On receiving new props, sort the data and recompute column summaries if the data
   * has changed.
   * @param {Object} nextProps The next props
   * @returns {void}
   */
  componentWillReceiveProps(nextProps) {
    const { data } = this.props;

    // check for column warnings
    if (process.env.NODE_ENV !== 'production') {
      validateColumns(nextProps.columns);
    }

    if (data !== nextProps.data) {
      const newState = Object.assign({}, this.state, { data: nextProps.data.slice() });

      // re-sort the data
      Object.assign(newState, this.sort(newState.sortColumnId, nextProps, newState));

      // recompute column summaries
      newState.columnSummaries = this.summarizeColumns(nextProps);

      this.setState(newState);
    }
  }

  /**
   * Uses `shallowCompare`
   * @param {Object} nextProps The next props
   * @param {Object} nextState The next state
   * @return {Boolean} If the component should update
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Callback when a header is clicked. If a sortable table, sorts the table.
   *
   * @param {String} columnId The ID of the column that was clicked.
   * @returns {void}
   * @private
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
   * Callback when a row is highlighted
   *
   * @param {Object} rowData The row data for the row that is highlighted
   * @returns {void}
   * @private
   */
  handleRowHighlight(rowData) {
    this.setState({
      highlightedRowData: rowData,
    });
  }

  /**
   * Callback when a column is highlighted
   *
   * @param {String} columnId The ID of the column being highlighted
   * @returns {void}
   * @private
   */
  handleColumnHighlight(columnId) {
    this.setState({
      highlightedColumnId: columnId,
    });
  }

  /**
   * Sort the table based on a column
   *
   * @param {String} columnId the ID of the column to sort by
   * @param {Object} props=this.props
   * @param {Object} state=this.state
   * @return {Object} Object representing sort state
   *    `{ sortDirection, sortColumnId, data }`.
   * @private
   */
  sort(columnId, props = this.props, state = this.state) {
    const { columns } = props;
    const { sortColumnId, data } = state;
    let { sortDirection } = state;
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
   * Computes a summary for each column that is configured to have one.
   *
   * @param {Object} props React component props
   * @return {Array} array of summaries matching the indices for `columns`,
   *   null for those without a `summarize` property.
   * @private
   */
  summarizeColumns(props = this.props) {
    const { columns, data, plugins } = props;

    const summaries = columns.map(column => {
      let result;

      // run the summarize from each plugin
      if (plugins) {
        plugins.forEach(plugin => {
          // if the plugin has summarize and this column matches the column test (if provided)
          if (plugin.summarize && (!plugin.columnTest || plugin.columnTest(column))) {
            const pluginResult = plugin.summarize(column, data, columns);
            if (pluginResult) {
              if (!result) {
                result = pluginResult;
              } else {
                Object.assign(result, pluginResult);
              }
            }
          }
        });
      }

      // run the column summarize last to potentially override plugins
      if (column.summarize) {
        const columnResult = column.summarize(column, data, columns);
        if (!result) {
          result = columnResult;
        } else {
          Object.assign(result, columnResult);
        }
      }

      return result;
    });

    return summaries;
  }

  /**
   * Renders the group headers above column headers
   *
   * @return {React.Component} `<tr>`
   * @private
   */
  renderGroupHeaders() {
    const { columns, columnGroups } = this.props;

    // only render if we have labels
    if (!columnGroups || !columnGroups.some(columnGroup => columnGroup.header)) {
      return null;
    }

    // note we iterate over columns instead of columnGroups since not all columns
    // may be in a defined group
    return (
      <tr className="group-headers">
        {columns.map((column, i) => {
          const columnGroup = columnGroups.find(group =>
            group.columns.includes(column.id));

          // if not in a group, render an empty th
          if (!columnGroup) {
            return <th key={i} className="group-header-no-group" />;
          }

          // if first item in the group, render a multiple column spanning header
          if (columnGroup.columns.indexOf(column.id) === 0) {
            return (
              <th
                key={i}
                colSpan={columnGroup.columns.length}
                className={classNames('group-header', `group-header-${i}`, columnGroup.className)}
              >
                {columnGroup.header}
              </th>
            );
          }

          // if not the first item in the group, do not render it since colSpan handles it
          return null;
        })}
      </tr>
    );
  }

  /**
   * Renders the headers of the table in a thead
   *
   * @return {React.Component} `<thead>`
   * @private
   */
  renderHeaders() {
    const { columns, columnGroups, HeaderComponent, sortable } = this.props;
    const { highlightedColumnId, sortColumnId, sortDirection } = this.state;

    return (
      <thead>
        {this.renderGroupHeaders()}
        <tr>
          {columns.map((column, i) => {
            // find the associated column group
            let columnGroup;
            if (columnGroups) {
              columnGroup = columnGroups.find(group =>
                group.columns.includes(column.id));
            }

            return (
              <HeaderComponent
                key={i}
                column={column}
                columnGroup={columnGroup}
                highlightedColumn={column.id === highlightedColumnId}
                sortableTable={sortable}
                onClick={this.handleHeaderClick}
                sortDirection={sortColumnId === column.id ? sortDirection : undefined}
              />
            );
          })}
        </tr>
      </thead>
    );
  }

  /**
   * Renders the rows of the table in a tbody
   *
   * @return {React.Component} `<tbody>`
   * @private
   */
  renderRows() {
    const { columns, RowComponent, rowClassName, rowHighlighting,
      columnHighlighting, plugins, columnGroups } = this.props;
    const { data, highlightedRowData, highlightedColumnId, columnSummaries } = this.state;

    return (
      <tbody>
        {data.map((rowData, i) => {
          // compute the class name if a row class name function is provided
          let className;
          if (rowClassName) {
            className = rowClassName(rowData, i);
          }

          return (
            <RowComponent
              key={i}
              rowNumber={i}
              rowData={rowData}
              columns={columns}
              columnGroups={columnGroups}
              columnSummaries={columnSummaries}
              tableData={data}
              plugins={plugins}
              className={className}
              highlighted={highlightedRowData === rowData}
              onHighlight={rowHighlighting ? this.handleRowHighlight : undefined}
              highlightedColumnId={highlightedColumnId}
              onColumnHighlight={columnHighlighting ? this.handleColumnHighlight : undefined}
            />
          );
        })}
      </tbody>
    );
  }

  /**
   * Main render method
   * @return {React.Component} The table component
   */
  render() {
    const { className, fullWidth, striped, sortable } = this.props;

    return (
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
    );
  }
}

TacoTable.propTypes = propTypes;
TacoTable.defaultProps = defaultProps;

export default TacoTable;
