const { Range } = ace.require("ace/range");

/**
 * Получает текст в заданном диапазоне из редактора.
 *
 * @param {module:Acode.Range} range - Объект диапазона, который должен содержать свойства
 * @returns {string} Текст, находящийся в указанном диапазоне.
 *
 * @example
 * const range = {
 *   start: { row: 0, column: 0 },
 *   end: { row: 1, column: 5 }
 * };
 * const text = getTextRange(range);
 */
export function getTextRange(range) {
    return editorManager.editor.getSession().getTextRange(range);
}

/**
 * Функция преобразует локацию сущности из координат acorn в Range редактора Ace
 * @param {SourceLocation} nodeLocation - расположение определения сущности полученное от acorn
 * @returns {Range} - Range диапазон в формате Ace
 */
export function getRangeByNodeLocation(nodeLocation) {
    return new Range(
        nodeLocation.start.line - 1,
        nodeLocation.start.column,
        nodeLocation.end.line - 1,
        nodeLocation.end.column
    );
}

/**
 * @typedef {module:Acode.Range}
 * @property {row: number, column: number} start - Начальная позиция диапазона.
 * @property {row: number, column: number} end - Конечная позиция диапазона.
 */