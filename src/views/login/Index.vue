<template>
  <div>Hello World</div>
  <comp-iconfont-button description="这是一个例子"></comp-iconfont-button>
  <a-button type="primary">a-button</a-button>

  <CodeEditor
    ref="CodeEditorRef"
    v-model="code"
    language="lua"
    width="100%"
    height="calc(100vh - 8.5rem)"
    :luaTips="codeTips"
    @editor-mounted="editorMounted"
    @saved="handleCheckLua"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CodeEditor from '@/components/codeEditor/Index.vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

const code = ref()
const CodeEditorRef = ref<InstanceType<typeof CodeEditor>>()

const codeTips = [
  {
    insertText: 'lua_attr_gen()',
    name: 'lua_attr_gen',
    detail:
      'lua_attr_gen(vertex/edge) -> ret: 描述自定义属性获取方式, 输入参数为一个点或边，函数内部描述如何在该点(或边)上生成一个新的属性，返回值为该新属性的值\n\nINPUTS:\n        vertex/edge - 图中一个点或一条边\n\nOUTPUTS:\n        ret - 返回自定属性的值\n'
  },
  {
    insertText: 'LabelSatisfied()',
    name: 'LabelSatisfied',
    detail:
      'LabelSatisfied(vertex/edge, label) -> ret: 判断一个点或边是否满足label要求，vertex/edge是个具体对象\n\nINPUTS:\n        vertex/edge - 图中一个点或一条边\n        label - 指定的label\n\nOUTPUTS:\n        ret - bool值，返回是否满足，true为满足\n'
  },
  {
    insertText: 'GetAttr()',
    name: 'GetAttr',
    detail:
      'GetAttr(key) -> ret: 获取对象上某个key下的属性值，返回的是一个切片，对应lua中的一个table\n\nINPUTS:\n        key - 待获取属性对应的key值\n\nOUTPUTS:\n        ret - 返回该key的value值，类型为lua中的table\n'
  },
  {
    insertText: 'Satisfy()',
    name: 'Satisfy',
    detail:
      "Satisfy(key, op, ...value) -> ret: 判断对象上的某个key上的value是否满足指定的value要求\n\nINPUTS:\n        key - 待判断属性对应的key值\n        op - 指定方式，目前只支持'__eq'表示相等判断\n        value - 变长参数，指定一组value值，参与op指定的运算\n\nOUTPUTS:\n        ret - bool值，返回是否满足，true为满足\n"
  },
  {
    insertText: 'GetNHopNeighbors()',
    name: 'GetNHopNeighbors',
    detail:
      'GetNHopNeighbors(N) -> ret: 获取一个点的1~N跳的所有邻边，返回一个lua中的迭代器，也就是一个函数，如果N为-1则不限跳数，到最远边界\n\nINPUTS:\n        N - 指定跳数，如果N为-1则不限跳数，到最远边界\n\nOUTPUTS:\n        ret - 返回能遍历对应点的一个迭代器\n'
  },
  {
    insertText: 'GetNthHopNeighbors()',
    name: 'GetNthHopNeighbors',
    detail:
      'GetNthHopNeighbors(N) -> ret: 获取第N跳的所有邻边，返回一个迭代器，这里第N跳指的也是到当前点最短距离为N的点，如果不存在返回空，N为-1也是返回最远的\n\nINPUTS:\n        N - 指定跳数，如果N为-1则不限跳数，到最远边界\n\nOUTPUTS:\n        ret - 返回能遍历对应点的一个迭代器\n'
  },
  {
    insertText: 'GetInEdges()',
    name: 'GetInEdges',
    detail:
      'GetInEdges -> ret: 获取该点的所有入边，返回一个迭代器\n\nINPUTS:\n        None\n\nOUTPUTS:\n        ret - 返回能遍历对应边的一个迭代器\n'
  },
  {
    insertText: 'GetOutEdges()',
    name: 'GetOutEdges',
    detail:
      'GetOutEdges -> ret: 获取该点的所有出边，返回一个迭代器\n\nINPUTS:\n        None\n\nOUTPUTS:\n        ret - 返回能遍历对应边的一个迭代器\n'
  },
  {
    insertText: 'InEdgeNum()',
    name: 'InEdgeNum',
    detail:
      'InEdgeNum -> ret: 获取该点入边数量\n\nINPUTS:\n        None\n\nOUTPUTS:\n        ret - 返回点的入边数量\n'
  },
  {
    insertText: 'OutEdgeNum()',
    name: 'OutEdgeNum',
    detail:
      'OutEdgeNum -> ret: 获取该点出边数量\n\nINPUTS:\n        None\n\nOUTPUTS:\n        ret - 返回点的出边数量\n'
  },
  {
    insertText: 'GetSrcNode()',
    name: 'GetSrcNode',
    detail:
      'GetSrcNode() -> ret: 获取边的源结点\n\nINPUTS:\n        None\n\nOUTPUTS:\n        ret - 返回边的源结点\n'
  },
  {
    insertText: 'GetDstNode()',
    name: 'GetDstNode',
    detail:
      'GetDstNode() -> ret: 获取边的目的结点\n\nINPUTS:\n        None\n\nOUTPUTS:\n        ret - 返回边的目的结点\n'
  }
]

function editorMounted(editor: monaco.editor.IStandaloneCodeEditor) {
  console.log('monaca editor 实例加载完成', editor)
  // console.log('monaca editor 实例 model', editor.getModel())
}

async function handleCheckLua() {
  if (!code.value) {
    CodeEditorRef.value?.setMarkers()
    return
  }

  // try {
  //   const res: any = await apiCheckLua({
  //     datasourceId: props.dataSourceId,
  //     luaCode: activeCustomAttribute.value.code
  //   })

  //   if (res.code === 200) {
  //     message.success($t('ruleDiscovery.excavateConfig.codeIsValidate'))
  //     activeCustomAttribute.value.isValidate = true
  //     updateActiveEditCell('children')
  //     updateEditCustomConfig()
  //     CodeEditorRef.value?.setMarkers()
  //   }
  // } catch (error: any) {
  //   console.log(error)
  //   if (error?.code !== 418) {
  //     return
  //   }

  //   message.error(error.msg)
  //   activeCustomAttribute.value.isValidate = false
  //   if (error.data.start_line == 0) {
  //     // 不知道错误位置，全部标记
  //     error.data.start_line = 1
  //     error.data.start_column = 1
  //     const model: monaco.editor.ITextModel = CodeEditorRef.value?.getModel()

  //     const lineCounts = model.getLineCount()
  //     const column = model.getLineLength(lineCounts)
  //     console.log(
  //       '🚀 ~ file: customAttrModal.vue ~ line 689 ~ handleCheckLua ~ column',
  //       column
  //     )
  //     error.data.end_line = lineCounts
  //     error.data.end_column = column
  //   } else if (error.data.start_line == -1) {
  //     // 错误在最后一行非空位置
  //     const model: monaco.editor.ITextModel = CodeEditorRef.value?.getModel()
  //     const lineCounts = model.getLineCount()

  //     for (let i = lineCounts + 1; --i; i > 0) {
  //       const content = model.getLineContent(i)
  //       if (content) {
  //         error.data.start_line = i
  //         error.data.start_column = 1
  //         error.data.end_line = i
  //         error.data.end_column = content.length + 1
  //         break
  //       }
  //     }
  //   }

  //   CodeEditorRef.value?.setMarkers(error.data)
  // }
}
</script>
