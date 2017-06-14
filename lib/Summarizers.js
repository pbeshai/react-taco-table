'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weightedAverageSummarizer = exports.compositeSummarizer = undefined;
exports.minMaxSummarizer = minMaxSummarizer;
exports.meanSummarizer = meanSummarizer;
exports.frequencySummarizer = frequencySummarizer;

var _lodash = require('lodash.curry');

var _lodash2 = _interopRequireDefault(_lodash);

var _Utils = require('./Utils');

var Utils = _interopRequireWildcard(_Utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Combines multiple summarizers until a single object.
 *
 * Expected use in a column definition:
 * ```
 * {
 *   ...
 *   summarize: compositeSummarizer([meanSummarizer, minMaxSummarizer]),
 * },
 * ```
 *
 * @param {Function[]} summarizers An array of summarizers to run and combine the results of
 * @param {Object} column The column definition
 * @param {Object[]} tableData the data for the whole table
 * @param {Object[]} columns The definitions of columns for the whole table
 *
 * @return {Object} The combined summaries in a single object. Duplicate keys will overwrite.
 */
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
var compositeSummarizer = exports.compositeSummarizer = (0, _lodash2.default)(function (summarizers, column, tableData, columns) {
  return summarizers.reduce(function (summary, summarizer) {
    Object.assign(summary, summarizer(column, tableData, columns));

    return summary;
  }, {});
});

/**
 * Computes the minimum and maximum values in a column as `min` and `max`.
 * Does the computation based on the sortValue.
 *
 * @param {Object} column The column definition
 * @param {Object[]} tableData the data for the whole table
 * @param {Object[]} columns The definitions of columns for the whole table
 *
 * @return {Object} The minimum and maximum values as `{ min, max }`
 */
function minMaxSummarizer(column, tableData, columns) {
  return tableData.reduce(function (minMax, rowData, rowNumber) {
    var sortValue = Utils.getSortValue(column, rowData, rowNumber, tableData, columns);

    var min = minMax.min,
        max = minMax.max;

    if (min == null || sortValue < min) {
      minMax.min = sortValue;
    }

    if (max == null || sortValue > max) {
      minMax.max = sortValue;
    }

    return minMax;
  }, {});
}

/**
 * Computes the mean, sum, and count in a column as `mean, sum, count`.
 * Does the computation based on the sortValue.
 *
 * @param {Object} column The column definition
 * @param {Object[]} tableData the data for the whole table
 * @param {Object[]} columns The definitions of columns for the whole table
 *
 * @return {Object} The mean of values as `{ mean, sum, count }`
 */
function meanSummarizer(column, tableData, columns) {
  var stats = tableData.reduce(function (stats, rowData, rowNumber) {
    var sortValue = Utils.getSortValue(column, rowData, rowNumber, tableData, columns);

    if (sortValue) {
      if (stats.sum === null) {
        stats.sum = sortValue;
      } else {
        stats.sum += sortValue;
      }
    }

    return stats;
  }, { sum: null, count: tableData.length, mean: null });

  if (stats.sum !== null) {
    stats.mean = stats.sum / stats.count;
  }

  return stats;
}

/**
 * Computes a weighted average based on another column's value as the weight.
 * Available as `weightedAverage`.
 * Does the computation based on the sortValue.
 *
 * Expected use in a column definition:
 * ```
 * {
 *   ...
 *   summarize: weightedAverageSummarizer('myWeightColumnId'),
 * },
 * ```
 *
 * @param {String} weightColumnId The ID of the column to use for weights
 * @param {Object} column The column definition
 * @param {Object[]} tableData the data for the whole table
 * @param {Object[]} columns The definitions of columns for the whole table
 *
 * @return {Object} The weightedAverage as `{ weightedAverage, numerator, denominator }`
 */
var weightedAverageSummarizer = exports.weightedAverageSummarizer = (0, _lodash2.default)(function (weightColumnId, column, tableData, columns) {
  var weightColumn = columns.find(function (col) {
    return col.id === weightColumnId;
  });
  var stats = tableData.reduce(function (stats, rowData, rowNumber) {
    var sortValue = Utils.getSortValue(column, rowData, rowNumber, tableData, columns);
    var weightSortValue = Utils.getSortValue(weightColumn, rowData, rowNumber, tableData, columns);

    if (weightSortValue !== null && sortValue !== null) {
      stats.numerator = (stats.numerator || 0) + weightSortValue * sortValue;
      stats.denominator = (stats.denominator || 0) + weightSortValue;
    }

    return stats;
  }, { weightedAverage: null, numerator: null, denominator: null });

  if (stats.numerator !== null && stats.denominator !== null && stats.denominator !== 0) {
    stats.weightedAverage = stats.numerator / stats.denominator;
  }

  return stats;
});

/**
 * Computes the frequency for each value in the dataset and computes the most frequent.
 * If there is a tie for most frequent, it returns just the first encountered value.
 * Does the summary based on the cellData value.
 *
 * @param {Object} column The column definition
 * @param {Object[]} tableData the data for the whole table
 * @param {Object[]} columns The definitions of columns for the whole table
 *
 * @return {Object} The most frequently occuring value `{ counts, mostFrequent }`
 */
function frequencySummarizer(column, tableData, columns) {
  var mostFrequent = void 0;

  var counts = tableData.reduce(function (counts, rowData, rowNumber) {
    var cellData = Utils.getCellData(column, rowData, rowNumber, tableData, columns);
    if (!counts[cellData]) {
      counts[cellData] = 1;
    } else {
      counts[cellData] += 1;
    }

    if (mostFrequent == null || counts[cellData] > counts[mostFrequent]) {
      mostFrequent = cellData;
    }

    return counts;
  }, {});

  return { counts: counts, mostFrequent: mostFrequent };
}
