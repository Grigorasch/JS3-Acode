import EntitiesList from "../lib/entities_list.js";

const Url = acode.require("Url");

/**
 * Если активный файл имеет расширение .js, .mjs, .cjs, то на него вешается список сущностей
 */
export function switchFileListener()  {
    if (Url.extname(editorManager.activeFile.name) !== ".js"
        && Url.extname(editorManager.activeFile.name) !== ".mjs"
        && Url.extname(editorManager.activeFile.name) !== ".cjs") return;
    if (editorManager.activeFile.entitiesList) {
        // TODO ADD проверить актуальность списка
    } else {
        editorManager.activeFile.entitiesList = new EntitiesList(editorManager.activeFile);
        // TODO ADD добавить сохранение кеша списка при сохранении файла
    }
}

function saveCacheEntitiesList(editorFile) {

}