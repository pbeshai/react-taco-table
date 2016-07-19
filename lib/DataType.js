'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** @module DataType */

/**
 * Data types available for TacoTable columns
 * @enum {String}
 */
var DataType = {
  /** Should be used for numeric types */
  Number: 'Number',

  /** Should be used for numeric types that can also work as categories (e.g., year) */
  NumberOrdinal: 'NumberOrdinal',

  String: 'String',
  Boolean: 'Boolean',
  Date: 'Date',
  None: 'None'
};

exports.default = DataType;
