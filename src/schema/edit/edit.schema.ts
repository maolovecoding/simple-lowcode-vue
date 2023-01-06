/**
 * @Author: 毛毛
 * @Date: 2023-01-06 23:15:38
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-06 23:28:35
 * 初始化配置
 */
export default {
  container: {
    // 画布配置
    width: "550px",
    height: "550px"
  },
  blocks: [
    // 组件
  ]
} as EditSchema;

export interface EditSchema {
  container: EditContainerSchema;
  blocks: any[];
}

export interface EditContainerSchema {
  width: string;
  height: string;
}
