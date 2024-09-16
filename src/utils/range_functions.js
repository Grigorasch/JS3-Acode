const { Range } = ace.require("ace/range");

/**
 * @typedef {Object} Range
 * @property {Object} start - Начальная позиция диапазона.
 * @property {number} start.row - Индекс строки, с которой начинается диапазон (0 - первая строка).
 * @property {number} start.column - Индекс столбца, с которого начинается диапазон (0 - первый столбец).
 * @property {Object} end - Конечная позиция диапазона.
 * @property {number} end.row - Индекс строки, на которой заканчивается диапазон.
 * @property {number} end.column - Индекс столбца, на котором заканчивается диапазон.
 */

/**
 * Получает текст в заданном диапазоне из редактора.
 *
 * @param {Range} range - Объект диапазона, который должен содержать свойства
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
 function getRangeByNodeLocation(nodeLocation) {
  return new Range(
    nodeLocation.start.line - 1,
    nodeLocation.start.column,
    nodeLocation.end.line - 1,
    nodeLocation.end.column
  );
}

export {getRangeByNodeLocation};
