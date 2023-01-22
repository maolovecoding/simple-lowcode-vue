import { computed, Ref, ref, WritableComputedRef } from "vue";
import { EditBlocksSchema, EditSchema } from "@/schema/edit/edit.schema";

/**
 * @Author: 毛毛
 * @Date: 2023-01-19 15:26:51
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-22 19:26:37
 * @description 获取焦点
 */
/**
 * 获取那些元素被选中，以及点击选中 多选等
 */
export const useBlockFocus = (
  configData: WritableComputedRef<EditSchema | undefined>,
  previewRef: Ref<boolean>,
  focusHook: (e: MouseEvent) => void // 拖拽完以后回传拖拽事件给回调的hook
) => {
  const selectedIndex = ref(-1); // 表示没有一个组件被选中
  // 所有选中的组件里面 最后一个被选中的
  const lastSelectedBlock = computed(() => configData.value?.blocks[selectedIndex.value]);
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
  const handleMouseDown = (e: MouseEvent, block: EditBlocksSchema, index: number) => {
    if (previewRef.value) return;
    // block上规划一个属性 focus 获取焦点后focus变成true
    if (e.shiftKey) {
      if (computedFocusOrUnfocusComponents.value.focus.length <= 1) {
        block.focus = true;
      }
      // 按住shift键时可以多选 也可以反选 也就是选中的也可以取消
      else block.focus = !block.focus;
    } else {
      if (block.focus) {
        // block.focus = false; // 已经是focus的时候 只有点击画布才会取消
      } else {
        clearBlocksFocus();
        block.focus = true;
      }
    }
    selectedIndex.value = index;
    focusHook(e);
  };
  // 点击整个容器 清除所有选中的组件
  const handleContainerMousedown = (e: MouseEvent) => {
    if (previewRef.value) return;
    clearBlocksFocus();
    selectedIndex.value = -1;
  };
  return [
    handleMouseDown,
    handleContainerMousedown,
    computedFocusOrUnfocusComponents,
    lastSelectedBlock,
    clearBlocksFocus
  ] as const;
};
