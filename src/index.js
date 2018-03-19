'use strict';

function convertDasherizedToCamelized(str) {
  return str.split('-').reduce(function(str, chunk) {
    if (str === '') {
      str = chunk;
    } else {
      str += chunk.substr(0, 1).toUpperCase() + chunk.substr(1);
    }
    return str;
  }, '');
}

module.exports = function(babel) {
  let Plugin = babel.Plugin;
  let t = babel.types;

  let sourcesToFake;
  let defaultSpecifierLookup;
  let newIdentifierLookup;

  let visitor = {
    ImportDeclaration(node, parent, scope) {
      let value = node.source.value;
      let sourceMinusOne;
      let dasherizedPackageName;
      if (sourcesToFake.indexOf(value) === -1) {
        // try to match a partial import
        // ex: source = 'my-lib'
        // import aPackage from 'my-lib/a-package';
        let lastSlashIndex = value.lastIndexOf('/');
        sourceMinusOne = value.substr(0, lastSlashIndex);
        if (sourcesToFake.indexOf(sourceMinusOne) === -1) {
          return;
        }
        dasherizedPackageName = value.substr(lastSlashIndex + 1);
      }

      let defaultSpecifierIndentifier;
      let defaultSpecifier;
      let specifiers = node.specifiers;

      for (let i in specifiers) {
        if (!Object.prototype.hasOwnProperty.call(specifiers, i)) {
          continue;
        }

        let specifier = specifiers[i];
        if (t.isImportDefaultSpecifier(specifier)) {
          defaultSpecifierIndentifier = specifier.local;
          defaultSpecifier = specifier;
        } else if (dasherizedPackageName) {
          // ignore partial match imports with non default specifiers
          // ex: source = 'my-lib'
          // import { anotherPackage } from 'my-lib/a-package';
          return;
        }
      }

      function generateNewDefaultSpecifier() {
        defaultSpecifierIndentifier = scope.generateUidIdentifier();
        defaultSpecifier = t.importDefaultSpecifier(defaultSpecifierIndentifier);
      }

      let hasSpecifiers;

      function addSpecifierToLookup(name) {
        defaultSpecifierLookup[name] = defaultSpecifierIndentifier;
        hasSpecifiers = true;
      }

      if (dasherizedPackageName) {
        node.source.value = sourceMinusOne;

        let oldName = defaultSpecifierIndentifier.name;
        let name = convertDasherizedToCamelized(dasherizedPackageName);
        newIdentifierLookup[oldName] = name;

        generateNewDefaultSpecifier();

        addSpecifierToLookup(oldName);
      } else {
        specifiers.forEach(function(specifier) {
          if (!t.isImportSpecifier(specifier)) {
            return;
          }

          if (!defaultSpecifierIndentifier) {
            generateNewDefaultSpecifier();
          }

          addSpecifierToLookup(specifier.local.name);
        });
      }

      if (hasSpecifiers) {
        node.specifiers = [defaultSpecifier];
      }
    },
    CallExpression(node) {
      let callee = node.callee;
      if (callee.type !== 'Identifier') {
        return;
      }

      let name = callee.name;
      let defaultSpecifierIndentifier = defaultSpecifierLookup[name];
      if (!defaultSpecifierIndentifier) {
        return;
      }

      let newIdentifier = newIdentifierLookup[name];
      if (newIdentifier) {
        name = newIdentifier;
      }

      return this.replaceWith(
        t.callExpression(
          t.memberExpression(
            defaultSpecifierIndentifier,
            t.identifier(name)
          ),
          node.arguments
        )
      );
    },
    Program(node, parent, scope, file) {
      sourcesToFake = file.opts.extra['fake-import-specifiers'] || [];
      defaultSpecifierLookup = Object.create(null);
      newIdentifierLookup = {};
    }
  };

  return new Plugin('babel-plugin-fake-import-specifiers', {
    visitor
  });
};
