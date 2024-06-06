// 提供后续扩展class类前缀
export default function usePrefix(scope: string) {
  return {
    prefixCls: `${scope}`
  }
}
