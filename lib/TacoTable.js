'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _TacoTableHeader = require('./TacoTableHeader');

var _TacoTableHeader2 = _interopRequireDefault(_TacoTableHeader);

var _TacoTableRow = require('./TacoTableRow');

var _TacoTableRow2 = _interopRequireDefault(_TacoTableRow);

var _SortDirection = require('./SortDirection');

var _SortDirection2 = _interopRequireDefault(_SortDirection);

var _Utils = require('./Utils');

var _lodash = require('lodash.curry');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  bottomData: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.bool]),
  columns: _react2.default.PropTypes.array.isRequired,
  columnGroups: _react2.default.PropTypes.array,
  columnHighlighting: _react2.default.PropTypes.bool,
  className: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.array,
  fullWidth: _react2.default.PropTypes.bool,
  initialSortColumnId: _react2.default.PropTypes.string,
  initialSortDirection: _react2.default.PropTypes.bool,
  onRowClick: _react2.default.PropTypes.func,
  onRowDoubleClick: _react2.default.PropTypes.func,
  onSort: _react2.default.PropTypes.func,
  plugins: _react2.default.PropTypes.array,
  rowClassName: _react2.default.PropTypes.func,
  rowHighlighting: _react2.default.PropTypes.bool,
  sortable: _react2.default.PropTypes.bool,
  striped: _react2.default.PropTypes.bool,
  HeaderComponent: _react2.default.PropTypes.func,
  RowComponent: _react2.default.PropTypes.func
};

