'use strict';

const {
  getLast,
  hasNewline,
  addLeadingComment,
  getNextNonSpaceNonCommentCharacterIndexWithStartIndex,
  getNextNonSpaceNonCommentCharacterIndex,
  hasNewlineInRange,
  addTrailingComment,
  addDanglingComment,
  getNextNonSpaceNonCommentCharacter,
  isNonEmptyArray
} = require('../common/util.js');

const {
  isBlockComment,
  getFunctionParameters,
  isPrettierIgnoreComment,
  isCallLikeExpression,
  getCallArguments,
  isCallExpression,
  isMemberExpression,
  isObjectProperty
} = require('./utils.js');

const {
  locStart,
  locEnd
} = require('./loc.js');

function handleOwnLineComment(context) {
  return [handleIgnoreComments, handleLastFunctionArgComments, handleMemberExpressionComments, handleIfStatementComments, handleWhileComments, handleTryStatementComments, handleClassComments, handleImportSpecifierComments, handleForComments, handleUnionTypeComments, handleMatchOrPatternComments, handleOnlyComments, handleImportDeclarationComments, handleAssignmentPatternComments, handleMethodNameComments, handleLabeledStatementComments].some(fn => fn(context));
}

function handleEndOfLineComment(context) {
  return [handleClosureTypeCastComments, handleLastFunctionArgComments, handleConditionalExpressionComments, handleImportSpecifierComments, handleIfStatementComments, handleWhileComments, handleTryStatementComments, handleClassComments, handleLabeledStatementComments, handleCallExpressionComments, handlePropertyComments, handleOnlyComments, handleTypeAliasComments, handleVariableDeclaratorComments].some(fn => fn(context));
}

function handleRemainingComment(context) {
  return [handleIgnoreComments, handleIfStatementComments, handleWhileComments, handleObjectPropertyAssignment, handleCommentInEmptyParens, handleMethodNameComments, handleOnlyComments, handleCommentAfterArrowParams, handleFunctionNameComments, handleTSMappedTypeComments, handleBreakAndContinueStatementComments, handleTSFunctionTrailingComments].some(fn => fn(context));
}

function addBlockStatementFirstComment(node, comment) {
  const firstNonEmptyNode = (node.body || node.properties).find(({
    type
  }) => type !== 'EmptyStatement');

  if (firstNonEmptyNode) {
    addLeadingComment(firstNonEmptyNode, comment);
  } else {
    addDanglingComment(node, comment);
  }
}

function addBlockOrNotComment(node, comment) {
  if (node.type === 'BlockStatement') {
    addBlockStatementFirstComment(node, comment);
  } else {
    addLeadingComment(node, comment);
  }
}

function handleClosureTypeCastComments({
  comment,
  followingNode
}) {
  if (followingNode && isTypeCastComment(comment)) {
    addLeadingComment(followingNode, comment);
    return true;
  }

  return false;
}

function handleIfStatementComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text
}) {
  if (!enclosingNode || enclosingNode.type !== 'IfStatement' || !followingNode) {
    return false;
  }

  const nextCharacter = getNextNonSpaceNonCommentCharacter(text, comment, locEnd);

  if (nextCharacter === ')') {
    addTrailingComment(precedingNode, comment);
    return true;
  }

  if (precedingNode === enclosingNode.consequent && followingNode === enclosingNode.alternate) {
    if (precedingNode.type === 'BlockStatement') {
      addTrailingComment(precedingNode, comment);
    } else {
      addDanglingComment(enclosingNode, comment);
    }

    return true;
  }

  if (followingNode.type === 'BlockStatement') {
    addBlockStatementFirstComment(followingNode, comment);
    return true;
  }

  if (followingNode.type === 'IfStatement') {
    addBlockOrNotComment(followingNode.consequent, comment);
    return true;
  }

  if (enclosingNode.consequent === followingNode) {
    addLeadingComment(followingNode, comment);
    return true;
  }

  return false;
}

function handleWhileComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text
}) {
  if (!enclosingNode || enclosingNode.type !== 'WhileStatement' || !followingNode) {
    return false;
  }

  const nextCharacter = getNextNonSpaceNonCommentCharacter(text, comment, locEnd);

  if (nextCharacter === ')') {
    addTrailingComment(precedingNode, comment);
    return true;
  }

  if (followingNode.type === 'BlockStatement') {
    addBlockStatementFirstComment(followingNode, comment);
    return true;
  }

  if (enclosingNode.body === followingNode) {
    addLeadingComment(followingNode, comment);
    return true;
  }

  return false;
}

function handleTryStatementComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (!enclosingNode || enclosingNode.type !== 'TryStatement' && enclosingNode.type !== 'CatchClause' || !followingNode) {
    return false;
  }

  if (enclosingNode.type === 'CatchClause' && precedingNode) {
    addTrailingComment(precedingNode, comment);
    return true;
  }

  if (followingNode.type === 'BlockStatement') {
    addBlockStatementFirstComment(followingNode, comment);
    return true;
  }

  if (followingNode.type === 'TryStatement') {
    addBlockOrNotComment(followingNode.finalizer, comment);
    return true;
  }

  if (followingNode.type === 'CatchClause') {
    addBlockOrNotComment(followingNode.body, comment);
    return true;
  }

  return false;
}

function handleMemberExpressionComments({
  comment,
  enclosingNode,
  followingNode
}) {
  if (isMemberExpression(enclosingNode) && followingNode && followingNode.type === 'Identifier') {
    addLeadingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleConditionalExpressionComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text
}) {
  const isSameLineAsPrecedingNode = precedingNode && !hasNewlineInRange(text, locEnd(precedingNode), locStart(comment));

  if ((!precedingNode || !isSameLineAsPrecedingNode) && enclosingNode && (enclosingNode.type === 'ConditionalExpression' || enclosingNode.type === 'TSConditionalType') && followingNode) {
    addLeadingComment(followingNode, comment);
    return true;
  }

  return false;
}

function handleObjectPropertyAssignment({
  comment,
  precedingNode,
  enclosingNode
}) {
  if (isObjectProperty(enclosingNode) && enclosingNode.shorthand && enclosingNode.key === precedingNode && enclosingNode.value.type === 'AssignmentPattern') {
    addTrailingComment(enclosingNode.value.left, comment);
    return true;
  }

  return false;
}

function handleClassComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (enclosingNode && (enclosingNode.type === 'ClassDeclaration' || enclosingNode.type === 'ClassExpression' || enclosingNode.type === 'DeclareClass' || enclosingNode.type === 'DeclareInterface' || enclosingNode.type === 'InterfaceDeclaration' || enclosingNode.type === 'TSInterfaceDeclaration')) {
    if (isNonEmptyArray(enclosingNode.decorators) && !(followingNode && followingNode.type === 'Decorator')) {
      addTrailingComment(getLast(enclosingNode.decorators), comment);
      return true;
    }

    if (enclosingNode.body && followingNode === enclosingNode.body) {
      addBlockStatementFirstComment(enclosingNode.body, comment);
      return true;
    }

    if (followingNode) {
      for (const prop of ['implements', 'extends', 'mixins']) {
        if (enclosingNode[prop] && followingNode === enclosingNode[prop][0]) {
          if (precedingNode && (precedingNode === enclosingNode.id || precedingNode === enclosingNode.typeParameters || precedingNode === enclosingNode.superClass)) {
            addTrailingComment(precedingNode, comment);
          } else {
            addDanglingComment(enclosingNode, comment, prop);
          }

          return true;
        }
      }
    }
  }

  return false;
}

