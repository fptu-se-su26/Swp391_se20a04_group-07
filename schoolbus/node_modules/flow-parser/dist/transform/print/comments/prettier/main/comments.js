'use strict';

const assert = require('assert');

const {
  hasNewline,
  addLeadingComment,
  addDanglingComment,
  addTrailingComment
} = require('../common/util.js');

const childNodesCache = new WeakMap();

function getSortedChildNodes(node, options, resultArray) {
  if (!node) {
    return;
  }

  const {
    printer,
    locStart,
    locEnd
  } = options;

  if (resultArray) {
    if (printer.canAttachComment && printer.canAttachComment(node)) {
      let i;

      for (i = resultArray.length - 1; i >= 0; --i) {
        if (locStart(resultArray[i]) <= locStart(node) && locEnd(resultArray[i]) <= locEnd(node)) {
          break;
        }
      }

      resultArray.splice(i + 1, 0, node);
      return;
    }
  } else if (childNodesCache.has(node)) {
    return childNodesCache.get(node);
  }

  const childNodes = printer.getCommentChildNodes && printer.getCommentChildNodes(node, options) || typeof node === 'object' && Object.entries(node).filter(([key]) => key !== 'enclosingNode' && key !== 'precedingNode' && key !== 'followingNode' && key !== 'tokens' && key !== 'comments' && key !== 'parent').map(([, value]) => value);

  if (!childNodes) {
    return;
  }

  if (!resultArray) {
    resultArray = [];
    childNodesCache.set(node, resultArray);
  }

  for (const childNode of childNodes) {
    getSortedChildNodes(childNode, options, resultArray);
  }

  return resultArray;
}

function decorateComment(node, comment, options, enclosingNode) {
  const {
    locStart,
    locEnd
  } = options;
  const commentStart = locStart(comment);
  const commentEnd = locEnd(comment);
  const childNodes = getSortedChildNodes(node, options);
  let precedingNode;
  let followingNode;
  let left = 0;
  let right = childNodes.length;

  while (left < right) {
    const middle = left + right >> 1;
    const child = childNodes[middle];
    const start = locStart(child);
    const end = locEnd(child);

    if (start <= commentStart && commentEnd <= end) {
      return decorateComment(child, comment, options, child);
    }

    if (end <= commentStart) {
      precedingNode = child;
      left = middle + 1;
      continue;
    }

    if (commentEnd <= start) {
      followingNode = child;
      right = middle;
      continue;
    }

    throw new Error('Comment location overlaps with node location');
  }

  if (enclosingNode && enclosingNode.type === 'TemplateLiteral') {
    const {
      quasis
    } = enclosingNode;
    const commentIndex = findExpressionIndexForComment(quasis, comment, options);

    if (precedingNode && findExpressionIndexForComment(quasis, precedingNode, options) !== commentIndex) {
      precedingNode = null;
    }

    if (followingNode && findExpressionIndexForComment(quasis, followingNode, options) !== commentIndex) {
      followingNode = null;
    }
  }

  return {
    enclosingNode,
    precedingNode,
    followingNode
  };
}

const returnFalse = () => false;

function attach(comments, ast, text, options) {
  if (!Array.isArray(comments)) {
    return;
  }

  const tiesToBreak = [];
  const {
    locStart,
    locEnd,
    printer: {
      handleComments = {}
    }
  } = options;
  const {
    avoidAstMutation,
    ownLine: handleOwnLineComment = returnFalse,
    endOfLine: handleEndOfLineComment = returnFalse,
    remaining: handleRemainingComment = returnFalse
  } = handleComments;
  const decoratedComments = comments.map((comment, index) => ({ ...decorateComment(ast, comment, options),
    comment,
    text,
    options,
    ast,
    isLastComment: comments.length - 1 === index
  }));

  for (const [index, context] of decoratedComments.entries()) {
    const {
      comment,
      precedingNode,
      enclosingNode,
      followingNode,
      text,
      options,
      ast,
      isLastComment
    } = context;

    if (options.parser === 'json' || options.parser === 'json5' || options.parser === '__js_expression' || options.parser === '__vue_expression') {
      if (locStart(comment) - locStart(ast) <= 0) {
        addLeadingComment(ast, comment);
        continue;
      }

      if (locEnd(comment) - locEnd(ast) >= 0) {
        addTrailingComment(ast, comment);
        continue;
      }
    }

    let args;

    if (avoidAstMutation) {
      args = [context];
    } else {
      comment.enclosingNode = enclosingNode;
      comment.precedingNode = precedingNode;
      comment.followingNode = followingNode;
      args = [comment, text, options, ast, isLastComment];
    }

    if (isOwnLineComment(text, options, decoratedComments, index)) {
      comment.placement = 'ownLine';

      if (handleOwnLineComment(...args)) {} else if (followingNode) {
        addLeadingComment(followingNode, comment);
      } else if (precedingNode) {
        addTrailingComment(precedingNode, comment);
      } else if (enclosingNode) {
        addDanglingComment(enclosingNode, comment);
      } else {
        addDanglingComment(ast, comment);
      }
    } else if (isEndOfLineComment(text, options, decoratedComments, index)) {
      comment.placement = 'endOfLine';

      if (handleEndOfLineComment(...args)) {} else if (precedingNode) {
        addTrailingComment(precedingNode, comment);
      } else if (followingNode) {
        addLeadingComment(followingNode, comment);
      } else if (enclosingNode) {
        addDanglingComment(enclosingNode, comment);
      } else {
        addDanglingComment(ast, comment);
      }
    } else {
      comment.placement = 'remaining';

      if (handleRemainingComment(...args)) {} else if (precedingNode && followingNode) {
        const tieCount = tiesToBreak.length;

        if (tieCount > 0) {
          const lastTie = tiesToBreak[tieCount - 1];

          if (lastTie.followingNode !== followingNode) {
            breakTies(tiesToBreak, text, options);
          }
        }

        tiesToBreak.push(context);
      } else if (precedingNode) {
        addTrailingComment(precedingNode, comment);
      } else if (followingNode) {
        addLeadingComment(followingNode, comment);
      } else if (enclosingNode) {
        addDanglingComment(enclosingNode, comment);
      } else {
        addDanglingComment(ast, comment);
      }
    }
  }

  breakTies(tiesToBreak, text, options);

  if (!avoidAstMutation) {
    for (const comment of comments) {
      delete comment.precedingNode;
      delete comment.enclosingNode;
      delete comment.followingNode;
    }
  }
}

