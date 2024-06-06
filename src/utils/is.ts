const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isUnNull(val: unknown): val is null {
  return !isNull(val)
}

export function isUnNullAndisDef(val: unknown): val is null | undefined {
  return isDef(val) && isUnNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return (
    is(val, 'Promise') &&
    isObject(val) &&
    isFunction(val.then) &&
    isFunction(val.catch)
  )
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

export function isFunction(val: unknown) {
  return typeof val === 'function'
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

/*
 * @Description: 判断两个数据是否相同
 */
interface ObjectType<T> {
  [key: string]: T
}
export function isObjectLike(value: any): value is ObjectType<any> {
  /**
   * isObjectLike({}) => true
   * isObjectLike([1, 2, 3]) => true
   * isObjectLike(Function) => false
   * isObjectLike(null) => false
   */
  return value !== null && typeof value === 'object'
}
export function isArrayLike(value: any): boolean {
  /**
   * isArrayLike([1, 2, 3]) => true
   * isArrayLike(document.body.children) => true
   * isArrayLike('abc') => true
   * isArrayLike(Function) => false
   */
  return value !== null && typeof value !== 'function' && isFinite(value.length)
}
/**
 * @description:
 * @param {any} value
 * @param {any} other
 * @return {boolean} bo
 */
export function isEqual(value: any, other: any): boolean {
  if (value === other) {
    return true
  }
  if (!value || !other) {
    return false
  }
  if (isString(value) || isString(other)) {
    return false
  }
  if (isArrayLike(value) || isArrayLike(other)) {
    if (value.length !== other.length) {
      return false
    }
    let rst = true
    for (let i = 0; i < value.length; i++) {
      rst = isEqual(value[i], other[i])
      if (!rst) {
        break
      }
    }
    return rst
  }
  if (isObjectLike(value) || isObjectLike(other)) {
    const valueKeys = Object.keys(value)
    const otherKeys = Object.keys(other)
    if (valueKeys.length !== otherKeys.length) {
      return false
    }
    let rst = true
    for (const element of valueKeys) {
      rst = isEqual(value[element], other[element])
      if (!rst) {
        break
      }
    }
    return rst
  }
  return false
}