function handleMethodNameComments({
  comment,
  precedingNode,
  enclosingNode,
  text
}) {
  if (enclosingNode && precedingNode && (enclosingNode.type === 'Property' || enclosingNode.type === 'TSDeclareMethod' || enclosingNode.type === 'TSAbstractMethodDefinition') && precedingNode.type === 'Identifier' && enclosingNode.key === precedingNode && getNextNonSpaceNonCommentCharacter(text, precedingNode, locEnd) !== ':') {
    addTrailingComment(precedingNode, comment);
    return true;
  }

  if (precedingNode && enclosingNode && precedingNode.type === 'Decorator' && (enclosingNode.type === 'ClassMethod' || enclosingNode.type === 'ClassProperty' || enclosingNode.type === 'PropertyDefinition' || enclosingNode.type === 'TSAbstractPropertyDefinition' || enclosingNode.type === 'TSAbstractMethodDefinition' || enclosingNode.type === 'TSDeclareMethod' || enclosingNode.type === 'MethodDefinition')) {
    addTrailingComment(precedingNode, comment);
    return true;
  }

  return false;
}

function handleFunctionNameComments({
  comment,
  precedingNode,
  enclosingNode,
  text
}) {
  if (getNextNonSpaceNonCommentCharacter(text, comment, locEnd) !== '(') {
    return false;
  }

  if (precedingNode && enclosingNode && (enclosingNode.type === 'FunctionDeclaration' || enclosingNode.type === 'FunctionExpression' || enclosingNode.type === 'ClassMethod' || enclosingNode.type === 'MethodDefinition' || enclosingNode.type === 'ObjectMethod')) {
    addTrailingComment(precedingNode, comment);
    return true;
  }

  return false;
}

function handleCommentAfterArrowParams({
  comment,
  enclosingNode,
  text
}) {
  if (!(enclosingNode && enclosingNode.type === 'ArrowFunctionExpression')) {
    return false;
  }

  const index = getNextNonSpaceNonCommentCharacterIndex(text, comment, locEnd);

  if (index !== false && text.slice(index, index + 2) === '=>') {
    addDanglingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleCommentInEmptyParens({
  comment,
  enclosingNode,
  text
}) {
  if (getNextNonSpaceNonCommentCharacter(text, comment, locEnd) !== ')') {
    return false;
  }

  if (enclosingNode && (isRealFunctionLikeNode(enclosingNode) && getFunctionParameters(enclosingNode).length === 0 || isCallLikeExpression(enclosingNode) && getCallArguments(enclosingNode).length === 0)) {
    addDanglingComment(enclosingNode, comment);
    return true;
  }

  if (enclosingNode && (enclosingNode.type === 'MethodDefinition' || enclosingNode.type === 'TSAbstractMethodDefinition') && getFunctionParameters(enclosingNode.value).length === 0) {
    addDanglingComment(enclosingNode.value, comment);
    return true;
  }

  return false;
}

function handleLastFunctionArgComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text
}) {
  if (precedingNode && precedingNode.type === 'FunctionTypeParam' && enclosingNode && enclosingNode.type === 'FunctionTypeAnnotation' && followingNode && followingNode.type !== 'FunctionTypeParam') {
    addTrailingComment(precedingNode, comment);
    return true;
  }

  if (precedingNode && (precedingNode.type === 'Identifier' || precedingNode.type === 'AssignmentPattern') && enclosingNode && isRealFunctionLikeNode(enclosingNode) && getNextNonSpaceNonCommentCharacter(text, comment, locEnd) === ')') {
    addTrailingComment(precedingNode, comment);
    return true;
  }

  if (enclosingNode && enclosingNode.type === 'FunctionDeclaration' && followingNode && followingNode.type === 'BlockStatement') {
    const functionParamRightParenIndex = (() => {
      const parameters = getFunctionParameters(enclosingNode);

      if (parameters.length > 0) {
        return getNextNonSpaceNonCommentCharacterIndexWithStartIndex(text, locEnd(getLast(parameters)));
      }

      const functionParamLeftParenIndex = getNextNonSpaceNonCommentCharacterIndexWithStartIndex(text, locEnd(enclosingNode.id));
      return functionParamLeftParenIndex !== false && getNextNonSpaceNonCommentCharacterIndexWithStartIndex(text, functionParamLeftParenIndex + 1);
    })();

    if (locStart(comment) > functionParamRightParenIndex) {
      addBlockStatementFirstComment(followingNode, comment);
      return true;
    }
  }

  return false;
}

