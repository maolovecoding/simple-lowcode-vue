import { computed, WritableComputedRef } from "vue";
import { EditBlocksSchema, EditSchema } from "@/schema/edit/edit.schema";

/**
 * @Author: 毛毛
 * @Date: 2023-01-19 15:26:51
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-19 15:37:31
 * @description 获取焦点
 */
/**
 * 获取那些元素被选中，以及点击选中 多选等
 */
export const useBlockFocus = (
  configData: WritableComputedRef<EditSchema | undefined>,
  focusHook: (e: MouseEvent) => void // 拖拽完以后回传拖拽事件给回调的hook
) => {
  // 选中的组件有哪些 选中表示有焦点
  const computedFocusOrUnfocusComponents = computed(() => {
    const focus: EditBlocksSchema[] = [],
      unfocus: EditBlocksSchema[] = [];
    configData.value?.blocks.forEach(block => (block.focus ? focus : unfocus).push(block));
    return { focus, unfocus };
  });
  const clearBlocksFocus = () => {
    configData.value?.blocks.forEach(block => (block.focus = false));
  };
  const handleMouseDown = (e: MouseEvent, block: EditBlocksSchema) => {
    // block上规划一个属性 focus 获取焦点后focus变成true
    if (e.shiftKey) {
      // 按住shift键时可以多选 也可以反选 也就是选中的也可以取消
      block.focus = !block.focus;
    } else {
      if (block.focus) {
        block.focus = false;
      } else {
        clearBlocksFocus();
        block.focus = true;
      }
    }
    focusHook(e);
  };
  // 点击整个容器 清除所有选中的组件
  const handleContainerMousedown = (e: MouseEvent) => {
    clearBlocksFocus();
  };
  return [handleMouseDown, handleContainerMousedown, computedFocusOrUnfocusComponents] as const;
};
