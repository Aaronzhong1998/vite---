/**
 * @description: 请求头数据类型
 */
export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}

/**
 * @description: switch page
 */
export enum SwitchPage {
  PUSH = 'PUSH',
  REPLACE = 'REPLACE',
  BACK = 'BACK'
}

/**
 * @description: router参数判断 layout样式
 */
export enum LayoutType {
  EQUAL_PADDING,
  CONTENT
}
