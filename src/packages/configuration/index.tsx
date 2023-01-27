/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:45
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-27 19:09:59
 * @description 属性配置
 */
import { defineComponent, inject, reactive, watch } from "vue";
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
import { EditBlocksSchema, EditContainerSchema, IEditBlockProp } from "@/schema/edit/edit.schema";
import deepcopy from "deepcopy";
import { isNoKeysObject } from "../utils";

export default defineComponent({
  props: { ...IConfigurationProps },
  setup(props) {
    // 组件映射 配置信息
    const config = inject(configKey)!;
    const state = reactive({
      editData: {} as EditContainerSchema | EditBlocksSchema
    });
    const reset = () => {
      if (isNoKeysObject(props.block)) {
        // 说明要绑定的是容器的宽高
        state.editData = deepcopy(props.configData.container);
      } else {
        console.log(props.block);
        state.editData = deepcopy(props.block);
      }
    };
    watch(() => props.block, reset, { immediate: true });

    const handleApply = () => {
      if (isNoKeysObject(props.block)) {
        // 更新组件容器（画布）的大小
        props.updateContainer({
          ...props.configData,
          container: state.editData as EditContainerSchema
        });
      } else {
        // 更新组件配置
        props.updateBlock(state.editData as EditBlocksSchema, props.block);
      }
    };
    return () => {
      const renderContent: JSX.Element[] = [];
      if (!Object.keys(props.block).length) {
        // 默认配置
        renderContent.push(
          <>
            <ElFormItem label="容器宽度" style="">
              <ElInputNumber v-model={state.editData.width} max={2000} min={375} />
            </ElFormItem>
            <ElFormItem label="容器高度" style="">
              <ElInputNumber v-model={state.editData.height} max={4000} min={700} />
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
                  input: () => (
                    <ElInput
                      v-model={
                        (state.editData as EditBlocksSchema).props[propName as keyof IEditBlockProp]
                      }
                    />
                  ),
                  color: () => (
                    <ElColorPicker
                      v-model={
                        (state.editData as EditBlocksSchema).props[propName as keyof IEditBlockProp]
                      }
                    />
                  ),
                  select: () => (
                    <ElSelect
                      v-model={
                        (state.editData as EditBlocksSchema).props[propName as keyof IEditBlockProp]
                      }>
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
              <ElButton type="primary" onClick={handleApply}>
                应用
              </ElButton>
              <ElButton onClick={reset}>重置</ElButton>
            </ElFormItem>
          </ElForm>
        </div>
      );
    };
  }
});
