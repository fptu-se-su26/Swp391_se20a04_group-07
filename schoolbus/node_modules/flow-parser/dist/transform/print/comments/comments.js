"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentPlacement = void 0;
exports.addComment = addComment;
exports.appendCommentToSource = appendCommentToSource;
exports.attachComments = attachComments;
exports.cloneComment = cloneComment;
exports.cloneCommentWithMarkers = cloneCommentWithMarkers;
exports.cloneCommentsToNewNode = cloneCommentsToNewNode;
exports.cloneJSDocCommentsToNewNode = cloneJSDocCommentsToNewNode;
exports.getCommentsForNode = getCommentsForNode;
exports.getLeadingCommentsForNode = getLeadingCommentsForNode;
exports.getTrailingCommentsForNode = getTrailingCommentsForNode;
exports.isAttachedComment = isAttachedComment;
exports.isLeadingComment = isLeadingComment;
exports.isTrailingComment = isTrailingComment;
exports.makeCommentOwnLine = makeCommentOwnLine;
exports.moveCommentsToNewNode = moveCommentsToNewNode;
exports.mutateESTreeASTCommentsForPrettier = mutateESTreeASTCommentsForPrettier;
exports.setCommentsOnNode = setCommentsOnNode;

var _comments = require("./prettier/main/comments");

var _loc = require("./prettier/language-js/loc");

var _printerEstree = _interopRequireDefault(require("./prettier/language-js/printer-estree"));

var _util = require("./prettier/common/util");

var _flowEstree = require("flow-estree");

var _os = require("os");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CommentPlacement = require("flow-enums-runtime").Mirrored(["LEADING_OWN_LINE", "LEADING_INLINE", "TRAILING_OWN_LINE", "TRAILING_INLINE"]);

exports.CommentPlacement = CommentPlacement;

function attachComments(comments, ast, text) {
  (0, _comments.attach)(comments, ast, text, {
    locStart: _loc.locStart,
    locEnd: _loc.locEnd,
    printer: _printerEstree.default
  });
}

function mutateESTreeASTCommentsForPrettier(program, text) {
  let code = text;
  delete program.comments;

  if (program.docblock != null && program.docblock.comment != null) {
    const docblockComment = program.docblock.comment;
    const isDocblockCommentNew = !isAttachedComment(docblockComment);

    if (isDocblockCommentNew) {
      docblockComment.printed = false;
      docblockComment.leading = true;
      docblockComment.trailing = false;
    }

    if (program.body.length > 0) {
      const firstStatement = program.body[0];
      const leadingComments = getLeadingCommentsForNode(firstStatement);

      if (!leadingComments.includes(docblockComment)) {
        setCommentsOnNode(firstStatement, [docblockComment, ...getCommentsForNode(firstStatement)]);

        if (isDocblockCommentNew) {
          code = makeCommentOwnLine(code, docblockComment);
        }
      }
    } else {
      setCommentsOnNode(program, [docblockComment]);
    }
  }

  delete program.docblock;
  return code;
}

function moveCommentsToNewNode(oldNode, newNode) {
  setCommentsOnNode(newNode, getCommentsForNode(oldNode));
  setCommentsOnNode(oldNode, []);
}

function cloneCommentsToNewNode(oldNode, newNode) {
  setCommentsOnNode(newNode, getCommentsForNode(oldNode).map(comment => cloneCommentWithMarkers(comment)));
}

function cloneJSDocCommentsToNewNode(oldNode, newNode) {
  const comments = getCommentsForNode(oldNode).filter(comment => {
    return (0, _flowEstree.isBlockComment)(comment) && comment.value.startsWith('*');
  });
  setCommentsOnNode(newNode, [...getCommentsForNode(newNode), ...comments.map(cloneCommentWithMarkers)]);
}

function setCommentsOnNode(node, comments) {
  node.comments = comments;
}

function getCommentsForNode(node) {
  var _node$comments;

  return (_node$comments = node.comments) != null ? _node$comments : [];
}

function isAttachedComment(comment) {
  return comment.printed === false;
}

function isLeadingComment(comment) {
  return comment.leading === true;
}

function isTrailingComment(comment) {
  return comment.trailing === true;
}

function getLeadingCommentsForNode(node) {
  return getCommentsForNode(node).filter(isLeadingComment);
}

function getTrailingCommentsForNode(node) {
  return getCommentsForNode(node).filter(isTrailingComment);
}

function addComment(node, comment, placement) {
  switch (placement) {
    case CommentPlacement.LEADING_OWN_LINE:
    case CommentPlacement.LEADING_INLINE:
      {
        (0, _util.addLeadingComment)(node, comment);
        break;
      }

    case CommentPlacement.TRAILING_OWN_LINE:
    case CommentPlacement.TRAILING_INLINE:
      {
        (0, _util.addTrailingComment)(node, comment);
        break;
      }
  }
}

function cloneComment(comment) {
  return {
    type: comment.type,
    value: comment.value,
    loc: comment.loc,
    range: comment.range
  };
}

function cloneCommentWithMarkers(comment) {
  return {
    type: comment.type,
    value: comment.value,
    loc: comment.loc,
    range: comment.range,
    leading: isLeadingComment(comment),
    trailing: isTrailingComment(comment)
  };
}

function getFirstNewlineIndex(code) {
  return code.search(/\r\n|\n|\r/);
}

function getFirstNonWhitespaceIndex(code) {
  return code.search(/\S/);
}

function makeCommentOwnLine(code, comment) {
  let newCode = code;
  let firstNewline = getFirstNewlineIndex(code);

  if (firstNewline === -1) {
    newCode += _os.EOL;
    firstNewline = newCode.length;
  }

  comment.range = [firstNewline + 1, firstNewline];
  return newCode;
}

function appendCommentToSource(code, comment, placement) {
  let newCode = code;

  switch (comment.type) {
    case 'Block':
      {
        switch (placement) {
          case CommentPlacement.LEADING_OWN_LINE:
          case CommentPlacement.TRAILING_OWN_LINE:
            {
              newCode = makeCommentOwnLine(code, comment);
              break;
            }

          case CommentPlacement.LEADING_INLINE:
          case CommentPlacement.TRAILING_INLINE:
            {
              let firstNonWhitespace = getFirstNonWhitespaceIndex(code);

              if (firstNonWhitespace === -1) {
                newCode += '$FORCE_INLINE_ON_EMPTY_FILE_TOKEN$;';
                firstNonWhitespace = newCode.length;
                break;
              }

              comment.range = [firstNonWhitespace + 1, firstNonWhitespace];
              break;
            }
        }

        break;
      }

    case 'Line':
      {
        const commentText = `//${comment.value}`;
        const lastChar = newCode[newCode.length - 1];

        if (lastChar !== '\n' && lastChar !== '\r') {
          newCode += _os.EOL;
        }

        if (placement === CommentPlacement.TRAILING_INLINE) {
          newCode += '$FORCE_END_OF_LINE_COMMENT_TOKEN$;';
        }

        const start = newCode.length;
        newCode += commentText;
        const end = newCode.length;
        comment.range = [start, end];
        break;
      }
  }

  return newCode;
}