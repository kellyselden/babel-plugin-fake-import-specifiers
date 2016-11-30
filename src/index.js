'use strict';

module.exports = function(babel) {
  var Plugin = babel.Plugin;
  var t = babel.types;

  var sourcesToFake;
  var defaultSpecifierLookup;

  var visitor = {
    ImportDeclaration: function(node, parent, scope, file) {
      if (sourcesToFake.indexOf(node.source.value) === -1) {
        return;
      }

      var defaultSpecifierIndentifier;
      var defaultSpecifier;
      var specifiers = node.specifiers;

      for (var i in specifiers) {
        if (!Object.prototype.hasOwnProperty.call(specifiers, i)) {
          continue;
        }

        var specifier = specifiers[i];
        if (t.isImportDefaultSpecifier(specifier)) {
          defaultSpecifierIndentifier = specifier.local;
          defaultSpecifier = specifier;
          break;
        }
      }

      var hasSpecifiers;

      specifiers.forEach(function(specifier) {
        if (!t.isImportSpecifier(specifier)) {
          return;
        }

        if (!defaultSpecifierIndentifier) {
          defaultSpecifierIndentifier = scope.generateUidIdentifier();
          defaultSpecifier = t.importDefaultSpecifier(defaultSpecifierIndentifier);
        }

        defaultSpecifierLookup[specifier.local.name] = defaultSpecifierIndentifier;
        hasSpecifiers = true;
      });

      if (hasSpecifiers) {
        node.specifiers = [defaultSpecifier];
      }
    },
    CallExpression: function(node, parent, scope, file) {
      var callee = node.callee;
      if (callee.type !== 'Identifier') {
        return;
      }

      var name = callee.name;
      var defaultSpecifierIndentifier = defaultSpecifierLookup[name];
      if (!defaultSpecifierIndentifier) {
        return;
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
    Program: function(node, parent, scope, file) {
      sourcesToFake = file.opts.extra['fake-import-specifiers'] || [];
      defaultSpecifierLookup = {};
    }
  };

  return new Plugin('babel-plugin-fake-import-specifiers', {
    visitor: visitor
  });
};
