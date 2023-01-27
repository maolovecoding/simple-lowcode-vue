import { IComponentModel } from "@/packages/utils/editor-config";
import { CSSProperties } from "vue";

/**
 * @Author: 毛毛
 * @Date: 2023-01-06 23:15:38
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-27 19:43:13
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
      color: "red",
      props: {
        text: "听雨少年",
        color: "#2ff",
        size: "14px"
      }
    },
    {
      top: 200,
      left: 200,
      zIndex: 10,
      key: "button",
      props: {
        text: "按钮内容",
        type: "primary",
        size: "small"
      }
    },
    {
      top: 500,
      left: 600,
      zIndex: 11,
      key: "input",
      props: {},
      model: {}
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

export interface EditBlocksSchema extends CSSProperties {
  top: number;
  left: number;
  zIndex?: number;
  key: string;
  color?: string;
  alignCenter?: boolean; // 标识是否居中 从物料库第一次拖拽出来的时候应该居中
  focus?: boolean; // 在画布的组件是否获取到了焦点 获取了焦点可以拖拽
  props: IEditBlockProp;
  model: IComponentModel;
}
export interface IEditBlockProp {
  text?: string;
  color?: string;
  size?: "default" | "large" | "small";
  type?: IEditBlockButtonType;
}

export type IEditBlockButtonType =
  | ""
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "text";
