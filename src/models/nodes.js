const { Range } = ace.require("ace/range");

/**
 * Узловой элемент. Определяет расположение кода внутри текстового документа.
 * @param {SourceLocation} loc - размещение кода заданное при помощи диапазона строк м столбцов
 * @param {number} start - начальная позиция заданная путем смещения курсора на заданное количество символов
 * @param {number} end - конечная позиция заданная путем смещения курсора на заданное количество символов
 * @constructor
 */
export function CodeNode(loc, start, end) {
  this.range = this._convertLocToRange(loc);
  this.position = {start, end};
}

/**
 * Функция перевода из loc координат в Range
 * @param {SourceLocation} loc - размещение кода заданное при помощи диапазона строк м столбцов
 * @returns {Range} - размещение кода в Range координатах
 * @private
 */
CodeNode.prototype._convertLocToRange = function (loc) {
  if (loc.start === undefined) {}
    return new Range(
        loc.start.line - 1,
        loc.start.column,
        loc.end.line - 1,
        loc.end.column
    );
}

/**
 *
 * @param {Declaration} type - Тип объявляемой сущности
 * @param {SourceLocation} loc - размещение кода заданное при помощи диапазона строк м столбцов
 * @param {number} start - начальная позиция заданная путем смещения курсора на заданное количество символов
 * @param {number} end - конечная позиция заданная путем смещения курсора на заданное количество символов
 * @constructor
 */
export function ParentNode(type, loc, start, end) {
  CodeNode.call(this, loc, start, end);
  this.type = type;
}

/**
 * Объявляемые типы
 * @typedef {VariableDeclaration|FunctionDeclaration|ClassDeclaration} Declaration
 */

ParentNode.prototype = Object.create(CodeNode.prototype)


    //
    // walk.simple(ast, {
    //   Program: node => {
    //     node.body.forEach(child => {
    //       if (child.type === "VariableDeclaration") {
    //         const loc = child.loc;
    //         const kind = child.kind;
    //
    //         walk.simple(child, {
    //           VariableDeclarator(node) {
    //             if (node.id.type === "Identifier") {
    //               const identifier = {
    //                 name: node.id.name,
    //                 loc: node.id.loc
    //               };
    //             variables[node.id.name] = new VairableModel({kind, loc, identifier});
    //             } else if ()
    //           }
    //         });
    //       }
    //     });
    //   },
    //
    //   FunctionDeclaration: addTopLevelEntitie,
    //   VariableDeclaration: addTopLevelEntitie,
    //   ClassDeclaration: addTopLevelEntitie,
    //   ImportDeclaration: addTopLevelEntitie
    // });