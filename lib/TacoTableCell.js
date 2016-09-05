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

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  column: _react2.default.PropTypes.object.isRequired,
  columnGroup: _react2.default.PropTypes.object,
  columnSummary: _react2.default.PropTypes.object,
  columns: _react2.default.PropTypes.array,
  highlightedColumn: _react2.default.PropTypes.bool,
  highlightedRow: _react2.default.PropTypes.bool,
  isBottomData: _react2.default.PropTypes.bool,
  onHighlight: _react2.default.PropTypes.func,
  plugins: _react2.default.PropTypes.array,
  rowData: _react2.default.PropTypes.object.isRequired,
  rowNumber: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
  tableData: _react2.default.PropTypes.array
};

var defaultProps = {};

/**
 * React component for rendering table cells, uses `<td>`.
 *
 * @prop {Object} column            The column definition
 * @prop {Object} columnGroup       Column group definition
 *   `{ header:String, columns:[colId1, colId2, ...], className:String} `
 * @prop {Object} columnSummary     summary information for the column
 * @prop {Object[]} columns            The column definitions
 * @prop {Boolean} highlightedColumn   Whether this column is highlighted or not
 * @prop {Boolean} highlightedRow      Whether this row is highlighted or not
 * @prop {Boolean} isBottomData      Whether this row is in the bottom data area or not
 * @prop {Function} onHighlight         callback for when a column is highlighted / unhighlighted
 * @prop {Object[]} plugins            Collection of plugins to run to compute cell style,
 *   cell class name, column summaries
 * @prop {Object} rowData           The data to render in this row
 * @prop {Number} rowNumber  The row number in the table (bottom-${i} for bottom data)
 * @prop {Object[]} tableData          The table data
 * @extends React.Component
 */

var TacoTableCell = function (_React$Component) {
  _inherits(TacoTableCell, _React$Component);

  /**
   * @param {Object} props React props
   */
  function TacoTableCell(props) {
    _classCallCheck(this, TacoTableCell);

    var _this = _possibleConstructorReturn(this, (TacoTableCell.__proto__ || Object.getPrototypeOf(TacoTableCell)).call(this, props));

    _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
    return _this;
  }

  /**
   * Uses `shallowCompare`
   * @param {Object} nextProps The next props
   * @param {Object} nextState The next state
   * @return {Boolean}
   */


  _createClass(TacoTableCell, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
    }

    /**
     * Handler for when the mouse enters the `<td>`. Calls `onHighlight(column.id)`.
     * @private
     */

  }, {
    key: 'handleMouseEnter',
    value: function handleMouseEnter() {
      var _props = this.props;
      var onHighlight = _props.onHighlight;
      var column = _props.column;

      onHighlight(column.id);
    }

    /**
     * Handler for when the mouse leaves the `<td>`. Calls `onHighlight(null)`.
     * @private
     */

  }, {
    key: 'handleMouseLeave',
    value: function handleMouseLeave() {
      var onHighlight = this.props.onHighlight;

      onHighlight(null);
    }

    /**
     * Computes the value of a property such as tdClassName or tdStyle
     * by also considering plugins
     * @private
     */

  }, {
    key: 'computeWithPlugins',
    value: function computeWithPlugins(property, cellData) {
      var _this2 = this;

      var _props2 = this.props;
      var column = _props2.column;
      var plugins = _props2.plugins;


      var result = void 0;

      /** evaluates `maybeFunction` as a function if it is one, otherwise returns it as a value */
      var getValue = function getValue(maybeFunction) {
        if (typeof maybeFunction === 'function') {
          return maybeFunction(cellData, _this2.props);
        }

        return maybeFunction;
      };

      // interpret plugins
      // run the td class name from each plugin
      if (plugins) {
        plugins.forEach(function (plugin) {
          // if the plugin has property and this column matches the column test (if provided)
          if (plugin[property] && (!plugin.columnTest || plugin.columnTest(column))) {
            var pluginResult = getValue(plugin[property]);

            if (pluginResult) {
              if (!result) {
                result = [pluginResult];
              } else {
                result.push(pluginResult);
              }
            }
          }
        });
      }

      // compute the column result
      var columnResult = getValue(column[property]);

      // combine column result and plugin results
      if (!result) {
        result = columnResult;
      } else if (columnResult) {
        result.push(columnResult);
      }

      return result;
    }

    /**
     * Computes the tdClassName value based on the prop and plugins.
     * @private
     */

  }, {
    key: 'computeTdClassName',
    value: function computeTdClassName(cellData) {
      return this.computeWithPlugins('tdClassName', cellData);
    }

    /**
     * Computes the tdStyle value based on the prop and plugins.
     * @private
     */

  }, {
    key: 'computeTdStyle',
    value: function computeTdStyle(cellData) {
      var tdStyle = this.computeWithPlugins('tdStyle', cellData);
      // combine the array into a single object if it is an array
      if (Array.isArray(tdStyle)) {
        return tdStyle.reduce(function (merged, style) {
          Object.assign(merged, style);
          return merged;
        }, {});
      }

      return tdStyle;
    }

    /**
     * Main render method
     * @return {React.Component}
     */

  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var column = _props3.column;
      var rowData = _props3.rowData;
      var rowNumber = _props3.rowNumber;
      var tableData = _props3.tableData;
      var columns = _props3.columns;
      var onHighlight = _props3.onHighlight;
      var highlightedColumn = _props3.highlightedColumn;
      var columnGroup = _props3.columnGroup;
      var isBottomData = _props3.isBottomData;
      var className = column.className;
      var type = column.type;


      var cellData = (0, _Utils.getCellData)(column, rowData, rowNumber, tableData, columns, isBottomData);

      var rendered = (0, _Utils.renderCell)(cellData, column, rowData, rowNumber, tableData, columns, isBottomData);

      // attach mouse listeners for highlighting
      var onMouseEnter = void 0;
      var onMouseLeave = void 0;
      if (onHighlight) {
        onMouseEnter = this.handleMouseEnter;
        onMouseLeave = this.handleMouseLeave;
      }

      // compute class name and style
      var computedTdClassName = this.computeTdClassName(cellData);
      var computedTdStyle = this.computeTdStyle(cellData);

      // get classes based on column group
      var columnGroupClass = void 0;
      if (columnGroup) {
        columnGroupClass = [columnGroup.className];
        var columnGroupIndex = columnGroup.columns.indexOf(column.id);

        // first column in group
        if (columnGroupIndex === 0) {
          columnGroupClass.push('group-first');
        }

        // last column in group
        if (columnGroupIndex === columnGroup.columns.length - 1) {
          columnGroupClass.push('group-last');
        }
      }

      return _react2.default.createElement(
        'td',
        {
          className: (0, _classnames2.default)(className, columnGroupClass, computedTdClassName, 'data-type-' + type, { 'column-highlight': highlightedColumn }),
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave,
          style: computedTdStyle
        },
        rendered
      );
    }
  }]);

  return TacoTableCell;
}(_react2.default.Component);

TacoTableCell.propTypes = propTypes;
TacoTableCell.defaultProps = defaultProps;

exports.default = TacoTableCell;
