<template>
  <div ref="monacoRef" class="codeEditBox"></div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, reactive, watch } from 'vue'
import { type Marker, editorProps } from './monacoEditorType'
import * as monaco from 'monaco-editor'

const props = defineProps(editorProps)
const emits = defineEmits(['update:codeValue', 'editor-mounted', 'saved'])
const monacoRef = ref()
let monacoCompletionProvide: any = reactive({}) // 存储 monaco.languages.registerCompletionItemProvider 实例，在组件销毁时关闭，避免多次注册导致展示的提示内容重复
let monacoHoverProvider: any = reactive({})
let editor: any // monaco.editor.IStandaloneCodeEditor

// validation settings
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true
})
// compiler options
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2017,
  strict: true,
  allowNonTsExtensions: true
})

const init = () => {
  monacoCompletionProvide = monaco.languages.registerCompletionItemProvider(
    'lua',
    {
      provideCompletionItems: function (model, position) {
        // 获取当前行数
        const line = position.lineNumber

        // 获取当前列数
        const column = position.column

        // 获取当前输入行的内容
        const content = model.getLineContent(line)
        console.log('🚀 ~ 当前行 content', content)

        // 获取起始位置到当前位置的文本内容
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1, // position.lineNumber
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        })
        console.log('🚀 ~ line 94 textUntilPosition', textUntilPosition)

        // 通过下标来获取当前光标后一个内容，即为刚输入的内容
        const sym = content[column - 2]
        console.log('🚀 ~ file: Index.vue ~ line 84 ~ init ~ sym', sym)

        // 获取当前位置的 单词
        const word = model.getWordUntilPosition(position)
        // console.log('🚀 ~ file: Index.vue ~ line 88 ~ init ~ word', word)

        // 插入内容覆盖当前位置的单词
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }
        // console.log('🚀 ~ file: Index.vue ~ line 112 ~ init ~ range', range)

        const suggestions = createCompleters(range, sym)
        // console.log('🚀 ~  suggestions', suggestions)

        return { suggestions }
      },
      triggerCharacters: ['.']
    }
  )

  monacoHoverProvider = monaco.languages.registerHoverProvider('lua', {
    provideHover: function (model, position) {
      if (position === null) return

      const wordAtPosition = model.getWordAtPosition(position)
      if (!wordAtPosition) return

      const luaTip = props.luaTips.find(
        (item) => item.name === wordAtPosition.word
      )
      if (!luaTip) return

      return {
        contents: [{ value: luaTip.detail }]
      }
    }
  })

  editor = monaco.editor.create(monacoRef.value, {
    value: props.codeValue,
    language: props.language,
    theme: props.theme,
    readOnly: props.readOnly,
    ...props.options
  })

  // 监听值的变化
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue() // 给父组件实时返回最新文本

    emits('update:codeValue', value)
  })

  emits('editor-mounted', editor)
}

function createCompleters(range: any, sym: string) {
  const suggestions: any = []

  if (['.'].includes(sym)) {
    // range.startColumn -= 1
    props.luaTips.forEach((tip) => {
      suggestions.push({
        label: tip.name, // 显示的提示内容
        kind: monaco.languages.CompletionItemKind['Function'], // 用来显示提示内容后的不同的图标
        insertText: tip.insertText, // 选择后粘贴到编辑器中的文字
        detail: tip.detail, // 提示内容后的说明
        range: range
      })
    })
  } else {
    // 直接提示，以下为lua语句关键词提示
    const luaStr = [
      'and',
      'break',
      'do',
      'else',
      'elseif',
      'end',
      'false',
      'for',
      'function',
      'if',
      'in',
      'local',
      'nil',
      'not',
      'or',
      'repeat',
      'return',
      'then',
      'true',
      'until',
      'while',
      'goto'
    ]
    for (const i in luaStr) {
      suggestions.push({
        label: luaStr[i], // 显示的提示内容
        kind: monaco.languages.CompletionItemKind['Function'], // 用来显示提示内容后的不同的图标
        insertText: luaStr[i], // 选择后粘贴到编辑器中的文字
        detail: '', // 提示内容后的说明
        range: range
      })
    }

    props.luaTips.forEach((tip) => {
      suggestions.push({
        label: tip.name, // 显示的提示内容
        kind: monaco.languages.CompletionItemKind['Function'], // 用来显示提示内容后的不同的图标
        insertText: tip.insertText, // 选择后粘贴到编辑器中的文字
        detail: tip.detail, // 提示内容后的说明
        range: range
      })
    })
  }

  return suggestions
}

function setMarkers(marker?: Marker) {
  const markerArr = [
    {
      message: marker?.info || '',
      severity: 8, // marker 底部波浪线的信息等级 Hint,Info,Warning,Error
      startLineNumber: marker?.start_line || 0,
      startColumn: marker?.start_column || 0,
      endLineNumber: marker?.end_line || 0,
      endColumn: marker?.end_column || 0
    }
  ]
  monaco.editor.setModelMarkers(editor.getModel(), 'owner', markerArr)
}

// 禁用页面的 ctrl 功能，来禁止 ctrl+s 保存功能
function handleCtrlAndS(e: KeyboardEvent) {
  if (
    e.key == 's' &&
    (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
  ) {
    e.preventDefault()
    console.log('🚀 ~ saved value ====>', editor.getValue())
    emits('saved')
  }
}

watch(
  () => props.options,
  (newValue) => {
    editor.updateOptions(newValue)
  },
  { deep: true }
)

watch(
  () => props.language,
  (newValue) => {
    monaco.editor.setModelLanguage(editor?.getModel(), newValue)
  }
)

onMounted(() => {
  init()
  window.addEventListener('keydown', handleCtrlAndS)
})

onBeforeUnmount(() => {
  monacoCompletionProvide.dispose()
  monacoHoverProvider.dispose()
  editor.dispose() // 使用完成销毁实例
  window.removeEventListener('keydown', handleCtrlAndS)
})

defineExpose({
  editor,
  setMarkers,
  getModel() {
    return editor.getModel()
  }
})
</script>

<style lang="less" scoped>
.wrap {
  position: relative;
  width: v-bind(width);
  height: v-bind(height);
}

.codeEditBox {
  width: v-bind(width);
  height: v-bind(height);
  border: 1px solid @colorBorderSecondary;
}

.monaco-editor .scroll-decoration {
  box-shadow: none;
}

// :global(.codeEditBox .monaco-editor .margin) {
//   background-color: @gray-3 !important;
// }
</style>
