import plugin from '../plugin.json';
import {switchFileListener} from "./utils/editor_listeners";

class AcodePlugin {

  async init($page, cacheFile, cacheFileUrl) {
    editorManager.on("switch-file", await switchFileListener);
  }

  async destroy() {
    editorManager.off("switch-file", switchFileListener);
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