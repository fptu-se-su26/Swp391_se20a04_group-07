'use strict';

function isBlockComment(comment) {
  return comment.type === 'Block' || comment.type === 'CommentBlock' || comment.type === 'MultiLine';
}

function isLineComment(comment) {
  return comment.type === 'Line' || comment.type === 'CommentLine' || comment.type === 'SingleLine' || comment.type === 'HashbangComment' || comment.type === 'HTMLOpen' || comment.type === 'HTMLClose';
}

function isCallExpression(node) {
  return node && (node.type === 'CallExpression' || node.type === 'OptionalCallExpression');
}

function isMemberExpression(node) {
  return node && (node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression');
}

const functionParametersCache = new WeakMap();

function getFunctionParameters(node) {
  if (functionParametersCache.has(node)) {
    return functionParametersCache.get(node);
  }

  const parameters = [];

  if (node.this) {
    parameters.push(node.this);
  }

  if (Array.isArray(node.parameters)) {
    parameters.push(...node.parameters);
  } else if (Array.isArray(node.params)) {
    parameters.push(...node.params);
  }

  if (node.rest) {
    parameters.push(node.rest);
  }

  functionParametersCache.set(node, parameters);
  return parameters;
}

const callArgumentsCache = new WeakMap();

function getCallArguments(node) {
  if (callArgumentsCache.has(node)) {
    return callArgumentsCache.get(node);
  }

  let args = node.arguments;

  if (node.type === 'ImportExpression') {
    args = [node.source];

    if (node.attributes) {
      args.push(node.attributes);
    }
  }

  callArgumentsCache.set(node, args);
  return args;
}

function isPrettierIgnoreComment(comment) {
  return comment.value.trim() === 'prettier-ignore' && !comment.unignore;
}

function isCallLikeExpression(node) {
  return isCallExpression(node) || node.type === 'NewExpression' || node.type === 'ImportExpression';
}

function isObjectProperty(node) {
  return node && (node.type === 'ObjectProperty' || node.type === 'Property' && !node.method && node.kind === 'init');
}

module.exports = {
  getFunctionParameters,
  getCallArguments,
  isBlockComment,
  isCallLikeExpression,
  isLineComment,
  isPrettierIgnoreComment,
  isCallExpression,
  isMemberExpression,
  isObjectProperty
};