function handleImportSpecifierComments({
  comment,
  enclosingNode
}) {
  if (enclosingNode && enclosingNode.type === 'ImportSpecifier') {
    addLeadingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleLabeledStatementComments({
  comment,
  enclosingNode
}) {
  if (enclosingNode && enclosingNode.type === 'LabeledStatement') {
    addLeadingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleBreakAndContinueStatementComments({
  comment,
  enclosingNode
}) {
  if (enclosingNode && (enclosingNode.type === 'ContinueStatement' || enclosingNode.type === 'BreakStatement') && !enclosingNode.label) {
    addTrailingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleCallExpressionComments({
  comment,
  precedingNode,
  enclosingNode
}) {
  if (isCallExpression(enclosingNode) && precedingNode && enclosingNode.callee === precedingNode && enclosingNode.arguments.length > 0) {
    addLeadingComment(enclosingNode.arguments[0], comment);
    return true;
  }

  return false;
}

function handleUnionTypeComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (enclosingNode && (enclosingNode.type === 'UnionTypeAnnotation' || enclosingNode.type === 'TSUnionType')) {
    if (isPrettierIgnoreComment(comment)) {
      followingNode.prettierIgnore = true;
      comment.unignore = true;
    }

    if (precedingNode) {
      addTrailingComment(precedingNode, comment);
      return true;
    }

    return false;
  }

  if (followingNode && (followingNode.type === 'UnionTypeAnnotation' || followingNode.type === 'TSUnionType') && isPrettierIgnoreComment(comment)) {
    followingNode.types[0].prettierIgnore = true;
    comment.unignore = true;
  }

  return false;
}

function handleMatchOrPatternComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (enclosingNode && enclosingNode.type === 'MatchOrPattern') {
    if (isPrettierIgnoreComment(comment)) {
      followingNode.prettierIgnore = true;
      comment.unignore = true;
    }

    if (precedingNode) {
      addTrailingComment(precedingNode, comment);
      return true;
    }

    return false;
  }

  if (followingNode && followingNode.type === 'MatchOrPattern' && isPrettierIgnoreComment(comment)) {
    followingNode.types[0].prettierIgnore = true;
    comment.unignore = true;
  }

  return false;
}

function handlePropertyComments({
  comment,
  enclosingNode
}) {
  if (isObjectProperty(enclosingNode)) {
    addLeadingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleOnlyComments({
  comment,
  enclosingNode,
  followingNode,
  ast,
  isLastComment
}) {
  if (ast && ast.body && ast.body.length === 0) {
    if (isLastComment) {
      addDanglingComment(ast, comment);
    } else {
      addLeadingComment(ast, comment);
    }

    return true;
  }

  if (enclosingNode && enclosingNode.type === 'Program' && enclosingNode.body.length === 0 && !isNonEmptyArray(enclosingNode.directives)) {
    if (isLastComment) {
      addDanglingComment(enclosingNode, comment);
    } else {
      addLeadingComment(enclosingNode, comment);
    }

    return true;
  }

  if (followingNode && followingNode.type === 'Program' && followingNode.body.length === 0 && enclosingNode && enclosingNode.type === 'ModuleExpression') {
    addDanglingComment(followingNode, comment);
    return true;
  }

  return false;
}

function handleForComments({
  comment,
  enclosingNode
}) {
  if (enclosingNode && (enclosingNode.type === 'ForInStatement' || enclosingNode.type === 'ForOfStatement')) {
    addLeadingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleImportDeclarationComments({
  comment,
  precedingNode,
  enclosingNode,
  text
}) {
  if (precedingNode && precedingNode.type === 'ImportSpecifier' && enclosingNode && enclosingNode.type === 'ImportDeclaration' && hasNewline(text, locEnd(comment))) {
    addTrailingComment(precedingNode, comment);
    return true;
  }

  return false;
}

function handleAssignmentPatternComments({
  comment,
  enclosingNode
}) {
  if (enclosingNode && enclosingNode.type === 'AssignmentPattern') {
    addLeadingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleTypeAliasComments({
  comment,
  enclosingNode
}) {
  if (enclosingNode && enclosingNode.type === 'TypeAlias') {
    addLeadingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleVariableDeclaratorComments({
  comment,
  enclosingNode,
  followingNode
}) {
  if (enclosingNode && (enclosingNode.type === 'VariableDeclarator' || enclosingNode.type === 'AssignmentExpression') && followingNode && (followingNode.type === 'ObjectExpression' || followingNode.type === 'ArrayExpression' || followingNode.type === 'TemplateLiteral' || followingNode.type === 'TaggedTemplateExpression' || isBlockComment(comment))) {
    addLeadingComment(followingNode, comment);
    return true;
  }

  return false;
}

function handleTSFunctionTrailingComments({
  comment,
  enclosingNode,
  followingNode,
  text
}) {
  if (!followingNode && enclosingNode && (enclosingNode.type === 'TSMethodSignature' || enclosingNode.type === 'TSDeclareFunction' || enclosingNode.type === 'TSAbstractMethodDefinition') && getNextNonSpaceNonCommentCharacter(text, comment, locEnd) === ';') {
    addTrailingComment(enclosingNode, comment);
    return true;
  }

  return false;
}

function handleIgnoreComments({
  comment,
  enclosingNode,
  followingNode
}) {
  if (isPrettierIgnoreComment(comment) && enclosingNode && enclosingNode.type === 'TSMappedType' && followingNode && followingNode.type === 'TSTypeParameter' && followingNode.constraint) {
    enclosingNode.prettierIgnore = true;
    comment.unignore = true;
    return true;
  }
}

function handleTSMappedTypeComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (!enclosingNode || enclosingNode.type !== 'TSMappedType') {
    return false;
  }

  if (followingNode && followingNode.type === 'TSTypeParameter' && followingNode.name) {
    addLeadingComment(followingNode.name, comment);
    return true;
  }

  if (precedingNode && precedingNode.type === 'TSTypeParameter' && precedingNode.constraint) {
    addTrailingComment(precedingNode.constraint, comment);
    return true;
  }

  return false;
}

function isRealFunctionLikeNode(node) {
  return node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration' || node.type === 'ObjectMethod' || node.type === 'ClassMethod' || node.type === 'TSDeclareFunction' || node.type === 'TSCallSignatureDeclaration' || node.type === 'TSConstructSignatureDeclaration' || node.type === 'TSMethodSignature' || node.type === 'TSConstructorType' || node.type === 'TSFunctionType' || node.type === 'TSDeclareMethod';
}

function getCommentChildNodes(node, options) {
  if ((options.parser === 'typescript' || options.parser === 'flow' || options.parser === 'espree' || options.parser === 'meriyah' || options.parser === '__babel_estree') && node.type === 'MethodDefinition' && node.value && node.value.type === 'FunctionExpression' && getFunctionParameters(node.value).length === 0 && !node.value.returnType && !isNonEmptyArray(node.value.typeParameters) && node.value.body) {
    return [...(node.decorators || []), node.key, node.value.body];
  }
}

function isTypeCastComment(comment) {
  return isBlockComment(comment) && comment.value[0] === '*' && /@type\b/.test(comment.value);
}

module.exports = {
  handleOwnLineComment,
  handleEndOfLineComment,
  handleRemainingComment,
  getCommentChildNodes
};