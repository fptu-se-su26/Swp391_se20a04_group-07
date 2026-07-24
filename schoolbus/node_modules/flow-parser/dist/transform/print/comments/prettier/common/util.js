'use strict';

const stringWidth = require('string-width');

const getLast = require('../utils/get-last.js');

const notAsciiRegex = /[^\x20-\x7F]/;

function skip(chars) {
  return (text, index, opts) => {
    const backwards = opts && opts.backwards;

    if (index === false) {
      return false;
    }

    const {
      length
    } = text;
    let cursor = index;

    while (cursor >= 0 && cursor < length) {
      const c = text.charAt(cursor);

      if (chars instanceof RegExp) {
        if (!chars.test(c)) {
          return cursor;
        }
      } else if (!chars.includes(c)) {
        return cursor;
      }

      backwards ? cursor-- : cursor++;
    }

    if (cursor === -1 || cursor === length) {
      return cursor;
    }

    return false;
  };
}

const skipWhitespace = skip(/\s/);
const skipSpaces = skip(' \t');
const skipToLineEnd = skip(',; \t');
const skipEverythingButNewLine = skip(/[^\n\r]/);

function skipInlineComment(text, index) {
  if (index === false) {
    return false;
  }

  if (text.charAt(index) === '/' && text.charAt(index + 1) === '*') {
    for (let i = index + 2; i < text.length; ++i) {
      if (text.charAt(i) === '*' && text.charAt(i + 1) === '/') {
        return i + 2;
      }
    }
  }

  return index;
}

function skipTrailingComment(text, index) {
  if (index === false) {
    return false;
  }

  if (text.charAt(index) === '/' && text.charAt(index + 1) === '/') {
    return skipEverythingButNewLine(text, index);
  }

  return index;
}

function skipNewline(text, index, opts) {
  const backwards = opts && opts.backwards;

  if (index === false) {
    return false;
  }

  const atIndex = text.charAt(index);

  if (backwards) {
    if (text.charAt(index - 1) === '\r' && atIndex === '\n') {
      return index - 2;
    }

    if (atIndex === '\n' || atIndex === '\r' || atIndex === '\u2028' || atIndex === '\u2029') {
      return index - 1;
    }
  } else {
    if (atIndex === '\r' && text.charAt(index + 1) === '\n') {
      return index + 2;
    }

    if (atIndex === '\n' || atIndex === '\r' || atIndex === '\u2028' || atIndex === '\u2029') {
      return index + 1;
    }
  }

  return index;
}

function hasNewline(text, index, opts = {}) {
  const idx = skipSpaces(text, opts.backwards ? index - 1 : index, opts);
  const idx2 = skipNewline(text, idx, opts);
  return idx !== idx2;
}

function hasNewlineInRange(text, start, end) {
  for (let i = start; i < end; ++i) {
    if (text.charAt(i) === '\n') {
      return true;
    }
  }

  return false;
}

function isNextLineEmptyAfterIndex(text, index) {
  let oldIdx = null;
  let idx = index;

  while (idx !== oldIdx) {
    oldIdx = idx;
    idx = skipToLineEnd(text, idx);
    idx = skipInlineComment(text, idx);
    idx = skipSpaces(text, idx);
  }

  idx = skipTrailingComment(text, idx);
  idx = skipNewline(text, idx);
  return idx !== false && hasNewline(text, idx);
}

function getNextNonSpaceNonCommentCharacterIndexWithStartIndex(text, idx) {
  let oldIdx = null;
  let nextIdx = idx;

  while (nextIdx !== oldIdx) {
    oldIdx = nextIdx;
    nextIdx = skipSpaces(text, nextIdx);
    nextIdx = skipInlineComment(text, nextIdx);
    nextIdx = skipTrailingComment(text, nextIdx);
    nextIdx = skipNewline(text, nextIdx);
  }

  return nextIdx;
}

function getNextNonSpaceNonCommentCharacterIndex(text, node, locEnd) {
  return getNextNonSpaceNonCommentCharacterIndexWithStartIndex(text, locEnd(node));
}

function getNextNonSpaceNonCommentCharacter(text, node, locEnd) {
  return text.charAt(getNextNonSpaceNonCommentCharacterIndex(text, node, locEnd));
}

function getStringWidth(text) {
  if (!text) {
    return 0;
  }

  if (!notAsciiRegex.test(text)) {
    return text.length;
  }

  return stringWidth(text);
}

function addCommentHelper(node, comment) {
  const comments = node.comments || (node.comments = []);
  comments.push(comment);
  comment.printed = false;
  comment.nodeDescription = describeNodeForDebugging(node);
}

function addLeadingComment(node, comment) {
  comment.leading = true;
  comment.trailing = false;
  addCommentHelper(node, comment);
}

function addDanglingComment(node, comment, marker) {
  comment.leading = false;
  comment.trailing = false;

  if (marker) {
    comment.marker = marker;
  }

  addCommentHelper(node, comment);
}

function addTrailingComment(node, comment) {
  comment.leading = false;
  comment.trailing = true;
  addCommentHelper(node, comment);
}

function isNonEmptyArray(object) {
  return Array.isArray(object) && object.length > 0;
}

function describeNodeForDebugging(node) {
  const nodeType = node.type || node.kind || '(unknown type)';
  let nodeName = String(node.name || node.id && (typeof node.id === 'object' ? node.id.name : node.id) || node.key && (typeof node.key === 'object' ? node.key.name : node.key) || node.value && (typeof node.value === 'object' ? '' : String(node.value)) || node.operator || '');

  if (nodeName.length > 20) {
    nodeName = nodeName.slice(0, 19) + '…';
  }

  return nodeType + (nodeName ? ' ' + nodeName : '');
}

module.exports = {
  getStringWidth,
  getLast,
  getNextNonSpaceNonCommentCharacterIndexWithStartIndex,
  getNextNonSpaceNonCommentCharacterIndex,
  getNextNonSpaceNonCommentCharacter,
  skipWhitespace,
  skipSpaces,
  skipNewline,
  isNextLineEmptyAfterIndex,
  hasNewline,
  hasNewlineInRange,
  addLeadingComment,
  addDanglingComment,
  addTrailingComment,
  isNonEmptyArray
};