/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:24
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-20 11:45:26
 */
import { defineComponent, ref } from "vue";
import { IEditCanvasProps } from "./inedx.props";
import "./index.style.less";
export default defineComponent({
  props: {
    ...IEditCanvasProps
  },
  setup(props, { slots }) {
    // 点击整个容器 清除所有选中的组件
    // const handleContainerMousedown = (e: MouseEvent) => {};
    return () => {
      return (
        <div class="editor-canvas-container">
          {/* 产生滚动条 */}
          <div class="editor-canvas-container-canvas">
            {/* 产生内容区 */}
            <div
              style={props.contentStyle}
              class="editor-canvas-container-canvas__content"
              ref={props.containerRef}
              onMousedown={props.conatinerMouseDown}>
              {slots.default?.()}
            </div>
            {/* 辅助线 */}
            {props.markline?.x !== -1 && (
              <div class="line-x" style={{ left: props.markline!.x + "px" }}></div>
            )}
            {props.markline?.y !== -1 && (
              <div class="line-y" style={{ top: props.markline!.y + "px" }}></div>
            )}
          </div>
        </div>
      );
    };
  }
});
