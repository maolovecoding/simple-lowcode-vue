/**
 * @Author: 毛毛
 * @Date: 2023-01-19 16:07:38
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-20 11:55:43
 * @description 每个组件的拖拽
 */
import { EditBlocksSchema, EditSchema } from "@/schema/edit/edit.schema";
import { ComputedRef, reactive, WritableComputedRef } from "vue";

export interface ILineY {
  showTop: number; // 什么时候显示顶部的辅助线
  top: number;
}
export interface ILineX {
  showLeft: number;
  left: number;
}
export interface ILines {
  x: ILineX[];
  y: ILineY[];
}
/**
 * 组件拖拽的hook
 * @param computedFocusOrUnfocusComponents
 * @returns 返回一个鼠标按下的函数
 */
export const useBlockDragger = (
  computedFocusOrUnfocusComponents: ComputedRef<{
    focus: EditBlocksSchema[];
    unfocus: EditBlocksSchema[];
  }>,
  lastSelectedBlock: ComputedRef<EditBlocksSchema | undefined>, // 拖拽的组件
  configData: WritableComputedRef<EditSchema | undefined>
) => {
  let dragState = {
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    startPos: [] as { top: number; left: number }[],
    // 记录辅助线 x 距离画布左侧的距离
    lines: {} as ILines // 来做辅助线
  };
  // 辅助线
  const markline = reactive<{ x: number; y: number }>({
    x: -1,
    y: -1
  });
  const mousedown = (e: MouseEvent) => {
    const { width: blockWidth, height: blockHeight } = lastSelectedBlock.value!;
    // 记录每个组件选中时的位置
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: lastSelectedBlock.value!.left,
      startTop: lastSelectedBlock.value!.top,
      startPos: computedFocusOrUnfocusComponents.value.focus.map(({ left, top }) => ({
        top,
        left
      })),
      lines: (() => {
        const { unfocus } = computedFocusOrUnfocusComponents.value!;
        // 用未选中的组件来做辅助线的辅助等
        const lines: ILines = { x: [], y: [] };
        [
          ...unfocus,
          {
            // 整个容器也需要支持辅助线
            ...configData.value!.container,
            top: 0,
            left: 0
          }
        ].forEach(block => {
          const { width: AWidth, height: AHeight, top: ATop, left: ALeft } = block;
          // 当拖拽的元素和当前未选中元素的top一致的时候，要显示这根辅助线 辅助线的位置就是ATop
          lines.y.push({ showTop: ATop, top: ATop }); // 顶部对顶部
          lines.y.push({ showTop: ATop, top: ATop - (blockHeight as number) }); // 顶部对底部
          lines.y.push({
            showTop: ATop + (AHeight as number) / 2,
            top: ATop + (AHeight as number) / 2 - (blockHeight as number) / 2
          }); // 两个元素中部对齐
          lines.y.push({
            showTop: ATop + (AHeight as number),
            top: ATop + (AHeight as number)
          }); // 底部对顶部
          lines.y.push({
            showTop: ATop + (AHeight as number),
            top: ATop + (AHeight as number) - (blockHeight as number)
          }); // 底部对底部

          lines.x.push({ showLeft: ALeft, left: ALeft }); // 左对左
          lines.x.push({ showLeft: ALeft + (AWidth as number), left: ALeft + (AWidth as number) }); // 右对左
          lines.x.push({
            showLeft: ALeft + (AWidth as number) / 2,
            left: ALeft + (AWidth as number) / 2 - (blockWidth as number) / 2
          }); // 中对中
          lines.x.push({
            showLeft: ALeft + (AWidth as number),
            left: ALeft + (AWidth as number) - (blockWidth as number)
          }); // 右对右
          lines.x.push({ showLeft: ALeft, left: ALeft - (blockWidth as number) }); // 左对右
        });
        return lines;
      })()
    };
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };
  const mousemove = (e: MouseEvent) => {
    let { clientX: moveX, clientY: moveY } = e;
    // 记录当前组件最新的left top 去线里面找到需要显示的辅助线
    // 鼠标移动后 - 移动前 + left
    const left = moveX - dragState.startX + dragState.startLeft,
      top = moveY - dragState.startY + dragState.startTop;
    // 计算横线 距离参照物还有5px的时候显示该横线
    let y = 0,
      x = 0;
    for (let i = 0; i < dragState.lines.y.length; i++) {
      const { top: t, showTop: s } = dragState.lines.y[i];
      if (Math.abs(t - top) <= 5) {
        // 横向的线接近正在拖拽的组件
        y = s;
        // 实现快速和靠近的组件贴边
        moveY = dragState.startY - dragState.startTop + t; // 容器距离顶部的距离 + 目标的高度 = 最新的移动的距离
        break;
      }
    }
    for (let i = 0; i < dragState.lines.x.length; i++) {
      const { left: l, showLeft: s } = dragState.lines.x[i];
      if (Math.abs(l - left) <= 5) {
        // 横向的线接近正在拖拽的组件
        x = s;
        // 实现快速和靠近的组件贴边
        moveX = dragState.startX - dragState.startLeft + l; // 容器距离顶部的距离 + 目标的高度 = 最新的移动的距离
        break;
      }
    }
    markline.x = x;
    markline.y = y;
    // 记录水平 垂直方向移动的距离
    const distanceX = moveX - dragState.startX,
      distanceY = moveY - dragState.startY;
    computedFocusOrUnfocusComponents.value.focus.forEach((block, index) => {
      block.top = dragState.startPos[index].top + distanceY;
      block.left = dragState.startPos[index].left + distanceX;
    });
  };
  const mouseup = (e: MouseEvent) => {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    markline.x = -1;
    markline.y = -1; // 鼠标抬起去除辅助线
  };
  return [mousedown, markline] as const; // draggerMousedown
};
