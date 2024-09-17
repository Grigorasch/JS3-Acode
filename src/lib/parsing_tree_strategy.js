import {Variable} from './entities_models.js';

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

export {VariableStrategy}