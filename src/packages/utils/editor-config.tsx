/**
 * @Author: 毛毛
 * @Date: 2023-01-17 16:37:08
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-28 19:53:59
 * @description 列表区可以显示所有的物料（默认使用elementPlus的组件）
 * schema key对应的组件映射关系
 */
import { ElButton, ElInput, ELRange, ElSelect } from "@/components/elementPlus";
import { IEditBlockProp } from "@/schema/edit/edit.schema";
import { ElOption } from "element-plus";
import { ref } from "vue";
import {
  createColorProps,
  createInputProps,
  createSelectProps,
  createTableProp
} from "./createComponentProps";
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
  render: ({ props, size }) => (
    <ElButton
      type={props?.type}
      size={props?.size}
      style={{ height: size?.height + "px", width: size?.width + "px" }}>
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
  },
  resize: {
    width: true,
    height: true
  }
});
registerConfig.register({
  label: "输入框",
  preview: () => <ElInput placeholder="预览输入框" />,
  render: ({ model, size }) => {
    return (
      <ElInput
        placeholder="渲染输入框"
        {...model?.default}
        style={{ height: size?.height + "px", width: size?.width + "px" }}
      />
    );
  },
  key: "input",
  props: {
    text: createInputProps("文本内容")
  },
  model: {
    default: "绑定字段"
  },
  resize: {
    width: true // 宽度可以拉伸
  }
});
registerConfig.register({
  label: "范围选择器",
  preview: () => <ELRange />,
  render: ({ model, props }) => {
    return (
      <ELRange
        {...{
          start: model?.start.modelValue,
          "onUpdate:start": model?.start["onUpdate:modelValue"],
          end: model?.end.modelValue,
          "onUpdate:end": model?.end["onUpdate:modelValue"]
        }}
      />
    );
  },
  key: "range",
  model: {
    start: "绑定字段start",
    end: "绑定字段end"
  }
});
registerConfig.register({
  label: "下拉框",
  preview: () => <ElSelect />,
  render: ({ model, props }) => {
    return (
      <ElSelect
        {...model?.default}
        v-slots={{
          default: () =>
            (props?.options || []).map((opt, index) => <ElOption key={index} {...opt} />)
        }}
      />
    );
  },
  key: "select",
  model: {
    default: "默认字段"
  },
  props: {
    // options: {label, type, table }
    options: createTableProp("下拉选择框", {
      options: [
        {
          label: "显示值",
          field: "label"
        },
        {
          label: "绑定值",
          field: "value"
        }
      ],
      key: "label" // 显示给用户的值
    })
  }
});

export interface IComponent {
  label: string;
  preview: () => JSX.Element | string;
  render: (options: {
    props?: IEditBlockProp;
    model?: Record<keyof any, any>;
    size?: { width: number; height: number };
  }) => JSX.Element | string;
  key: string;
  props?: IComponentProps;
  model?: IComponentModel;
  resize?: IComponentResize; // 组件是否可以自定义大小 拉伸
}
export interface IComponentModel {
  default?: string;
  [key: keyof any]: any;
}
export type IComponentPropKeys = keyof IComponentProps;
export interface IComponentProps {
  text?: IProps;
  color?: IProps;
  size?: IProps;
  type?: IProps;
  options?: IProps;
}
export interface IComponentResize {
  width?: boolean;
  height?: boolean;
}
export interface IProps {
  label: string;
  type: IPropType;
  options?: IComponentPropOption[];
  table?: any;
}
export type IPropType = "input" | "color" | "select" | "table";
export interface IComponentPropOption {
  label: string;
  value: string;
}

export interface IRegisterConfig {
  componentList: IComponent[];
  componentMap: Map<string, IComponent>;
  register: (component: IComponent) => void;
}
