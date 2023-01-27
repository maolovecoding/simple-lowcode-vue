/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:24
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-27 18:41:37
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
      const { offsetWidth, offsetHeight } = blockRef.value!;
      // console.log(blockRef.value);
      const block = { ...props.block! };
      if (props.block?.alignCenter) {
        // 说明是拖拽松手的时候 此时需要居中
        block.left = block.left - offsetWidth / 2;
        block.top = block.top - offsetHeight / 2;
        block.alignCenter = false;
      }
      // 增加宽高
      block.width = offsetWidth;
      block.height = offsetHeight;
      emit("updateEditBlock", block);
    });
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emit("mouseDown", e);
    };
    return () => {
      // 通过key拿到对应的组件 然后拿到渲染函数
      const component = config.componentMap.get(props.block!.key)!;
      // 拿到props
      const componentProps = props.block?.props;
      const RenderComponent = component.render(componentProps);

      const getClassName = () =>
        `edit-block ${
          props.preview ? "editor-block-preview" : props.block?.focus ? "editor-block-focus" : ""
        }`;
      return (
        <div
          class={getClassName()}
          style={{ ...blockStyle.value }}
          ref={blockRef}
          onMousedown={handleMouseDown}
          onContextmenu={props.onContextmenu}>
          {RenderComponent}
        </div>
      );
    };
  }
});
