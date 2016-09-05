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

var _DataType = require('./DataType');

var _DataType2 = _interopRequireDefault(_DataType);

var _SortDirection = require('./SortDirection');

var _SortDirection2 = _interopRequireDefault(_SortDirection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  column: _react2.default.PropTypes.object.isRequired,
  columnGroup: _react2.default.PropTypes.object,
  highlightedColumn: _react2.default.PropTypes.bool,
  onClick: _react2.default.PropTypes.func,
  sortableTable: _react2.default.PropTypes.bool,
  sortDirection: _react2.default.PropTypes.bool
};

var defaultProps = {};

/**
 * React component for rendering table headers, uses `<th>`.
 *
 * @prop {Object} column          The column definition
 * @prop {Object} columnGroup     Column group definition:
 *   `{ header:String, columns:[colId1, colId2, ...], className:String}`
 * @prop {Boolean} highlightedColumn  Whether this column is highlighted or not
 * @prop {Function} onClick       Callback when clicked. Gets passed `column.id`
 * @prop {Boolean} sortableTable  Whether the table is sortable or not
 * @prop {Boolean} sortDirection  The current sort direction of this column --
 *   null or undefined if not sorted
 * @extends React.Component
 */

var TacoTableHeader = function (_React$Component) {
  _inherits(TacoTableHeader, _React$Component);

  /**
   * @param {Object} props React props
   */
  function TacoTableHeader(props) {
    _classCallCheck(this, TacoTableHeader);

    var _this = _possibleConstructorReturn(this, (TacoTableHeader.__proto__ || Object.getPrototypeOf(TacoTableHeader)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  /**
   * Uses `shallowCompare`
   * @param {Object} nextProps The next props
   * @param {Object} nextState The next state
   * @return {Boolean}
   */


  _createClass(TacoTableHeader, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
    }

    /**
     * Handler for when the header is clicked. Calls `onClick(column.id)`.
     * @private
     */

  }, {
    key: 'handleClick',
    value: function handleClick() {
      var _props = this.props;
      var column = _props.column;
      var onClick = _props.onClick;

      if (onClick) {
        onClick(column.id);
      }
    }

    /**
     * Main render method
     * @return {React.Component}
     */

  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var column = _props2.column;
      var sortableTable = _props2.sortableTable;
      var highlightedColumn = _props2.highlightedColumn;
      var columnGroup = _props2.columnGroup;
      var sortDirection = _props2.sortDirection;
      var className = column.className;
      var thClassName = column.thClassName;
      var header = column.header;
      var id = column.id;
      var width = column.width;
      var type = column.type;


      var contents = header == null ? id : header;

      // this is a sortable column if it is in a sortable table and it has a datatype and
      // sortValue isn't explicitly set to null (undefined is ok).
      var sortable = sortableTable && column.type !== _DataType2.default.None && column.sortValue !== null;

      var onClick = void 0;
      var sortIndicator = void 0;
      if (sortable) {
        onClick = this.handleClick;
        sortIndicator = _react2.default.createElement('span', {
          className: (0, _classnames2.default)('sort-indicator', {
            'sort-ascending': sortDirection === _SortDirection2.default.Ascending,
            'sort-descending': sortDirection === _SortDirection2.default.Descending
          })
        });
      }

      // add in a fixed width if specified
      var style = void 0;
      if (width != null) {
        style = { width: width };
      }

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
        'th',
        {
          className: (0, _classnames2.default)(className, thClassName, columnGroupClass, 'data-type-' + type, {
            sortable: sortable,
            'column-highlight': highlightedColumn,
            'sort-ascending': sortDirection === _SortDirection2.default.Ascending,
            'sort-descending': sortDirection === _SortDirection2.default.Descending,
            sorted: sortDirection != null
          }),
          onClick: onClick,
          style: style
        },
        contents,
        sortIndicator
      );
    }
  }]);

  return TacoTableHeader;
}(_react2.default.Component);

TacoTableHeader.propTypes = propTypes;
TacoTableHeader.defaultProps = defaultProps;

exports.default = TacoTableHeader;
