/**
 * @Author: 毛毛
 * @Date: 2023-01-06 23:15:38
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-17 14:24:05
 * 初始化配置
 */
export default {
  container: {
    // 画布配置
    width: 2000,
    height: 3350
  },
  blocks: [
    // 组件
    {
      top: 100,
      left: 100,
      zIndex: 1,
      key: "text",
      color: "red"
    },
    {
      top: 200,
      left: 200,
      zIndex: 10,
      key: "button"
    },
    {
      top: 500,
      left: 600,
      zIndex: 11,
      key: "input"
    }
  ]
} as EditSchema;

export interface EditSchema {
  container: EditContainerSchema;
  blocks: EditBlocksSchema[];
}

export interface EditContainerSchema {
  width: string | number;
  height: string | number;
}

export interface EditBlocksSchema {
  top: number;
  left: number;
  zIndex: number;
  key: string;
  color: string;
}
