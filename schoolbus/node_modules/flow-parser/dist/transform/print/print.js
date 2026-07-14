'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.print = print;

var _mutateESTreeASTForPrettier = _interopRequireDefault(require("../../utils/mutateESTreeASTForPrettier"));

var prettier = _interopRequireWildcard(require("prettier"));

var _comments = require("./comments/comments");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function print(ast, originalCode, prettierOptions = {}, visitorKeys) {
  const program = ast;

  if (program.body.length === 0) {
    var _program$docblock;

    const docblockComment = (_program$docblock = program.docblock) == null ? void 0 : _program$docblock.comment;

    if (docblockComment != null) {
      return '/*' + docblockComment.value + '*/\n';
    }

    return '';
  }

  const codeForPrinting = (0, _comments.mutateESTreeASTCommentsForPrettier)(program, originalCode);
  (0, _mutateESTreeASTForPrettier.default)(program, visitorKeys);
  let pluginParserName = 'flow';
  let pluginParser;
  let pluginPrinter;

  try {
    const prettierHermesPlugin = await Promise.resolve().then(() => _interopRequireWildcard(require('prettier-plugin-hermes-parser')));
    pluginParser = prettierHermesPlugin.parsers.hermes;
    pluginPrinter = prettierHermesPlugin.printers;
    pluginParserName = 'hermes';
  } catch {
    const prettierFlowPlugin = require('prettier/plugins/flow');

    pluginParser = prettierFlowPlugin.parsers.flow;
  }

  return prettier.format(codeForPrinting, { ...prettierOptions,
    parser: pluginParserName,
    requirePragma: false,
    plugins: [{
      parsers: {
        [pluginParserName]: { ...pluginParser,

          parse() {
            return program;
          }

        }
      },
      printers: pluginPrinter
    }]
  });
}