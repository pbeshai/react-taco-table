/** @module Formatters */
import * as d3 from 'd3-format';
import curry from 'lodash.curry';

// //////////////////////////////
// Utility Functions
// //////////////////////////////

/**
 * Returns null/undefined for null/undefined values,
 * otherwise it returns the result of a passed in formatter
 *
 * @param {Any} value value to format
 * @param {Function} formatter formatter function
 * @return Formatted value or null/undefined
 */
export function safeFormat(value, formatter) {
  if (value == null || isNaN(value)) {
    return value;
  }

  return formatter(value);
}

/**
 * Wraps a formatter function that replaces the value with null
 * when it is 0. Useful for not rendering zeroes in tables.
 *
 * @param {Function} formatter formatter function
 * @return {Function} a formatter function
 */
export function zeroAsNull(formatter) {
  return function zeroAsNullWrapped(value) {
    return formatter(value === 0 ? null : value);
  };
}

/**
 * Wraps a formatting function and puts a + in front of formatted value
 * if it is positive.
 *
 * @param {Function} formatter formatter function
 * @return {Function} a formatter function
 */
export function makePlusMinus(formatter) {
  return function plusMinusWrapped(value) {
    if (value != null && value > 0) {
      return `+${formatter(value)}`;
    }

    return formatter(value);
  };
}

/**
 * Wraps a formatting function by multiplying the value by 100 and
 * adds a % to the end.
 *
 * @param {Function} formatter formatter function
 * @return {Function} a formatter function
 */
export function makePercent(formatter) {
  return function percentWrapped(value) {
    if (value != null) {
      return `${formatter(value * 100)}%`;
    }

    return formatter(value);
  };
}


// //////////////////////////////
// Formatters
// //////////////////////////////

/**
 * Formatter (curried) - renders to `numDecimals` decimal places
 *
 * @example
 * decFormat(1, 10.89321)
 * > '10.9'
 *
 * @example
 * decFormat(2, 10.89321)
 * > '10.89'
 *
 * @example
 * decFormat(1)(10.89321)
 * > '10.9'
 *
 * @function
 * @param {Number} numDecimals number of decimals to use
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export const decFormat = curry((numDecimals, value) =>
  safeFormat(value, d3.format(`0.${numDecimals}f`))
);

/**
 * Formatter (curried) - renders value multiplied by 100
 * with `numDecimal` decimal points.
 * Commonly used for percentages without the %.
 *
 * @example
 * decPercentFormat(1, 0.8132)
 * > '81.3'
 *
 * @function
 * @param {Number} numDecimals number of decimals to use
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export const decPercentFormat = curry((numDecimals, value) =>
  safeFormat(value * 100, d3.format(`0.${numDecimals}f`))
);

/**
 * Formatter - renders value with at most one decimal point
 *
 * @example
 * atMostDecFormat(10.89321)
 * > '10.9'
 *
 * @example
 * atMostDecFormat(15)
 * > '15'
 *
 * @example
 * atMostDecFormat(15.001)
 * > '15.0'
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function atMostDecFormat(value) {
  if (Number.isInteger(value)) {
    return value;
  }

  return decFormat(1, value);
}

/**
 * Formatter (curried) - renders value as a percentage
 *
 * @example
 * percentFormat(1, 0.38523)
 * > '38.5%'
 *
 * @function
 * @param {Number} numDecimals number of decimals to use
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export const percentFormat = curry((numDecimals, value) =>
  safeFormat(value, d3.format(`0.${numDecimals}%`))
);

/**
 * Formatter (curried) - renders positive values with a +
 * and negative with a -.
 *
 * @example
 * plusMinusFormat(1, 0.38523)
 * > '+0.4'
 *
 * @example
 * plusMinusFormat(1, -15)
 * > '-15.0'
 *
 * @function
 * @param {Number} numDecimals number of decimals to use
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export const plusMinusFormat = curry((numDecimals, value) =>
  safeFormat(value, d3.format(`+0.${numDecimals}f`))
);

/**
 * Formatter (curried) - renders values prefixed with a ±
 *
 * @example
 * seFormat(1, 0.38523)
 * > '±0.4'
 *
 * @example
 * seFormat(2, -15)
 * > '±15.00'
 *
 * @function
 * @param {Number} numDecimals number of decimals to use
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export const seFormat = curry((numDecimals, value) =>
  safeFormat(value, x => `±${d3.format(`0.${numDecimals}f`)(Math.abs(x))}`)
);

/**
 * Formatter - adds leading zeroes to a value
 * (adds max of 8 zeros)
 *
 * @example
 * leadingZeroFormat(5, 2)
 * > '05'
 *
 * @example
 * leadingZeroFormat(12, 2)
 * > '12'
 *
 * @param {Number} length desired length of string
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export const leadingZeroFormat = curry((length, value) =>
  `00000000${value}`.slice(-length)
);

/**
 * Formatter - renders values formatted as money (prefixed with $, uses commas)
 *
 * @example
 * moneyFormat(9.132)
 * > '$9.13'
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function moneyFormat(value) {
  return safeFormat(value, d3.format('$,.2f'));
}