var defaultProps = {
  columnHighlighting: false,
  initialSortDirection: _SortDirection2.default.Ascending,
  striped: false,
  sortable: true,
  fullWidth: true,
  rowHighlighting: true,
  HeaderComponent: _TacoTableHeader2.default,
  RowComponent: _TacoTableRow2.default
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
 * | `[bottomDataRender]` | Function or Function[] or String or String[] | `function({ columnSummary, column, rowData, tableData, columns, bottomData })`<br>A function that specifies how to render the bottom data (if enabled on the table). Use an array for multiple rows. The `rowData` is only populated if `bottomData` of the TacoTable is an array. If a string is provided, it is rendered directly. |
 * | `[className]` | String | The class name to be applied to both `<td>` and `<th>` |
 * | `[firstSortDirection]` | Boolean | The direction which this column gets sorted by on first click |
 * | `[header]` | Renderable | What is rendered in the column header. If not provided, uses the columnId. |
 * | `[renderer]` | Function | `function (cellData, { column, rowData, rowNumber, tableData, columns })`<br>The function that renders the value in the table. Can return anything React can render. |
 * | `[rendererOptions]` | Object | Object of options that can be read by the renderer |
 * | `[renderOnNull]` | Boolean | Whether the cell should render if the cellData is null (default: false) |
 * | `[simpleRenderer]` | Function | `function (cellData, { column, rowData, rowNumber, tableData, columns })`<br>The function that render the cell's value in a simpler format. Must return a String or Number. |
 * | `[sortType]` | String | The `DataType` of the column to be used strictly for sorting, if not provided, uses `type` - number, string, etc |
 * | `[sortValue]` | Function | `function (cellData, rowData)`<br>Function to use when sorting instead of `value`. |
 * | `[summarize]` | Function | `function (column, tableData, columns)`<br>Produces an object representing a summary of the column (e.g., min and max) to be used in the |
 * | `[tdClassName]` | Function or String | `function (cellData, { columnSummary, column, rowData, highlightedColumn, highlightedRow, rowNumber, tableData, columns })`<br>A function that returns a class name based on the cell data and column summary or other information. If a string is provided, it is used directly as the class name. |
 * | `[tdStyle]` | Function or Object | `function (cellData, { columnSummary, column, rowData, highlightedColumn, highlightedRow, rowNumber, tableData, columns })`<br>A function that returns the style to be applied to the cell. If an object is provided, it is used directly as the style attribute. |
 * | `[thClassName]` | String | The class name to be applied to `<th>` only |
 * | `[type]` | String | The `DataType` of the column - number, string, etc |
 * | `[value]` | Function or String | `function (rowData, { rowNumber, tableData, columns })`<br>Function to produce cellData's value. If a String, reads that as a key into the rowData object. If not provided, columnId is used as a key into the rowData object. |
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
 * @prop {Object[]|Boolean} bottomData Special rows to place at the bottom of the table,
 *    unaffected by sorting. If true, populates values based on the `bottomData` property of
 *    the column definition or the column summarizer. If an array, that data is used to render
 *    the row.
 * @prop {Object[]} columns   The column definitions
 * @prop {Object[]} columnGroups   How to group columns - an array of
 *   `{ header:String, columns:[colId1, colId2, ...], className:String}`
 * @prop {Boolean} columnHighlighting=false   Whether or not to turn on mouse listeners
 *    for column highlighting
 * @prop {String} className   The class names to apply to the table
 * @prop {Object[]} data   The data to be rendered as rows
 * @prop {Boolean} fullWidth=true   Whether the table takes up full width or not
 * @prop {String} initialSortColumnId   Column ID of the data to sort by initially
 * @prop {Boolean} initialSortDirection=true(Ascending)   Direction by which to sort initially
 * @prop {Function} onRowClick `function (rowData)`<br>Callback for when a row is clicked.
 * @prop {Function} onRowDoubleClick `function (rowData)`<br>Callback for when a row is double clicked.
 * @prop {Function} onSort `function (columnId, sortDirection, sortedData)`<br>Callback for after the data is sorted when a user clicks a header
 * @prop {Object[]} plugins   Collection of plugins to run to compute cell style,
 *    cell class name, column summaries
 * @prop {Function} rowClassName   Function that maps (rowData, rowNumber) to a class name
 * @prop {Boolean} rowHighlighting=true   Whether or not to turn on mouse
 *    listeners for row highlighting
 * @prop {Boolean} sortable=true   Whether the table can be sorted or not
 * @prop {Boolean} striped=false   Whether the table is striped
 * @prop {Function} HeaderComponent=TacoTableHeader   allow configuration of which
 *     component to use for headers
 * @prop {Function} RowComponent=TacoTableRow   allow configuration of which
 *     component to use for rows
 * @extends React.Component
 */

var TacoTable = function (_React$Component) {
  _inherits(TacoTable, _React$Component);

  /**
   * @param {Object} props React props
   */
  function TacoTable(props) {
    _classCallCheck(this, TacoTable);

    // check for column warnings
    var _this = _possibleConstructorReturn(this, (TacoTable.__proto__ || Object.getPrototypeOf(TacoTable)).call(this, props));

    if (process.env.NODE_ENV !== 'production') {
      (0, _Utils.validateColumns)(props.columns);
    }

    // store the data in the state to have a unified interface for sortable and
    // non-sortable tables. Take a slice to ensure we do not modify the original
    _this.state = {
      data: props.data && props.data.slice(),
      columnSummaries: _this.summarizeColumns(props)
    };

    // if sortable, do the initial sort
    if (props.sortable) {
      var sortColumn = (0, _Utils.getColumnById)(props.columns, props.initialSortColumnId);
      var sortColumnId = props.initialSortColumnId;

      if (sortColumn) {
        // get the sort direction by interpreting initialSortDir then firstSortDir then default Asc
        var sortDirection = void 0;
        if (props.initialSortDirection == null) {
          if (sortColumn.firstSortDirection == null) {
            sortDirection = _SortDirection2.default.Ascending;
          } else {
            sortDirection = sortColumn.firstSortDirection;
          }
        } else {
          sortDirection = props.initialSortDirection;
        }

        Object.assign(_this.state, {
          sortColumnId: sortColumnId,
          sortDirection: sortDirection,
          data: (0, _Utils.sortData)(_this.state.data, props.initialSortColumnId, props.initialSortDirection, props.columns)
        });
      }
    }

    // bind handlers
    _this.handleHeaderClick = _this.handleHeaderClick.bind(_this);
    _this.handleRowHighlight = _this.handleRowHighlight.bind(_this);
    _this.handleColumnHighlight = _this.handleColumnHighlight.bind(_this);
    _this.sort = _this.sort.bind(_this);
    return _this;
  }

  /**
   * On receiving new props, sort the data and recompute column summaries if the data
   * has changed.
   * @param {Object} nextProps The next props
   * @returns {void}
   */


  _createClass(TacoTable, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var data = this.props.data;

      // check for column warnings

      if (process.env.NODE_ENV !== 'production') {
        (0, _Utils.validateColumns)(nextProps.columns);
      }

      if (data !== nextProps.data) {
        var newState = Object.assign({}, this.state, { data: nextProps.data && nextProps.data.slice() });

        // re-sort the data
        Object.assign(newState, this.sort(newState.sortColumnId, nextProps, newState, true));

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

  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
    }

    /**
     * Callback when a header is clicked. If a sortable table, sorts the table.
     * If the onSort callback is provided, it is fired with the columnId,
     * sort direction, and new sorted data as arguments.
     *
     * @param {String} columnId The ID of the column that was clicked.
     * @returns {void}
     * @private
     */

  }, {
    key: 'handleHeaderClick',
    value: function handleHeaderClick(columnId) {
      var _props = this.props;
      var sortable = _props.sortable;
      var onSort = _props.onSort;


      if (sortable) {
        var sortResults = this.sort(columnId);
        if (sortResults) {
          this.setState(sortResults);
          if (onSort) {
            onSort(columnId, sortResults.sortDirection, sortResults.data);
          }
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

  }, {
    key: 'handleRowHighlight',
    value: function handleRowHighlight(rowData) {
      this.setState({
        highlightedRowData: rowData
      });
    }

    /**
     * Callback when a column is highlighted
     *
     * @param {String} columnId The ID of the column being highlighted
     * @returns {void}
     * @private
     */

  }, {
    key: 'handleColumnHighlight',
    value: function handleColumnHighlight(columnId) {
      this.setState({
        highlightedColumnId: columnId
      });
    }

    /**
     * Sort the table based on a column
     *
     * @param {String} columnId the ID of the column to sort by
     * @param {Object} props=this.props
     * @param {Object} state=this.state
     * @param {Boolean} keepSortDirection=false Whether to keep the same sort direction if sorting on
     *   the same column as what the data is already sorted on or not. Used primarily when receiving
     *   new data that should maintain its current sort.
     * @return {Object} Object representing sort state
     *    `{ sortDirection, sortColumnId, data }`.
     * @private
     */

  }, {
    key: 'sort',
    value: function sort(columnId) {
      var props = arguments.length <= 1 || arguments[1] === undefined ? this.props : arguments[1];
      var state = arguments.length <= 2 || arguments[2] === undefined ? this.state : arguments[2];
      var keepSortDirection = arguments[3];
      var columns = props.columns;
      var sortColumnId = state.sortColumnId;
      var data = state.data;
      var sortDirection = state.sortDirection;

      var column = (0, _Utils.getColumnById)(columns, columnId);

      if (!column) {
        return undefined;
      }

      // if there was no sort direction before or the column ID changed, use the firstSort
      if (sortDirection == null || columnId !== sortColumnId) {
        sortDirection = column.firstSortDirection;

        // if it is the same column, invert direction
      } else if (columnId === sortColumnId) {
        if (!keepSortDirection) {
          // unless we say to keep it
          sortDirection = !sortDirection;
        }
        // otherwise just default to ascending
      } else {
        sortDirection = _SortDirection2.default.Ascending;
      }

      var newState = {
        sortDirection: sortDirection == null ? _SortDirection2.default.Ascending : sortDirection,
        sortColumnId: columnId
      };

      newState.data = (0, _Utils.sortData)(data, newState.sortColumnId, newState.sortDirection, columns);
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

  }, {
    key: 'summarizeColumns',
    value: function summarizeColumns() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];
      var columns = props.columns;
      var data = props.data;
      var plugins = props.plugins;


      var summaries = columns.map(function (column) {
        var result = void 0;

        // run the summarize from each plugin
        if (plugins) {
          plugins.forEach(function (plugin) {
            // if the plugin has summarize and this column matches the column test (if provided)
            if (plugin.summarize && (!plugin.columnTest || plugin.columnTest(column))) {
              var pluginResult = plugin.summarize(column, data, columns);
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
          var columnResult = column.summarize(column, data, columns);
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

  }, {
    key: 'renderGroupHeaders',
    value: function renderGroupHeaders() {
      var _props2 = this.props;
      var columns = _props2.columns;
      var columnGroups = _props2.columnGroups;

      // only render if we have labels

      if (!columnGroups || !columnGroups.some(function (columnGroup) {
        return columnGroup.header;
      })) {
        return null;
      }

      // note we iterate over columns instead of columnGroups since not all columns
      // may be in a defined group
      return _react2.default.createElement(
        'tr',
        { className: 'group-headers' },
        columns.map(function (column, i) {
          var columnGroup = columnGroups.find(function (group) {
            return group.columns.includes(column.id);
          });

          // if not in a group, render an empty th
          if (!columnGroup) {
            return _react2.default.createElement('th', { key: i, className: 'group-header-no-group' });
          }

          // if first item in the group, render a multiple column spanning header
          if (columnGroup.columns.indexOf(column.id) === 0) {
            return _react2.default.createElement(
              'th',
              {
                key: i,
                colSpan: columnGroup.columns.length,
                className: (0, _classnames2.default)('group-header', 'group-header-' + i, columnGroup.className)
              },
              columnGroup.header
            );
          }

          // if not the first item in the group, do not render it since colSpan handles it
          return null;
        })
      );
    }

    /**
     * Renders the headers of the table in a thead
     *
     * @return {React.Component} `<thead>`
     * @private
     */

  }, {
    key: 'renderHeaders',
    value: function renderHeaders() {
      var _this2 = this;

      var _props3 = this.props;
      var columns = _props3.columns;
      var columnGroups = _props3.columnGroups;
      var HeaderComponent = _props3.HeaderComponent;
      var sortable = _props3.sortable;
      var _state = this.state;
      var highlightedColumnId = _state.highlightedColumnId;
      var sortColumnId = _state.sortColumnId;
      var sortDirection = _state.sortDirection;


      return _react2.default.createElement(
        'thead',
        null,
        this.renderGroupHeaders(),
        _react2.default.createElement(
          'tr',
          null,
          columns.map(function (column, i) {
            // find the associated column group
            var columnGroup = void 0;
            if (columnGroups) {
              columnGroup = columnGroups.find(function (group) {
                return group.columns.includes(column.id);
              });
            }

            return _react2.default.createElement(HeaderComponent, {
              key: i,
              column: column,
              columnGroup: columnGroup,
              highlightedColumn: column.id === highlightedColumnId,
              sortableTable: sortable,
              onClick: _this2.handleHeaderClick,
              sortDirection: sortColumnId === column.id ? sortDirection : undefined
            });
          })
        )
      );
    }

    /**
     * Renders the rows of the table in a tbody
     *
     * @return {React.Component} `<tbody>`
     * @private
     */

  }, {
    key: 'renderRows',
    value: function renderRows() {
      var _this3 = this;

      var _props4 = this.props;
      var columns = _props4.columns;
      var RowComponent = _props4.RowComponent;
      var rowClassName = _props4.rowClassName;
      var rowHighlighting = _props4.rowHighlighting;
      var columnHighlighting = _props4.columnHighlighting;
      var plugins = _props4.plugins;
      var columnGroups = _props4.columnGroups;
      var onRowClick = _props4.onRowClick;
      var onRowDoubleClick = _props4.onRowDoubleClick;
      var _state2 = this.state;
      var _state2$data = _state2.data;
      var data = _state2$data === undefined ? [] : _state2$data;
      var highlightedRowData = _state2.highlightedRowData;
      var highlightedColumnId = _state2.highlightedColumnId;
      var columnSummaries = _state2.columnSummaries;


      return _react2.default.createElement(
        'tbody',
        null,
        data.map(function (rowData, i) {
          // compute the class name if a row class name function is provided
          var className = void 0;
          if (rowClassName) {
            className = rowClassName(rowData, i);
          }

          return _react2.default.createElement(RowComponent, {
            key: i,
            rowNumber: i,
            rowData: rowData,
            columns: columns,
            columnGroups: columnGroups,
            columnSummaries: columnSummaries,
            tableData: data,
            plugins: plugins,
            className: className,
            highlighted: highlightedRowData === rowData,
            onClick: onRowClick,
            onDoubleClick: onRowDoubleClick,
            onHighlight: rowHighlighting ? _this3.handleRowHighlight : undefined,
            highlightedColumnId: highlightedColumnId,
            onColumnHighlight: columnHighlighting ? _this3.handleColumnHighlight : undefined
          });
        })
      );
    }

    /**
     * Renders the bottom data of the table in a separate tbody.
     * This data is configured by the `bottomData` table prop and the
     * `bottomData` field in column definitions. It is not affected by
     * sorting.
     *
     * @return {React.Component} `<tbody>`
     * @private
     */

  }, {
    key: 'renderBottomData',
    value: function renderBottomData() {
      var _this4 = this;

      var _props5 = this.props;
      var bottomData = _props5.bottomData;
      var columns = _props5.columns;
      var RowComponent = _props5.RowComponent;
      var rowClassName = _props5.rowClassName;
      var rowHighlighting = _props5.rowHighlighting;
      var columnHighlighting = _props5.columnHighlighting;
      var plugins = _props5.plugins;
      var columnGroups = _props5.columnGroups;
      var onRowClick = _props5.onRowClick;
      var onRowDoubleClick = _props5.onRowDoubleClick;
      var _state3 = this.state;
      var data = _state3.data;
      var highlightedRowData = _state3.highlightedRowData;
      var highlightedColumnId = _state3.highlightedColumnId;
      var columnSummaries = _state3.columnSummaries;

      // only render if we have it explicitly configured

      if (!bottomData) {
        return null;
      }

      var bottomDataRowComponents = void 0;
      var bottomRowData = [];

      // helper function to compute row data based on input data and the
      // column.bottomDataRender configuration
      var computeRowData = (0, _lodash2.default)(function (bottomRowIndex, computedRowData, column, columnIndex) {
        if (column.bottomDataRender) {
          var bottomDataRender = column.bottomDataRender;

          // if it is an array, access it at the right index.

          if (Array.isArray(bottomDataRender)) {
            bottomDataRender = bottomDataRender[bottomRowIndex];
          }

          // run if function, otherwise render directly
          if (typeof bottomDataRender === 'function') {
            var columnSummary = columnSummaries[columnIndex];
            computedRowData[column.id] = bottomDataRender({ columnSummary: columnSummary, column: column,
              rowData: computedRowData, data: data, columns: columns, bottomData: bottomData });
          } else {
            computedRowData[column.id] = bottomDataRender;
          }
        }
        return computedRowData;
      });

      if (Array.isArray(bottomData)) {
        // for each row
        bottomRowData = bottomData.map(function (rowData, bottomRowIndex) {
          // compute the row data based on the functions in the column data, including
          // the data that was passed in as an argument to the function
          var computedRowData = columns.reduce(computeRowData(bottomRowIndex), Object.assign({}, rowData));

          return computedRowData;
        });

        // passed in a truthy value, render based on column definition only.
      } else {
        // figure out the number of rows to render by counting the length of bottomData
        // in the column definitions
        var numBottomRows = columns.reduce(function (numBottomRows, column) {
          if (column.bottomDataRender) {
            var numRowsForColumn = 0;
            // if it isn't an array, it counts as one row, otherwise one for each entry
            if (!Array.isArray(column.bottomDataRender)) {
              numRowsForColumn = 1;
            } else {
              numRowsForColumn = column.bottomDataRender.length;
            }

            if (numRowsForColumn > numBottomRows) {
              return numRowsForColumn;
            }
          }
          return numBottomRows;
        }, 0);

        // render each row
        for (var bottomRowIndex = 0; bottomRowIndex < numBottomRows; bottomRowIndex++) {
          // compute the row data based on the functions in the column data
          var rowData = columns.reduce(computeRowData(bottomRowIndex), {});

          bottomRowData.push(rowData);
        }
      }

      if (bottomRowData.length) {
        bottomDataRowComponents = bottomRowData.map(function (rowData, bottomRowIndex) {
          // compute the class name if a row class name function is provided
          var className = void 0;
          var rowNumber = 'bottom-' + bottomRowIndex;
          if (rowClassName) {
            className = rowClassName(rowData, rowNumber);
          }

          return _react2.default.createElement(RowComponent, {
            key: bottomRowIndex,
            rowNumber: rowNumber,
            rowData: rowData,
            columns: columns,
            columnGroups: columnGroups,
            columnSummaries: columnSummaries,
            tableData: data,
            plugins: plugins,
            className: className,
            highlighted: highlightedRowData === rowData,
            onClick: onRowClick,
            onDoubleClick: onRowDoubleClick,
            onHighlight: rowHighlighting ? _this4.handleRowHighlight : undefined,
            highlightedColumnId: highlightedColumnId,
            onColumnHighlight: columnHighlighting ? _this4.handleColumnHighlight : undefined,
            isBottomData: true
          });
        });
      }

      return _react2.default.createElement(
        'tbody',
        { className: 'bottom-data' },
        bottomDataRowComponents
      );
    }

    /**
     * Main render method
     * @return {React.Component} The table component
     */

  }, {
    key: 'render',
    value: function render() {
      var _props6 = this.props;
      var className = _props6.className;
      var fullWidth = _props6.fullWidth;
      var striped = _props6.striped;
      var sortable = _props6.sortable;


      return _react2.default.createElement(
        'table',
        {
          className: (0, _classnames2.default)('taco-table', className, {
            'table-full-width': fullWidth,
            'table-not-full-width': !fullWidth,
            'table-striped': striped,
            'table-sortable': sortable
          })
        },
        this.renderHeaders(),
        this.renderRows(),
        this.renderBottomData()
      );
    }
  }]);

  return TacoTable;
}(_react2.default.Component);

TacoTable.propTypes = propTypes;
TacoTable.defaultProps = defaultProps;

exports.default = TacoTable;
