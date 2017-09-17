'use strict';

const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const fixtureSkipper = require('fixture-skipper');
const transformFileSync = require('babel').transformFileSync;

const fixturesDir = path.join(__dirname, 'fixtures');

const forEachDir = fixtureSkipper(fixturesDir);

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

let testCount = 0;

describe('rewrites imports', function() {
  forEachDir((it, caseName) => {
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

    it(`should ${testName}`, function() {
      expect(trim(actual)).to.equal(trim(expected));
    });
  });

  if (!testCount) {
    throw new Error('no tests were run');
  }
});
