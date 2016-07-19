'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minMaxClassName = minMaxClassName;
exports.minClassName = minClassName;
exports.maxClassName = maxClassName;

var _Utils = require('./Utils');

var Utils = _interopRequireWildcard(_Utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Adds `highlight-min-max` and one of `highlight-min`, `highlight-max` to the
 * cells that match min and max in the summary
 *
 * @param {Any} cellData the data for the cell
 * @param {Object} columnSummary The column summary
 * @param {Object} column The column definition
 * @param {Array} rowData the data for the row
 *
 * @return {String} classnames
 */
function minMaxClassName(cellData, columnSummary, column, rowData) {
  var sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
  if (sortValue === columnSummary.min) {
    return 'highlight-min-max highlight-min';
  } else if (sortValue === columnSummary.max) {
    return 'highlight-min-max highlight-max';
  }

  return undefined;
}

/**
 * Adds `highlight-min` to the cells that match min in the summary.
 *
 * @param {Any} cellData the data for the cell
 * @param {Object} columnSummary The column summary
 * @param {Object} column The column definition
 * @param {Array} rowData the data for the row
 *
 * @return {String} classnames
 */
/**
 * TdClassNames is a collection of utility functions that can be used
 * in column definitions as the `tdClassName` attribute.
 *
 * These functions typically combine cell data and summary information
 * to produce a meaningful class name.
 *
 * They can take the following arguments:
 *  - `cellData` {Object} The data for the cell
 *  - `columnSummary` {Object} The summary for the column
 *  - `column` {Object} The definition for the column
 *  - `rowData` {Object} The data for the row
 *  - `highlightedColumn` {Boolean} true if this column is highlighted
 *  - `highlightedRow` {Boolean} true if this row is highlighted
 *  - `rowNumber` {Number} The row number
 *  - `tableData` {Array} the data for the whole table
 *  - `columns` {Array} the definitions for all columns
 *
 * @module TdClassNames
 */

function minClassName(cellData, columnSummary, column, rowData) {
  var sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
  if (sortValue === columnSummary.min) {
    return 'highlight-min';
  }

  return undefined;
}

/**
 * Adds `highlight-max` to the cells that match max in the summary.
 *
 * @param {Any} cellData the data for the cell
 * @param {Object} columnSummary The column summary
 * @param {Object} column The column definition
 * @param {Array} rowData the data for the row
 *
 * @return {String} classnames
 */
function maxClassName(cellData, columnSummary, column, rowData) {
  var sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
  if (sortValue === columnSummary.max) {
    return 'highlight-max';
  }

  return undefined;
}
