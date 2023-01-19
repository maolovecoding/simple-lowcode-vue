/**
 * @Author: 毛毛
 * @Date: 2023-01-19 16:07:38
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-19 16:10:19
 * @description 每个组件的拖拽
 */
import { EditBlocksSchema } from "@/schema/edit/edit.schema";
import { ComputedRef } from "vue";
/**
 * 组件拖拽的hook
 * @param computedFocusOrUnfocusComponents
 * @returns 返回一个鼠标按下的函数
 */
export const useBlockDragger = (
  computedFocusOrUnfocusComponents: ComputedRef<{
    focus: EditBlocksSchema[];
    unfocus: EditBlocksSchema[];
  }>
) => {
  const dragState = {
    startX: 0,
    startY: 0,
    startPos: [] as { top: number; left: number }[]
  };
  const mousedown = (e: MouseEvent) => {
    // 记录每个组件选中时的位置
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    dragState.startPos = computedFocusOrUnfocusComponents.value.focus.map(({ left, top }) => ({
      top,
      left
    }));
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };
  const mousemove = (e: MouseEvent) => {
    const { clientX: moveX, clientY: moveY } = e;
    // 记录水平 垂直方向移动的距离
    const distanceX = moveX - dragState.startX;
    const distanceY = moveY - dragState.startY;
    computedFocusOrUnfocusComponents.value.focus.forEach((block, index) => {
      block.top = dragState.startPos[index].top + distanceY;
      block.left = dragState.startPos[index].top + distanceX;
    });
  };
  const mouseup = (e: MouseEvent) => {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
  };
  return mousedown; // draggerMousedown
};
