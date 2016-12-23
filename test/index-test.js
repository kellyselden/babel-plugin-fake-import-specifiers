'use strict';

var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;
var transformFileSync = require('babel').transformFileSync;

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

var fixturesDir = path.join(__dirname, 'fixtures');

var testCount = 0;

function test(caseName) {
  var testName = caseName.split('-').join(' ');
  var fixtureDir = path.join(fixturesDir, caseName);
  var actualPath = path.join(fixtureDir, 'actual.js');
  var expectedPath = path.join(fixtureDir, 'expected.js');
  var actual;
  var expected;
  try {
    actual = transformFileSync(actualPath).code;
    expected = fs.readFileSync(expectedPath).toString()
      .replace(/\r\n/g, '\n');
  } catch (err) {
    // empty folders
    return;
  }

  testCount++;

  it('should ' + testName, function() {
    expect(trim(actual)).to.equal(trim(expected));
  });
}

describe('rewrites imports', function() {
  var caseNames = fs.readdirSync(fixturesDir);

  var only = caseNames.filter(function(caseName) {
    return caseName.indexOf('_') === 0;
  });
  if (only.length) {
    caseNames = only;
  }

  caseNames.forEach(test);

  if (!testCount) {
    throw new Error('no tests were run');
  }
});
