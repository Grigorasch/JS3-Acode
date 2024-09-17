import {getRangeByNodeLocation} from "../utils/range_functions.js";
import {Variable, Import} from './entities_models.js';

class ParsingStrategy {
 parse(node) {
    throw new Error('Abstract method');
  }
}

class VariableStrategy extends ParsingStrategy {
  parse(node) {
    const location = node.loc;
    const type = node.kind;
    const names = node.declarations.map(declarate => ({name: declarate.id.name, loc: declarate.id.loc}));
    return new Variable({names, location, type});
  }
}

class ImportStrategy extends ParsingStrategy {
  parse(node) {
    const range = getRangeByNodeLocation(node.loc);
    const {start, end} = node;
    const position = {start, end};
    const source = node.source.value;
    const identifiers = node.specifiers
    .map(specifier => ({
      name: specifier.local.name,
      location: getRangeByNodeLocation(specifier.local.loc)
    }));
    return identifiers.map(identifier => new Import({range, position, source, identifier}));
  }
}

const importStrategy = new ImportStrategy();
export {importStrategy}