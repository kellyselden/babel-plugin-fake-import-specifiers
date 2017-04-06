# babel-plugin-fake-import-specifiers

[![Build Status](https://travis-ci.org/kellyselden/babel-plugin-fake-import-specifiers.svg?branch=master)](https://travis-ci.org/kellyselden/babel-plugin-fake-import-specifiers)
[![Build status](https://ci.appveyor.com/api/projects/status/v4eagpd8k731oyul/branch/master?svg=true)](https://ci.appveyor.com/project/kellyselden/babel-plugin-fake-import-specifiers/branch/master)

[![Greenkeeper badge](https://badges.greenkeeper.io/kellyselden/babel-plugin-fake-import-specifiers.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/babel-plugin-fake-import-specifiers.svg)](https://badge.fury.io/js/babel-plugin-fake-import-specifiers)

Allow importing pieces while only exporting the whole object

## Tests

To test a single fixture folder, prefix the folder name with an underscore.

"test/fixtures/rewrite-import" => "test/fixtures/_rewrite-import"
