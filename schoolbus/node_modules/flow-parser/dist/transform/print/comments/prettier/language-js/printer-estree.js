'use strict';

const handleComments = require('./comments.js');

const {
  isBlockComment,
  isLineComment
} = require('./utils.js');

function canAttachComment(node) {
  return node.type && !isBlockComment(node) && !isLineComment(node) && node.type !== 'EmptyStatement' && node.type !== 'TemplateElement' && node.type !== 'Import' && node.type !== 'TSEmptyBodyFunctionExpression';
}

module.exports = {
  canAttachComment,
  handleComments: {
    avoidAstMutation: true,
    ownLine: handleComments.handleOwnLineComment,
    endOfLine: handleComments.handleEndOfLineComment,
    remaining: handleComments.handleRemainingComment
  },
  getCommentChildNodes: handleComments.getCommentChildNodes
};