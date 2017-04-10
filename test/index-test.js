'use strict';

const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const transformFileSync = require('babel').transformFileSync;

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

let fixturesDir = path.join(__dirname, 'fixtures');

let testCount = 0;

function test(caseName) {
  let testName = caseName.split('-').join(' ');
  let fixtureDir = path.join(fixturesDir, caseName);
  let actualPath = path.join(fixtureDir, 'actual.js');
  let expectedPath = path.join(fixtureDir, 'expected.js');
  let actual;
  let expected;
  try {
    actual = transformFileSync(actualPath).code;
    expected = fs.readFileSync(expectedPath).toString()
      .replace(/\r\n/g, '\n');
  } catch (err) {
    if (err._babel) {
      throw err;
    }

    // empty folders
    return;
  }

  testCount++;

  it('should ' + testName, function() {
    expect(trim(actual)).to.equal(trim(expected));
  });
}

describe('rewrites imports', function() {
  let caseNames = fs.readdirSync(fixturesDir);

  let only = caseNames.filter(function(caseName) {
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
