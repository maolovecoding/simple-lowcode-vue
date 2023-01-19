/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:24
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-19 14:16:52
 */
import { computed, CSSProperties, defineComponent, inject, onMounted, ref } from "vue";
import { IEditBlockProps, IEditBlockEmits } from "./index.props";
import { configKey } from "../../packages/config";
import "./index.style.less";
export default defineComponent({
  props: {
    ...IEditBlockProps
  },
  emits: { ...IEditBlockEmits },
  setup(props, { emit }) {
    const blockStyle = computed(
      () =>
        ({
          top: `${props.block?.top}px`,
          left: `${props.block?.left}px`,
          zIndex: props.block?.zIndex
        } as CSSProperties)
    );
    const config = inject(configKey)!;
    const blockRef = ref<HTMLDivElement>();
    onMounted(() => {
      // 获取容器的宽高
      // console.log(blockRef.value);
      if (props.block?.alignCenter) {
        const { offsetWidth, offsetHeight } = blockRef.value!;
        // 说明是拖拽松手的时候 此时需要居中
        const block = { ...props.block! };
        block.left = block.left - offsetWidth / 2;
        block.top = block.top - offsetHeight / 2;
        block.alignCenter = false;
        // props.block.alignCenter = false;
        emit("updateEditBlock", block);
      }
    });
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emit("mouseDown", e);
    };
    return () => {
      // 通过key拿到对应的组件 然后拿到渲染函数
      const component = config.componentMap.get(props.block!.key)!;
      const RenderComponent = component.render();
      return (
        <div
          class={props.block?.focus ? "edit-block editor-block-focus" : "edit-block"}
          style={{ ...blockStyle.value }}
          ref={blockRef}
          onMousedown={handleMouseDown}>
          {RenderComponent}
        </div>
      );
    };
  }
});
