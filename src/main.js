import plugin from '../plugin.json';
import * as acorn from "acorn";
const fs = acode.require('fs');
const { Range } = ace.require("ace/range");
const Url = acode.require('Url');

class Tree {
  constructor(pathToFile) {
    this.pathToFile = pathToFile;

    const readFilePromise = this._readFile(this.pathToFile);
    readFilePromise.then(code => {
      this.entities = this._buildTree(code);
      console.log(this)
    })
        .catch(console.error);
  }

  async _readFile(pathToFile) {
    const buffer = await fs(pathToFile).readFile();
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  }

  _buildTree(code) {
    const entities = {
      variables: [],
    };
    // TODO FIX Добавить автоматический подбор версии ecma на основе настроек в packagee=.json и прочих
    // TODO FIX Добавить автоматический подбор версии типа (модуль или скрипт) на основе настроек в packagee=.json и прочих
    const ast = acorn.parse(code, {ecmaVersion: 2020, sourceType: "module", locations: true,});
    ast.body.forEach(node => {
      switch (node.type) {
        case "VariableDeclaration":
          const varRange = new Range(node.loc.start.line, node.loc.start.column, node.loc.end.line, node.loc.end.column)
          const variable = {
            location: varRange,
            text: editorManager.getSession().getTextRange(varRange),
            name: node.declarations.map(decloration => decloration.id.name)
          }
          entities.variables.push(variable);
          break;
      }
      //
      // if (node.type === 'VariableDeclaration') {
      //   node.declarations.forEach(declaration => {
      //     entities[declaration.id.name] = {
      //       type: 'variable',
      //       parent: null
      //     };
      //   });
      // } else if (node.type === 'FunctionDeclaration') {
      //   entities[node.id.name] = {
      //     type: 'function',
      //     parent: null
      //   };
      // } else if (node.type === 'ClassDeclaration') {
      //   entities[node.id.name] = {
      //     type: 'class',
      //     parent: null
      //   }
      // }
    });
    return entities;
  }
}

class AcodePlugin {

  async init() {
    editorManager.on('switch-file', () => {
      if (Url.extname(editorManager.activeFile.name) !== '.js') return;
      const codeTree = new Tree(editorManager.activeFile.cacheFile);
    })
  }

  async destroy() {

  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    acodePlugin.baseUrl = baseUrl;
    acodePlugin.init($page, cacheFile, cacheFileUrl);
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}