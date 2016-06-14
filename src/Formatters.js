/** @module Formatters */
import * as d3 from 'd3-format';

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
 * Formatter - renders one decimal point
 * 10.89321 = 10.9
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function decFormat(value) {
  return safeFormat(value, d3.format('0.1f'));
}

/**
 * Formatter - renders value multiplied by 100 with one decimal point
 * Commonly used for percentages without the %.
 * 0.8132 = 81.3
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function dec100Format(value) {
  return safeFormat(value * 100, d3.format('0.1f'));
}

/**
 * Formatter - renders value with two decimal points
 * 10.89321 = 10.89
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function decFormat2(value) {
  return safeFormat(value, d3.format('0.2f'));
}

/**
 * Formatter - renders value with three decimal points
 * 10.89321 = 10.893
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function decFormat3(value) {
  return safeFormat(value, d3.format('0.3f'));
}

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

  return decFormat(value);
}

/**
 * Formatter - renders value as a percentage
 * 0.38523 = 38.5%
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function pctFormat(value) {
  return safeFormat(value, d3.format('0.1%'));
}

/**
 * Formatter - renders positive values with a + and negative with a -
 * Uses one decimal point.
 * 0.38523 = +0.4
 * -15 = -15.0
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function plusMinusFormat(value) {
  return safeFormat(value, d3.format('+0.1f'));
}

/**
 * Formatter - renders positive values with a + and negative with a -
 * Uses two decimal points.
 * 0.38523 = +0.39
 * -15 = -15.00
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function plusMinusFormat2(value) {
  return safeFormat(value, d3.format('+0.2f'));
}

/**
 * Formatter - renders values prefixed with a ±
 * Uses one decimal point.
 * 0.38523 = ±0.4
 * -15 = ±15.0
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function seFormat(value) {
  return safeFormat(value, x => `±${d3.format('0.1f')(Math.abs(x))}`);
}

/**
 * Formatter - renders values prefixed with a ±
 * Uses two decimal points.
 * 0.38523 = ±0.39
 * -15 = ±15.00
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
export function seFormat2(value) {
  return safeFormat(value, x => `±${d3.format('0.2f')(Math.abs(x))}`);
}

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

