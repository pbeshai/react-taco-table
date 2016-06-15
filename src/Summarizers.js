/**
 *
 * Summarizers are functions that derive some properties over the data for
 * an entire column.
 *
 * They all have the signature: `summarizer(column, tableData, columns)` where
 * column is the column definition, tableData is the data for the entire table,
 * and columns is the configuration for all the columns in the table.
 *
 * They should return an object with values derived from the column's worth of
 * data.
 *
 * @module Summarizers
 */

import * as Utils from './Utils';

/**
 * Computes the minimum and maximum values in a column as `min` and `max`.
 *
 * @param {Object} column The column definition
 * @param {Array} tableData the data for the whole table
 * @param {Array} columns The definitions of columns for the whole table
 *
 * @return {Object} The minimum and maximum values as {min, max}
 */
export function minMaxSummarizer(column, tableData, columns) {
  return tableData.reduce((minMax, rowData, rowNumber) => {
    const sortValue = Utils.getSortValue(column, rowData, rowNumber, tableData, columns);

    const { min, max } = minMax;
    if (min == null || sortValue < min) {
      minMax.min = sortValue;
    }

    if (max == null || sortValue > max) {
      minMax.max = sortValue;
    }

    return minMax;
  }, {});
}

