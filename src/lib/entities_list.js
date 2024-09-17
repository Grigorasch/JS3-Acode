import {getRangeByNodeLocation, getTextRange} from "../utils/range_functions.js";
import * as acorn from "acorn";

const fs = acode.require("fs");

/**
 * Класс для создания и взаимодействия со списком сущностей
 */
export default class EntitiesList {
    /**
     * @param {EditorFile} editorFile - объект EditorFile предоставляющий доступ к открытому файлу для которого создаётся перечень сущностей
     */
    constructor(editorFile) {
        this.editorFile = editorFile;
        // Получение текстового содержимого по пути файла, если есть несохраненные изменения, то по пути кеша
        const readFilePromise = this._readFile(this.editorFile.isUnsaved ? this.editorFile.cacheFile : this.editorFile.uri);
        readFilePromise.then(code => {
            // Построение списка
            this.entities = this._buildList(code);
            console.log(this);
        }).catch(console.error);
    }

    /**
     * Асинхронно читает файл по указанному пути и возвращает его содержимое в виде строки.
     * @async
     * @param {string} pathToFile - Путь к файлу, который необходимо прочитать.
     * @returns {Promise<string>} - Обещание, которое разрешается в строку, содержащую текст из файла.
     * @throws {Error} - Генерирует ошибку, если файл не может быть прочитан.
     * @private
     */
    async _readFile(pathToFile) {
        const buffer = await fs(pathToFile).readFile();
        const decoder = new TextDecoder();
        return decoder.decode(buffer);
    }

    /**
     * Парсит код и извлекает список основных сущностей
     * @param {string} code - JavaScript код для излечения сущностй
     * @returns {{variables: Object[], functions: Object[], classes: Object[]}} - Списки извлеченных сущностей
     * @private
     */
    _buildList(code) {
        const entities = {
            imports: [], exports: [], variables: [], functions: [], classes: []
        };

        // TODO FIX Добавить автоматический подбор версии ecma на основе настроек в package.json и прочих
        // TODO FIX Добавить автоматический подбор версии типа (модуль или скрипт) на основе настроек в package.json и прочих
        const ast = acorn.parse(code, {
            ecmaVersion: 2020, sourceType: "module", locations: true
        });
        console.log("ast", ast);
        ast.body.forEach(node => {
            // TODO ADD Добавить функии генератор
            switch (node.type) {
                case "VariableDeclaration":
                    const variableDeclaration = this._parseVariableDeclaration(node);
                    entities.variables.push(variableDeclaration);
                    break;

                    // TODO ADD добавить обработку коментариев
                case "FunctionDeclaration":
                    const functionDeclaration = this._parseFunctionDeclaration(node);
                    entities.functions.push(functionDeclaration);
                    break;

                    // TODO ADD Добавить обработку методов класса
                case "ClassDeclaration":
                    const classDeclaration = this._parseClassDeclaration(node);
                    entities.classes.push(classDeclaration);
                    break;
            }
        });
        return entities;
    }

    /**
     * Извлекает сущность импорта из узла синтаксического дерева
     * @param {Statement} node - узел синтаксического дерева
     * @returns {{name: {name: string, location: Range}[], location: Range, text: string, source}}
     * @private
     */
    _parseImportDeclaration(node) {
        const importRange = getRangeByNodeLocation(node.loc);
        const importNames = node.specifiers.map(specifier => ({
            name: specifier.local.name,
            location: getRangeByNodeLocation(specifier.local.loc)
        }));
        return {
            name: [...importNames],
            location: importRange,
            text: getTextRange(importRange),
            source: node.source.value
        };
    }

    /**
     * Извлекает сущность экспорта из узла синтаксического дерева
     * @param {Statement} node - узел синтаксического дерева
     * @returns {{name: {name: string, location: Range}[], location: Range, text: string, source}}
     * @private
     */
    _parseExportDeclaration(node) {
        const exportRange = getRangeByNodeLocation(node.loc);
        // if ()
    }

    /**
     * Извлекает сущность переменной из узла синтаксического дерева
     * @param {Statement} node - узел синтаксического дерева
     * @returns {{name: string[], location: Range, text: string}} - извлеченная сущность
     * @private
     */
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
            name: varNamesList, location: varRange, text: getTextRange(varRange)
        };
    }

    /**
     * Извлекает сущность функции из узла синтаксического дерева
     * @param {Statement} node - узел синтаксического дерева
     * @returns {{name: string, location: Range, text: string}} - извлеченная сущность
     * @private
     */
    _parseFunctionDeclaration(node) {
        const funcRange = getRangeByNodeLocation(node.loc);
        return {
            name: node.id.name, location: funcRange, text: getTextRange(funcRange)
        };
    }

    /**
     * Извлекает сущность класса из узла синтаксического дерева
     * @param {Statement} node - узел синтаксического дерева
     * @returns {{name: string, location: Range, text: string}} - извлеченная сущность
     * @private
     */
    _parseClassDeclaration(node) {
        const classRange = getRangeByNodeLocation(node.loc);
        return {
            name: node.id.name, location: classRange, text: getTextRange(classRange)
        };
    }
}

/**
 * @module Acode
 */
/**
 * Класс для создания экземпляра открытого файла. Предоставляем доступ к управлению
 * @interface module:Acode.EditorFile
 * @property {string} uri - путь к файлу
 * @property {string} [cacheFile] - путь к файлу с кешем файла (только для чтения)
 * @property {boolean} isUnsaved - логическое свойство, указывающее, что файл не сохранен.
 */