/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:24
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-17 17:24:11
 */
import { computed, CSSProperties, defineComponent, inject } from "vue";
import { EditBlockProps } from "./index.props";
import { configKey } from "../../packages/config";
import "./index.style.less";
export default defineComponent({
  props: {
    ...EditBlockProps
  },
  setup(props) {
    const blockStyle = computed(
      () =>
        ({
          top: `${props.block?.top}px`,
          left: `${props.block?.left}px`,
          zIndex: props.block?.zIndex
        } as CSSProperties)
    );
    const config = inject(configKey)!;
    return () => {
      // 通过key拿到对应的组件 然后拿到渲染函数
      const component = config.componentMap.get(props.block!.key)!;
      const RenderComponent = component.render();
      return (
        <div class="edit-block" style={{ ...blockStyle.value }}>
          {RenderComponent}
        </div>
      );
    };
  }
});
