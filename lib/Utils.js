'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCellData = getCellData;
exports.getSortValueFromCellData = getSortValueFromCellData;
exports.getSortValue = getSortValue;
exports.getColumnById = getColumnById;
exports.getSortComparator = getSortComparator;
exports.sortData = sortData;
exports.renderCell = renderCell;
exports.validateColumns = validateColumns;

var _stable = require('stable');

var _stable2 = _interopRequireDefault(_stable);

var _SortDirection = require('./SortDirection');

var _SortDirection2 = _interopRequireDefault(_SortDirection);

var _DataType = require('./DataType');

var _DataType2 = _interopRequireDefault(_DataType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the value of a cell given the row data. If column.value is
 * a function, it gets called, otherwise it is interpreted as a
 * key to rowData. If column.value is not defined, column.id is
 * used as a key to rowData.
 *
 * @param {Object} column The column definition
 * @param {Object} rowData The data for the row
 * @param {Number} rowNumber The number of the row
 * @param {Object[]} tableData The array of data for the whole table
 * @param {Object[]} columns The column definitions for the whole table
 * @return {Any} The value for this cell
 */
function getCellData(column, rowData, rowNumber, tableData, columns, isBottomData) {
  var value = column.value;
  var id = column.id;

  // if it is bottom data, just use the value directly.

  if (isBottomData) {
    return rowData[id];
  }

  // call value as a function
  if (typeof value === 'function') {
    return value(rowData, { rowNumber: rowNumber, tableData: tableData, columns: columns });

    // interpret value as a key
  } else if (value != null) {
    return rowData[value];
  }

  // otherwise, use the ID as a key
  return rowData[id];
}

/**
 * Gets the sort value of a cell given the cell data and row data. If
 * no sortValue function is provided on the column, the cellData is
 * returned.
 *
 * @param {Object} cellData The cell data
 * @param {Object} column The column definition
 * @param {Object} rowData The data for the row
 * @return {Any} The sort value for this cell
 */
/**
 * A collection of utility functions that make it easier to work with
 * table data.
 * @module Utils
 */
function getSortValueFromCellData(cellData, column, rowData) {
  var sortValue = column.sortValue;


  if (sortValue) {
    return sortValue(cellData, rowData);
  }

  return cellData;
}

/**
 * Gets the sort value for a cell by first computing the cell data. If
 * no sortValue function is provided on the column, the cellData is
 * returned.
 *
 * @param {Object} column The column definition
 * @param {Object} rowData The data for the row
 * @param {Number} rowNumber The number of the row
 * @param {Object[]} tableData The array of data for the whole table
 * @param {Object[]} columns The column definitions for the whole table
 * @return {Any} The sort value for this cell
 */
function getSortValue(column, rowData, rowNumber, tableData, columns) {
  var cellData = getCellData(column, rowData, rowNumber, tableData, columns);

  return getSortValueFromCellData(cellData, column, rowData);
}

/**
 * Gets a column from the column definitions based on its ID
 *
 * @param {Object[]} columns The column definitions for the whole table
 * @param {String} columnId the `id` of the column
 * @return {Object} The column definition
 */
function getColumnById(columns, columnId) {
  return columns.find(function (column) {
    return column.id === columnId;
  });
}

/**
 * Gets the comparator function to use based on the type of data
 * the column represents. These comparator functions expect the
 * data to be presented as { index, sortValue }. sortValue is used
 * to determine the order.
 *
 * @param {String} type the DataType the column represents
 * @return {Function} the comparator for sort
 */
function getSortComparator(type) {
  var comparator = void 0;
  switch (type) {
    case _DataType2.default.Number:
    case _DataType2.default.NumberOrdinal:
      comparator = function numberComparator(a, b) {
        var aSortValue = a.sortValue;
        var bSortValue = b.sortValue;

        if (aSortValue == null && bSortValue == null) {
          return 0;
        } else if (aSortValue == null) {
          return 1;
        } else if (bSortValue == null) {
          return -1;
        }

        var difference = parseFloat(aSortValue) - parseFloat(bSortValue);

        return difference;
      };
      break;

    case _DataType2.default.String:
      comparator = function stringComparator(a, b) {
        var aSortValue = a.sortValue;
        var bSortValue = b.sortValue;

        if (aSortValue == null && bSortValue == null) {
          return 0;
        } else if (aSortValue == null) {
          return -1;
        } else if (bSortValue == null) {
          return 1;
        }

        var result = String(aSortValue).toLowerCase().localeCompare(String(bSortValue).toLowerCase());

        return result;
      };
      break;

    default:
      comparator = function defaultComparator(a, b) {
        var aSortValue = a.sortValue;
        var bSortValue = b.sortValue;

        if (aSortValue == null && bSortValue == null) {
          return 0;
        } else if (aSortValue == null) {
          return -1;
        } else if (bSortValue == null) {
          return 1;
        }

        if (aSortValue === bSortValue) {
          return 0;
        }

        return aSortValue < bSortValue ? -1 : 1;
      };
      break;
  }

  return comparator;
}

/**
 * Helper function to test if an array is already sorted
 *
 * @param {Boolean} sortDirection The direction to check if it is sorted in
 * @param {Array} data The data to check
 * @param {Function} comparator The comparator to use
 * @return {Boolean} True if already sorted, false otherwise
 */
function alreadySorted(sortDirection, data, comparator) {
  var numRows = data.length;
  if (sortDirection === _SortDirection2.default.Ascending) {
    for (var i = 1; i < numRows; i++) {
      if (comparator(data[i - 1], data[i]) > 0) {
        return false;
      }
    }
    // check descending
  } else {
    for (var _i = 1; _i < numRows; _i++) {
      if (comparator(data[_i - 1], data[_i]) < 0) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Sorts the data based on sort value and column type. Uses a stable sort
 * by keeping track of the original position to break ties unless the data
 * is already sorted, in which case it just reverses the array.
 *
 * @param {Object[]} data the array of data for the whole table
 * @param {String} columnId the column ID of the column to sort by
 * @param {Boolean} sortDirection The direction to sort in
 * @param {Object[]} columns The column definitions for the whole table
 * @return {Object[]} The sorted data
 */
function sortData(data, columnId, sortDirection, columns) {
  var column = getColumnById(columns, columnId);

  if (!column) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('No column found by ID', columnId, columns);
    }

    return data;
  }

  // read the type from `sortType` property if defined, otherwise use `type`
  var sortType = column.sortType == null ? column.type : column.sortType;
  var comparator = getSortComparator(sortType);
  var dataToSort = data.map(function (rowData, index) {
    return {
      rowData: rowData,
      index: index,
      sortValue: getSortValue(column, rowData, index, data, columns)
    };
  });

  // check if already sorted, and if so, just reverse
  var sortedData = void 0;

  // if already sorted in the opposite order, just reverse it
  if (alreadySorted(!sortDirection, dataToSort, comparator)) {
    sortedData = dataToSort.reverse();

    // if not sorted, stable sort it
  } else {
    sortedData = (0, _stable2.default)(dataToSort, comparator);
    if (sortDirection === _SortDirection2.default.Descending) {
      sortedData.reverse();
    }
  }

  sortedData = sortedData.map(function (sortItem) {
    return sortItem.rowData;
  });

  return sortedData;
}

/**
 * Renders a cell's contents based on the renderer function. If no
 * renderer is provided, it just returns the raw cell data. In such
 * cases, the user should take care that cellData can be rendered
 * directly.
 *
 * @param {Any} cellData The data for the cell
 * @param {Object} column The column definition
 * @param {Object} rowData The data for the row
 * @param {Number} rowNumber The number of the row
 * @param {Object[]} tableData The array of data for the whole table
 * @param {Object[]} columns The column definitions for the whole table
 * @return {Renderable} The contents of the cell
 */
function renderCell(cellData, column, rowData, rowNumber, tableData, columns, isBottomData) {
  var renderer = column.renderer;
  var renderOnNull = column.renderOnNull;

  // render if not bottom data-- bottomData's cellData is already rendered.

  if (!isBottomData) {
    // do not render if value is null and `renderOnNull` is not explicitly set to true
    if (cellData == null && renderOnNull !== true) {
      return null;

      // render normally if a renderer is provided
    } else if (renderer != null) {
      return renderer(cellData, { column: column, rowData: rowData, rowNumber: rowNumber, tableData: tableData, columns: columns });
    }
  }

  // otherwise, render the raw cell data
  return cellData;
}

/**
 * Checks an array of column definitions to see if there are any issues.
 * Checks if
 *
 *  - multiple columns have the same ID
 *
 * Typically only used in development.
 *
 * @param {Object[]} columns The column definitions for the whole table
 * @returns {void}
 */
function validateColumns(columns) {
  if (!columns) {
    return;
  }

  // check IDs
  var ids = {};
  columns.forEach(function (column, i) {
    var id = column.id;

    if (!ids[id]) {
      ids[id] = [i];
    } else {
      ids[id].push(i);
    }
  });
  Object.keys(ids).forEach(function (id) {
    if (ids[id].length > 1) {
      console.warn('Column ID \'' + id + '\' used in multiple columns ' + ids[id].join(', '), ids[id].map(function (index) {
        return columns[index];
      }));
    }
  });
}