const isAllEmptyAndNoLineBreak = text => !/[\S\n\u2028\u2029]/.test(text);

function isOwnLineComment(text, options, decoratedComments, commentIndex) {
  const {
    comment,
    precedingNode
  } = decoratedComments[commentIndex];
  const {
    locStart,
    locEnd
  } = options;
  let start = locStart(comment);

  if (precedingNode) {
    for (let index = commentIndex - 1; index >= 0; index--) {
      const {
        comment,
        precedingNode: currentCommentPrecedingNode
      } = decoratedComments[index];

      if (currentCommentPrecedingNode !== precedingNode || !isAllEmptyAndNoLineBreak(text.slice(locEnd(comment), start))) {
        break;
      }

      start = locStart(comment);
    }
  }

  return hasNewline(text, start, {
    backwards: true
  });
}

function isEndOfLineComment(text, options, decoratedComments, commentIndex) {
  const {
    comment,
    followingNode
  } = decoratedComments[commentIndex];
  const {
    locStart,
    locEnd
  } = options;
  let end = locEnd(comment);

  if (followingNode) {
    for (let index = commentIndex + 1; index < decoratedComments.length; index++) {
      const {
        comment,
        followingNode: currentCommentFollowingNode
      } = decoratedComments[index];

      if (currentCommentFollowingNode !== followingNode || !isAllEmptyAndNoLineBreak(text.slice(end, locStart(comment)))) {
        break;
      }

      end = locEnd(comment);
    }
  }

  return hasNewline(text, end);
}

function breakTies(tiesToBreak, text, options) {
  const tieCount = tiesToBreak.length;

  if (tieCount === 0) {
    return;
  }

  const {
    precedingNode,
    followingNode,
    enclosingNode
  } = tiesToBreak[0];
  const gapRegExp = options.printer.getGapRegex && options.printer.getGapRegex(enclosingNode) || /^[\s(]*$/;
  let gapEndPos = options.locStart(followingNode);
  let indexOfFirstLeadingComment;

  for (indexOfFirstLeadingComment = tieCount; indexOfFirstLeadingComment > 0; --indexOfFirstLeadingComment) {
    const {
      comment,
      precedingNode: currentCommentPrecedingNode,
      followingNode: currentCommentFollowingNode
    } = tiesToBreak[indexOfFirstLeadingComment - 1];
    assert.strictEqual(currentCommentPrecedingNode, precedingNode);
    assert.strictEqual(currentCommentFollowingNode, followingNode);
    const gap = text.slice(options.locEnd(comment), gapEndPos);

    if (gapRegExp.test(gap)) {
      gapEndPos = options.locStart(comment);
    } else {
      break;
    }
  }

  for (const [i, {
    comment
  }] of tiesToBreak.entries()) {
    if (i < indexOfFirstLeadingComment) {
      addTrailingComment(precedingNode, comment);
    } else {
      addLeadingComment(followingNode, comment);
    }
  }

  for (const node of [precedingNode, followingNode]) {
    if (node.comments && node.comments.length > 1) {
      node.comments.sort((a, b) => options.locStart(a) - options.locStart(b));
    }
  }

  tiesToBreak.length = 0;
}

function findExpressionIndexForComment(quasis, comment, options) {
  const startPos = options.locStart(comment) - 1;

  for (let i = 1; i < quasis.length; ++i) {
    if (startPos < options.locStart(quasis[i])) {
      return i - 1;
    }
  }

  return 0;
}

module.exports = {
  attach
};