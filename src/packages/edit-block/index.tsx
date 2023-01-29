/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:24
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-28 19:50:48
 */
import { computed, CSSProperties, defineComponent, inject, onMounted, ref } from "vue";
import { IEditBlockProps, IEditBlockEmits } from "./index.props";
import { configKey } from "../../packages/config";
import "./index.style.less";
import { IComponentModel } from "../utils/editor-config";
import BlockResize from "./blockResize";

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
      // e.preventDefault();
      // e.stopPropagation();
      emit("mouseDown", e);
    };
    return () => {
      // 通过key拿到对应的组件 然后拿到渲染函数
      const component = config.componentMap.get(props.block!.key)!;
      // 拿到props
      const componentProps = props.block?.props;
      const RenderComponent = component.render({
        props: componentProps,
        size: props.block?.hasResize
          ? { width: props.block.width as number, height: props.block.height as number }
          : undefined,
        model: Object.keys(component.model || {}).reduce((prev, modelName) => {
          // console.log(prev, modelName);
          // modelName => default
          const propName = props.block!.model[modelName as keyof IComponentModel]!;
          // console.log(propName, props.formData[propName]);
          prev[modelName] = {
            // {default: {modelValue:"xx", "onUpdate": fn}}
            modelValue: props.formData[propName],
            "onUpdate:modelValue": (val: any) => {
              // TODO 这里 不应该直接改变props 后续修复
              // eslint-disable-next-line vue/no-mutating-props
              props.formData[propName] = val;
              return val;
            }
          };
          return prev;
        }, {} as Record<keyof any, any>)
      });
      const { width, height } = component.resize || {};

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
          {props.block?.focus && (width || height) && (
            // block 用来修改组件宽高 component中存放了是应该修改宽度还是高度
            <BlockResize block={props.block} component={component} />
          )}
        </div>
      );
    };
  }
});
