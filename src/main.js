import plugin from "../plugin.json";
import EntitiesList from './lib/entities_list.js';
const fs = acode.require("fs");

const Url = acode.require("Url");

class AcodePlugin {
  async init() {
    editorManager.on("switch-file", () => {
      if (Url.extname(editorManager.activeFile.name) !== ".js") return;
      const codeTree = new EntitiesList(editorManager.activeFile);
    });
  }

  async destroy() {}
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    console.log(cacheFileUrl);
    console.log(cacheFile);
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    acodePlugin.baseUrl = baseUrl;
    acodePlugin.init($page, cacheFile, cacheFileUrl);
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
