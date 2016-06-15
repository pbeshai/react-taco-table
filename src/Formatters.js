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
 * 10.89321 = 10.9
 *
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
 * 0.8132 = 81.3
 *
 * @param {Number} numDecimals number of decimals to use
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export const decPercentFormat = curry((value) =>
  safeFormat(value * 100, d3.format('0.1f'))
);

/**
 * Formatter - renders value with at most one decimal point
 *
 * - 10.89321 = 10.9
 * - 15 = 15
 * - 15.001 = 15.0
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
 * 0.38523 = 38.5%
 *
 * @param {Number} numDecimals number of decimals to use
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export const pctFormat = curry((numDecimals, value) =>
  safeFormat(value, d3.format(`0.${numDecimals}%`))
);

/**
 * Formatter (curried) - renders positive values with a +
 * and negative with a -.
 *
 * 0.38523 = +0.4
 * -15 = -15.0
 *
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
 * - 0.38523 = ±0.4
 * - -15 = ±15.0
 *
 * @param {Number} numDecimals number of decimals to use
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export const seFormat = curry((numDecimals, value) =>
  safeFormat(value, x => `±${d3.format(`0.${numDecimals}f`)(Math.abs(x))}`)
);

/**
 * Formatter - adds leading zeroes to a value
 *
 * (5, 2) => '05'
 * (12, 2) => '12'
 *
 * @param {Number} value value to format
 * @param {Number} length desired length of string
 * @return {String} formatted value
 */
export function leadingZeroFormat(value, length) {
  return `00000000${value}`.slice(-length);
}

/**
 * Formatter - renders values formatted as money (prefixed with $, uses commas)
 * 9.132 = $9.13
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function moneyFormat(value) {
  return safeFormat(value, d3.format('$,f'));
}

