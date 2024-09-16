import { getTextRange, getRangeByNodeLocation } from "../utils/range_functions.js";
import * as acorn from "acorn";
const fs = acode.require("fs");
const { Range } = ace.require("ace/range");

export default class EntitiesList {
  /**
   * Конструктор создает лист сущностей для заданного файла
   * @param {EditorFile} editorFile - объект EditorFile предоставляющий доступ к открытому файлу для которого создаётся перечень сущностей
   */
  constructor(editorFile) {
    this.editorFile = editorFile;
    const readFilePromise = this._readFile(this.editorFile.isUnsaved ? this.editorFile.cacheFile : this.editorFile.uri);
    readFilePromise
      .then(code => {
        this.entities = this._buildTree(code);
        console.log(this);
      })
      .catch(console.error);
  }

  /**
   * Асинхронно читает файл по указанному пути и возвращает его содержимое в виде строки.
   *
   * @async
   * @param {string} pathToFile - Путь к файлу, который необходимо прочитать.
   * @returns {Promise<string>} - Обещание, которое разрешается в строку, содержащую текст из файла.
   * @throws {Error} - Генерирует ошибку, если файл не может быть прочитан.
   */
  async _readFile(pathToFile) {
    const buffer = await fs(pathToFile).readFile();
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  }

  _buildTree(code) {
    const entities = {
      variables: [],
      functions: [],
      classes: []
    };
    // TODO FIX Добавить автоматический подбор версии ecma на основе настроек в packagee=.json и прочих
    // TODO FIX Добавить автоматический подбор версии типа (модуль или скрипт) на основе настроек в package.json и прочих
    const ast = acorn.parse(code, {
      ecmaVersion: 2020,
      sourceType: "module",
      locations: true
    });
    console.log("ast", ast);
    ast.body.forEach(node => {
      switch (node.type) {
        case "VariableDeclaration":
          const variableDeclaration = this._parseVariableDeclaration(node);
          entities.variables.push(variableDeclaration);
          break;

        case "FunctionDeclaration":
          const functionDeclaration = this._parseFunctionDeclaration(node);
          entities.functions.push(functionDeclaration);
          break;

        case "ClassDeclaration":
          const classDeclaration = this._parseClassDeclaration(node);
          entities.classes.push(classDeclaration);
          break;
      }
    });
    return entities;
  }

  _parseVariableDeclaration(node) {
    const varRange = getRangeByNodeLocation(node.loc);
    const varNamesList = [];
    node.declarations.forEach(declaration => {
      if (declaration.id.type === "Identifier") {
        varNamesList.push(declaration.id.name);
      } else if (declaration.id.type === "ObjectPattern") {
        const varList = declaration.id.properties.map(property => property.key.name);
        varNamesList.push(...varList);
      }
    });

    return {
      name: varNamesList,
      location: varRange,
      text: getTextRange(varRange)
    };
  }

  _parseFunctionDeclaration(node) {
    const funcRange = getRangeByNodeLocation(node.loc);
    return {
      name: node.id.name,
      location: funcRange,
      text: getTextRange(funcRange)
    };
  }

  _parseClassDeclaration(node) {
    const classRange = getRangeByNodeLocation(node.loc);
    return {
      name: node.id.name,
      location: classRange,
      text: getTextRange(classRange)
    };
  }
}
