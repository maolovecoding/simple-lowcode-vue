/**
 * @Author: 毛毛
 * @Date: 2023-01-28 18:59:39
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-29 11:19:44
 * @description 创建可以跳转组件大小的点
 */

import { EditBlocksSchema } from "@/schema/edit/edit.schema";
import { defineComponent, PropType } from "vue";
import { IComponent } from "../utils/editor-config";
import "./blockResize.style.less";

type IOperationLocation = "center" | "start" | "end";
interface IMousedownDirection {
  horizontal: IOperationLocation;
  vertial: IOperationLocation;
}

export default defineComponent({
  props: {
    block: {
      type: Object as PropType<EditBlocksSchema>,
      required: true
    },
    component: {
      type: Object as PropType<IComponent>,
      require: true
    }
  },
  setup(props) {
    const { width, height } = props.component?.resize || {};
    let location = {
      startX: -1,
      startY: -1,
      startWidth: props.block.width,
      startHeight: props.block.height,
      startLeft: props.block.left,
      startTop: props.block.top,
      direction: {} as IMousedownDirection
    };
    const handleMousemove = (e: MouseEvent) => {
      let { clientX, clientY } = e;
      const { startX, startY, startWidth, startHeight, startLeft, startTop, direction } = location;

      if (direction.horizontal === "center") {
        // 拖拽的是中间的点 x轴是不变的
        clientX = startX;
      }
      if (direction.vertial === "center") {
        // 只能改横向 纵是不改变的
        clientY = startY;
      }

      // 算出鼠标之前和之后的距离
      let durX = clientX - startX,
        durY = clientY - startY;
      // 反向拖拽 取反
      if (direction.vertial === "start") {
        durY = -durY;
        // eslint-disable-next-line vue/no-mutating-props
        props.block.top = startTop - durY;
      }
      if (direction.horizontal === "start") {
        durX = -durX;
        // eslint-disable-next-line vue/no-mutating-props
        props.block.left = startLeft - durX;
      }
      const width = (startWidth! as number) + durX,
        height = (startHeight! as number) + durY;
      // TODO  不要直接修改props
      // eslint-disable-next-line vue/no-mutating-props
      props.block.width = width;
      // eslint-disable-next-line vue/no-mutating-props
      props.block.height = height;
      // eslint-disable-next-line vue/no-mutating-props
      props.block.hasResize = true;
    };
    const handleMouseup = (e: MouseEvent) => {
      document.body.removeEventListener("mousemove", handleMousemove);
      document.body.removeEventListener("mouseup", handleMouseup);
    };
    const handleMousedown = (e: MouseEvent, direction: IMousedownDirection) => {
      e.stopPropagation();
      // 记录初始位置信息
      location = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: props.block.width,
        startHeight: props.block.height,
        startLeft: props.block.left,
        startTop: props.block.top,
        direction
      };
      document.body.addEventListener("mousemove", handleMousemove);
      document.body.addEventListener("mouseup", handleMouseup);
    };
    return () => {
      return (
        <>
          {width && (
            <>
              <div
                class="block-resize block-resize-left"
                onClick={e => handleMousedown(e, { horizontal: "start", vertial: "center" })}></div>
              <div
                class="block-resize block-resize-right"
                onClick={e => handleMousedown(e, { horizontal: "end", vertial: "center" })}></div>
            </>
          )}
          {height && (
            <>
              <div
                class="block-resize block-resize-top"
                onClick={e => handleMousedown(e, { horizontal: "center", vertial: "start" })}></div>
              <div
                class="block-resize block-resize-bottom"
                onClick={e => handleMousedown(e, { horizontal: "center", vertial: "end" })}></div>
            </>
          )}
          {width && height && (
            <>
              <div
                class="block-resize block-resize-top-left"
                onClick={e => handleMousedown(e, { horizontal: "start", vertial: "start" })}></div>
              <div
                class="block-resize block-resize-top-right"
                onClick={e => handleMousedown(e, { horizontal: "end", vertial: "start" })}></div>
              <div
                class="block-resize block-resize-bottom-left"
                onClick={e => handleMousedown(e, { horizontal: "start", vertial: "end" })}></div>
              <div
                class="block-resize block-resize-bottom-right"
                onClick={e => handleMousedown(e, { horizontal: "end", vertial: "end" })}></div>
            </>
          )}
        </>
      );
    };
  }
});
