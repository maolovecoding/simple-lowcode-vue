/**
 * @Author: 毛毛
 * @Date: 2023-01-17 16:37:08
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-27 21:39:51
 * @description 列表区可以显示所有的物料（默认使用elementPlus的组件）
 * schema key对应的组件映射关系
 */
import { ElButton, ElInput } from "@/components/elementPlus";
import { IEditBlockProp } from "@/schema/edit/edit.schema";
import { createColorProps, createInputProps, createSelectProps } from "./createComponentProps";
export const createEditorConfig = () => {
  const componentList: IComponent[] = [];
  const componentMap = new Map<string, IComponent>();
  return {
    register: (component: IComponent) => {
      // TODO 实现注册
      componentList.push(component);
      componentMap.set(component.key, component);
    },
    componentList,
    componentMap
  };
};
export const registerConfig = createEditorConfig();

registerConfig.register({
  label: "文本",
  preview: () => "预览文本",
  render: ({ props }) => (
    <span style={{ color: props?.color, fontSize: props?.size }}>{props?.text || "实际文本"}</span>
  ),
  key: "text",
  props: {
    text: createInputProps("文本内容"),
    color: createColorProps("字体颜色"),
    size: createSelectProps("字体大小", [
      { label: "14px", value: "14px" },
      { label: "16px", value: "16px" },
      { label: "18px", value: "18px" },
      { label: "20px", value: "20px" }
    ])
  }
});

registerConfig.register({
  label: "按钮",
  preview: () => <ElButton>按钮</ElButton>,
  render: ({ props }) => (
    <ElButton type={props?.type} size={props?.size}>
      {props?.text || "按钮"}
    </ElButton>
  ),
  key: "button",
  props: {
    text: createInputProps("按钮内容"),
    type: createSelectProps("按钮类型", [
      { label: "基础", value: "primary" },
      { label: "成功", value: "success" },
      { label: "失败", value: "fail" },
      { label: "警告", value: "waring" },
      { label: "危险", value: "danger" },
      { label: "文本", value: "text" }
    ]),
    size: createSelectProps("按钮大小", [
      { label: "默认", value: "default" },
      { label: "大", value: "large" },
      // { label: "中等", value: "medium" },
      { label: "小", value: "samll" }
      // { label: "极小", value: "mini" }
    ])
  }
});
registerConfig.register({
  label: "输入框",
  preview: () => <ElInput placeholder="预览输入框" />,
  render: ({ model, props }) => {
    // TODO bug 目前绑定提供的formData的属性值 会出现bug 待解决
    return <ElInput placeholder="渲染输入框" {...model!.default} modelValue={props?.text} />;
  },
  key: "input",
  props: {
    text: createInputProps("文本内容")
  },
  model: {
    default: "绑定字段"
  }
});
export interface IComponent {
  label: string;
  preview: () => JSX.Element | string;
  render: (options: {
    props?: IEditBlockProp;
    model?: Record<keyof any, any>;
  }) => JSX.Element | string;
  key: string;
  props?: IComponentProps;
  model?: IComponentModel;
}
export interface IComponentModel {
  default?: string;
}
export type IComponentPropKeys = keyof IComponentProps;
export interface IComponentProps {
  text?: IProps;
  color?: IProps;
  size?: IProps;
  type?: IProps;
}
export interface IProps {
  label: string;
  type: IPropType;
  options?: IComponentPropOption[];
}
export type IPropType = "input" | "color" | "select";
export interface IComponentPropOption {
  label: string;
  value: string;
}

export interface IRegisterConfig {
  componentList: IComponent[];
  componentMap: Map<string, IComponent>;
  register: (component: IComponent) => void;
}
