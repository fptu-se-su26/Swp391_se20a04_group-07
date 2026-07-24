'use strict';

const {
  isNonEmptyArray
} = require('../common/util.js');

function locStart(node, opts) {
  const {
    ignoreDecorators
  } = opts || {};

  if (!ignoreDecorators) {
    const decorators = node.declaration && node.declaration.decorators || node.decorators;

    if (isNonEmptyArray(decorators)) {
      return locStart(decorators[0]);
    }
  }

  return node.range ? node.range[0] : node.start;
}

function locEnd(node) {
  return node.range ? node.range[1] : node.end;
}

module.exports = {
  locStart,
  locEnd
};