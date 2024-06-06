import { PropType } from 'vue'

export type Theme = 'vs' | 'hc-black' | 'vs-dark'
export type FoldingStrategy = 'auto' | 'indentation'
export type RenderLineHighlight = 'all' | 'line' | 'none' | 'gutter'
export interface Options {
  automaticLayout: boolean // 自适应布局
  folding?: boolean // 是否启用代码折叠
  foldingStrategy: FoldingStrategy // 折叠方式  auto | indentation
  renderLineHighlight: RenderLineHighlight // 行亮
  selectOnLineNumbers: boolean // 显示行号
  minimap: { enabled: boolean } // 关闭小地图
  fontSize: number // 字体大小
  scrollBeyondLastLine: boolean // 取消代码后面一大段空白
  overviewRulerBorder: boolean // 不要滚动条的边框
  contextmenu?: true // 启用右键菜单
  // readOnly: boolean // 只读, 通过 props 传入
}

export interface LuaTip {
  name: string
  insertText: string
  detail: string
}

export interface Marker {
  info: string
  start_line: number
  start_column: number
  end_line: number
  end_column: number
  severity?: number // marker 底部波浪线的信息等级 1 Hint,2 Info,4 Warning,8 Error
}

export const editorProps = {
  codeValue: {
    type: String as PropType<string>,
    default: void 0
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '100%'
  },
  height: {
    type: [String, Number] as PropType<string | number>,
    default: '100%'
  },
  language: {
    type: String as PropType<string>,
    default: 'javascript'
  },
  theme: {
    type: String as PropType<Theme>,
    validator(value: string): boolean {
      return ['vs', 'hc-black', 'vs-dark'].includes(value)
    },
    default: 'vs'
  },
  readOnly: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  options: {
    type: Object as PropType<Options>,
    default: function () {
      return {
        automaticLayout: true,
        foldingStrategy: 'indentation',
        renderLineHighlight: 'all',
        selectOnLineNumbers: true,
        minimap: { enabled: true },
        fontSize: 16,
        scrollBeyondLastLine: false,
        overviewRulerBorder: false
      }
    }
  },
  luaTips: {
    type: Array as PropType<LuaTip[]>,
    default: () => []
  }
}
