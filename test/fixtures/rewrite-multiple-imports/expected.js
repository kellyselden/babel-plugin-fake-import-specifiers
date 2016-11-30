'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _myLib1 = require('my-lib-1');

var _myLib12 = _interopRequireDefault(_myLib1);

var _myLib2 = require('my-lib-2');

var _myLib22 = _interopRequireDefault(_myLib2);

var aValue1 = _myLib12['default'].aPackage1('a string');
var aValue2 = _myLib22['default'].aPackage2('a string');

exports.aValue1 = aValue1;
exports.aValue2 = aValue2;
