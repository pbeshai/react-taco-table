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

import * as Utils from './Utils';

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
export function minMaxClassName(cellData, columnSummary, column, rowData) {
  const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
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
export function minClassName(cellData, columnSummary, column, rowData) {
  const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
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
export function maxClassName(cellData, columnSummary, column, rowData) {
  const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
  if (sortValue === columnSummary.max) {
    return 'highlight-max';
  }

  return undefined;
}

