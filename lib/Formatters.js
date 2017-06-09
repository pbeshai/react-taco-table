'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.leadingZeroFormat = exports.seFormat = exports.plusMinusFormat = exports.percentFormat = exports.decPercentFormat = exports.decFormat = undefined;
exports.safeFormat = safeFormat;
exports.zeroAsNull = zeroAsNull;
exports.makePlusMinus = makePlusMinus;
exports.makePercent = makePercent;
exports.atMostDecFormat = atMostDecFormat;
exports.moneyFormat = moneyFormat;
exports.commaFormat = commaFormat;

var _d3Format = require('d3-format');

var d3 = _interopRequireWildcard(_d3Format);

var _lodash = require('lodash.curry');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
/** @module Formatters */
function safeFormat(value, formatter) {
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
function zeroAsNull(formatter) {
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
function makePlusMinus(formatter) {
  return function plusMinusWrapped(value) {
    if (value != null && value > 0) {
      return '+' + formatter(value);
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
function makePercent(formatter) {
  return function percentWrapped(value) {
    if (value != null) {
      return formatter(value * 100) + '%';
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
var decFormat = exports.decFormat = (0, _lodash2.default)(function (numDecimals, value) {
  return safeFormat(value, d3.format('0.' + numDecimals + 'f'));
});

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
var decPercentFormat = exports.decPercentFormat = (0, _lodash2.default)(function (numDecimals, value) {
  return safeFormat(value * 100, d3.format('0.' + numDecimals + 'f'));
});

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
function atMostDecFormat(value) {
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
var percentFormat = exports.percentFormat = (0, _lodash2.default)(function (numDecimals, value) {
  return safeFormat(value, d3.format('0.' + numDecimals + '%'));
});

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
var plusMinusFormat = exports.plusMinusFormat = (0, _lodash2.default)(function (numDecimals, value) {
  return safeFormat(value, d3.format('+0.' + numDecimals + 'f'));
});

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
var seFormat = exports.seFormat = (0, _lodash2.default)(function (numDecimals, value) {
  return safeFormat(value, function (x) {
    return '\xB1' + d3.format('0.' + numDecimals + 'f')(Math.abs(x));
  });
});

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
var leadingZeroFormat = exports.leadingZeroFormat = (0, _lodash2.default)(function (length, value) {
  return ('00000000' + value).slice(-length);
});

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
function moneyFormat(value) {
  return safeFormat(value, d3.format('$,.2f'));
}

/**
 * Formatter - renders values formatted as with thousands separated with commas
 * (or whatever your locale uses as by d3.format(','))
 *
 * @example
 * commaFormat(1396512)
 * > '1,396,521'
 *
 * @param {Number} value value to format
 * @return {String} formatted value
 */
function commaFormat(value) {
  return safeFormat(value, d3.format(','));
}
