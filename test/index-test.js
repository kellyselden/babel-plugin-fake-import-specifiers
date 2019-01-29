'use strict';

const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const fixtureSkipper = require('fixture-skipper');
const { transformFileSync } = require('babel');

const fixturesDir = path.join(__dirname, 'fixtures');

const forEachDir = fixtureSkipper(fixturesDir);

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('rewrites imports', function() {
  forEachDir((it, caseName) => {
    let testName = caseName.split('-').join(' ');
    let fixtureDir = path.join(fixturesDir, caseName);
    let actualPath = path.join(fixtureDir, 'actual.js');
    let expectedPath = path.join(fixtureDir, 'expected.js');
    let actual = transformFileSync(actualPath).code;
    let expected = fs.readFileSync(expectedPath).toString()
      .replace(/\r\n/g, '\n');

    it(`should ${testName}`, function() {
      expect(trim(actual)).to.equal(trim(expected));
    });
  });
});
