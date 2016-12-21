'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _myLibAPackage = require('my-lib/a-package');

var _myLibAPackage2 = _interopRequireDefault(_myLibAPackage);

var aValue1 = (0, _myLibAPackage2['default'])('a string');
var aValue2 = (0, _myLibAPackage.anotherPackage)('a string');

exports.aValue1 = aValue1;
exports.aValue2 = aValue2;
