import monacoEditorPluginModule, {
  type IMonacoEditorOpts
} from 'vite-plugin-monaco-editor'

const isObjectWithDefaultFunction = (
  module: unknown
): module is { default: typeof monacoEditorPluginModule } =>
  module != null &&
  typeof module === 'object' &&
  'default' in module &&
  typeof module.default === 'function'

const editorOpts: IMonacoEditorOpts = {
  languageWorkers: ['json', 'html', 'css', 'typescript', 'editorWorkerService']
}

export default function MonacoEditorPlugin() {
  return isObjectWithDefaultFunction(monacoEditorPluginModule)
    ? monacoEditorPluginModule.default(editorOpts)
    : monacoEditorPluginModule(editorOpts)
}
