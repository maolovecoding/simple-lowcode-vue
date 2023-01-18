/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:24
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-17 14:23:43
 */
import { defineComponent } from "vue";
import { IEditCanvasProps } from "./inedx.props";
import "./index.style.less";
export default defineComponent({
  props: {
    ...IEditCanvasProps
  },
  setup(props, { slots }) {
    console.log(props.contentStyle);
    return () => {
      return (
        <div class="editor-canvas-container">
          {/* 产生滚动条 */}
          <div class="editor-canvas-container-canvas">
            {/* 产生内容区 */}
            <div style={props.contentStyle} class="editor-canvas-container-canvas__content">
              {slots.default?.()}
            </div>
          </div>
        </div>
      );
    };
  }
});
