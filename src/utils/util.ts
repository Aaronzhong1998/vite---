/**
 * @Description: 批量删除缓存
 */
export function removeStorage(...keys: string[]) {
  keys.forEach((key) => window.localStorage.removeItem(key))
}
