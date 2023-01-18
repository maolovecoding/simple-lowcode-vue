/**
 * @Author: 毛毛
 * @Date: 2023-01-17 16:37:08
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-17 17:23:00
 * @description 列表区可以显示所有的物料（默认使用elementPlus的组件）
 * schema key对应的组件映射关系
 */
import { ElButton, ElInput } from "@/components/elementPlus";
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
  render: () => "实际文本",
  key: "text"
});

registerConfig.register({
  label: "按钮",
  preview: () => <ElButton>按钮</ElButton>,
  render: () => <ElButton>按钮</ElButton>,
  key: "button"
});
registerConfig.register({
  label: "输入框",
  preview: () => <ElInput placeholder="预览输入框" />,
  render: () => <ElInput placeholder="渲染输入框" />,
  key: "input"
});
export interface IComponent {
  label: string;
  preview: () => any;
  render: () => any;
  key: string;
}

export interface IRegisterConfig {
  componentList: IComponent[];
  componentMap: Map<string, IComponent>;
  register: (component: IComponent) => void;
}
