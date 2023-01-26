/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:45
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-26 18:01:35
 * @description 属性配置
 */
import { defineComponent, inject } from "vue";
import {
  ElButton,
  ElColorPicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect
} from "element-plus";
import { configKey } from "../config";
import { IConfigurationProps } from "./index.props";
import { IComponentPropKeys } from "../utils/editor-config";

export default defineComponent({
  props: { ...IConfigurationProps },
  setup(props) {
    // 组件映射 配置信息
    const config = inject(configKey)!;
    return () => {
      const renderContent: JSX.Element[] = [];
      if (!Object.keys(props.block).length) {
        // 默认配置
        renderContent.push(
          <>
            <ElFormItem label="容器宽度" style="">
              <ElInputNumber max={2000} min={375} />
            </ElFormItem>
            <ElFormItem label="容器高度" style="">
              <ElInputNumber max={4000} min={700} />
            </ElFormItem>
          </>
        );
      } else {
        const component = config.componentMap.get(props.block.key);
        if (component && component.props) {
          for (const propName in component.props) {
            const propConfig = component.props[propName as IComponentPropKeys]!;
            renderContent.push(
              <ElFormItem label={propConfig.label}>
                {{
                  input: () => <ElInput />,
                  color: () => <ElColorPicker />,
                  select: () => (
                    <ElSelect>
                      {propConfig.options?.map(option => (
                        <ElOption label={option.label} value={option.value} />
                      ))}
                    </ElSelect>
                  )
                }[propConfig.type]()}
              </ElFormItem>
            );
          }
        }
      }
      return (
        <div>
          <ElForm labelPosition="top">
            {renderContent}
            <ElFormItem>
              <ElButton type="primary">应用</ElButton>
              <ElButton>重置</ElButton>
            </ElFormItem>
          </ElForm>
        </div>
      );
    };
  }
});
