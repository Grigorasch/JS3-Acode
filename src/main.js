import plugin from '../plugin.json';
import acorn from "acorn";
const fs = acode.require('fs');

class Tree {
  constructor(pathToFile) {
    this.pathToFile = pathToFile;
    const readFilePromise = this._readFile(this.pathToFile);
    readFilePromise.then(code => {
      this.entities = this._buildTree(code);
    })
        .catch(error => console.log('Неудалось прочитать файл:', error.message) )
  }

  async _readFile(pathToFile) {
    return await fs(pathToFile).readFile();
  }

  _buildTree(code) {
    const entities = {};
    // TODO FIX Добавить автоматический подбор версии ecma на основе настроек в packagee=.json и прочих
    const ast = acorn.parse(code, {ecmaVersion: 2020});
    ast.body.forEach(node => {
      if (node.type === 'VariableDeclaration') {
        node.declarations.forEach(declaration => {
          entities[declaration.id.name] = {
            type: 'variable',
            parent: null
          };
        });
      } else if (node.type === 'FunctionDeclaration') {
        entities[node.id.name] = {
          type: 'function',
          parent: null
        };
      } else if (node.type === 'ClassDeclaration') {
        entities[node.id.name] = {
          type: 'class',
          parent: null
        }
      }
    });
    return entities;
  }
}

class AcodePlugin {

  async init() {
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