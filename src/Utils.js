/**
 * A collection of utility functions that make it easier to work with
 * table data.
 * @module Utils
 */
import SortDirection from './SortDirection';
import DataType from './DataType';

/**
 * Gets the value of a cell given the row data. If column.value is
 * a function, it gets called, otherwise it is interpreted as a
 * key to rowData. If column.value is not defined, column.id is
 * used as a key to rowData.
 *
 * @param {Object} column The column definition
 * @param {Object} rowData The data for the row
 * @param {Number} rowNumber The number of the row
 * @param {Array} tableData The array of data for the whole table
 * @param {Array} columns The column definitions for the whole table
 * @return {Any} The value for this cell
 */
export function getCellData(column, rowData, rowNumber, tableData, columns) {
  const { value, id } = column;
  // call value as a function
  if (typeof value === 'function') {
    return value(rowData, rowNumber, tableData, columns);

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
export function getSortValueFromCellData(cellData, column, rowData) {
  const { sortValue } = column;

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
 * @param {Array} tableData The array of data for the whole table
 * @param {Array} columns The column definitions for the whole table
 * @return {Any} The sort value for this cell
 */
export function getSortValue(column, rowData, rowNumber, tableData, columns) {
  const cellData = getCellData(column, rowData, rowNumber, tableData, columns);

  return getSortValueFromCellData(cellData, column, rowData);
}


/**
 * Gets a column from the column definitions based on its ID
 *
 * @param {Array} columns The column definitions for the whole table
 * @param {String} columnId the `id` of the column
 * @return {Object} The column definition
 */
export function getColumnById(columns, columnId) {
  return columns.find(column => column.id === columnId);
}


/**
 * Gets the comparator function to use based on the type of data
 * the column represents. These comparator functions expect the
 * data to be presented as { index, sortValue }. sortValue is used
 * to determine the order and index is used to break ties to maintain
 * a stable sort.
 *
 * @param {String} type the DataType the column represents
 * @return {Function} the comparator for stable sort
 */
export function getSortComparator(type) {
  let comparator;
  switch (type) {
    case DataType.Number:
    case DataType.NumberOrdinal:
      comparator = function numberComparator(a, b) {
        const aSortValue = a.sortValue;
        const bSortValue = b.sortValue;

        if (aSortValue == null && bSortValue == null) {
          // compare index to maintain stable sort
          return a.index - b.index;
        } else if (aSortValue == null) {
          return 1;
        } else if (bSortValue == null) {
          return -1;
        }

        const difference = parseFloat(aSortValue) - parseFloat(bSortValue);

        if (difference === 0) {
          // compare index to maintain stable sort
          return a.index - b.index;
        }

        return difference;
      };
      break;

    case DataType.String:
      comparator = function stringComparator(a, b) {
        const aSortValue = a.sortValue;
        const bSortValue = b.sortValue;

        if (aSortValue == null && bSortValue == null) {
          // compare index to maintain stable sort
          return a.index - b.index;
        } else if (aSortValue == null) {
          return -1;
        } else if (bSortValue == null) {
          return 1;
        }

        // compute the result here, then check if equal to maintain stable sort
        const result = String(aSortValue).toLowerCase()
          .localeCompare(String(bSortValue).toLowerCase());

        if (result === 0) {
          // compare index to maintain stable sort
          return a.index - b.index;
        }

        return result;
      };
      break;

    default:
      comparator = function defaultComparator(a, b) {
        const aSortValue = a.sortValue;
        const bSortValue = b.sortValue;

        if (aSortValue == null && bSortValue == null) {
          // compare index to maintain stable sort
          return a.index - b.index;
        } else if (aSortValue == null) {
          return -1;
        } else if (bSortValue == null) {
          return 1;
        }

        if (aSortValue === bSortValue) {
          // compare index to maintain stable sort
          return a.index - b.index;
        }

        return aSortValue < bSortValue ? -1 : 1;
      };
      break;
  }

  return comparator;
}

/**
 * Sorts the data based on sort value and column type. Uses a stable sort
 * by keeping track of the original position to break ties.
 *
 * @param {Array} data the array of data for the whole table
 * @param {String} columnId the column ID of the column to sort by
 * @param {Boolean} sortDirection The direction to sort in
 * @param {Array} columns The column definitions for the whole table
 * @return {Array} The sorted data
 */
export function sortData(data, columnId, sortDirection, columns) {
  const column = getColumnById(columns, columnId);

  if (!column) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('No column found by ID', columnId, columns);
    }

    return data;
  }

  const comparator = getSortComparator(column.type);
  const sortedData = data.map((rowData, index) => ({
    rowData,
    index,
    sortValue: getSortValue(column, rowData, index, data, columns),
  }))
    .sort(comparator)
    .map(sortItem => sortItem.rowData);

  if (sortDirection === SortDirection.Descending) {
    sortedData.reverse();
  }

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
 * @param {Array} tableData The array of data for the whole table
 * @param {Array} columns The column definitions for the whole table
 * @return {Renderable} The contents of the cell
 */
export function renderCell(cellData, column, rowData, rowNumber, tableData, columns) {
  const { renderer } = column;

  // if renderer is provided, call it
  if (renderer != null) {
    return renderer(cellData, column, rowData, rowNumber, tableData, columns);
  }

  // otherwise, render the raw cell data
  return cellData;
}

