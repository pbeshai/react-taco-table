/** @module TdClassNames */

import * as Utils from './Utils';

/**
 * Adds highlight-min-max and one of highlight-min, highlight-max to the
 * cells that match min and max in the summary
 *
 * @param {Object} column The column definition
 * @param {Array} tableData the data for the whole table
 * @param {Array} columns The definitions of columns for the whole table
 *
 * @return {String} classnames
 */
export function minMaxClassName(cellData, summary, column, rowData) {
  const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
  if (sortValue === summary.min) {
    return 'highlight-min-max highlight-min';
  } else if (sortValue === summary.max) {
    return 'highlight-min-max highlight-max';
  }

  return undefined;
}

/**
 * Adds highlight-min to the cells that match min in the summary.
 *
 * @param {Object} column The column definition
 * @param {Array} tableData the data for the whole table
 * @param {Array} columns The definitions of columns for the whole table
 *
 * @return {String} classnames
 */
export function minClassName(cellData, summary, column, rowData) {
  const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
  if (sortValue === summary.min) {
    return 'highlight-min';
  }

  return undefined;
}

/**
 * Adds highlight-max to the cells that match max in the summary.
 *
 * @param {Object} column The column definition
 * @param {Array} tableData the data for the whole table
 * @param {Array} columns The definitions of columns for the whole table
 *
 * @return {String} classnames
 */
export function maxClassName(cellData, summary, column, rowData) {
  const sortValue = Utils.getSortValueFromCellData(cellData, column, rowData);
  if (sortValue === summary.min) {
    return 'highlight-max';
  }

  return undefined;
}

