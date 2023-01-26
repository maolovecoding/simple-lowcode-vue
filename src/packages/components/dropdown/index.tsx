/**
 * @Author: 毛毛
 * @Date: 2023-01-26 13:12:45
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-26 14:45:51
 */
import {
  computed,
  createVNode,
  defineComponent,
  inject,
  onBeforeMount,
  onMounted,
  PropType,
  provide,
  reactive,
  ref,
  render,
  VNode
} from "vue";
import "./index.style.less";
export const DropdownItem = defineComponent({
  props: {
    label: String,
    icon: Object as PropType<JSX.Element>
  },
  emits: ["click"],
  setup(props, { slots, emit }) {
    const hide = inject("hide")! as () => void;
    const handleClick = () => {
      emit("click");
      hide();
    };
    return () => (
      <div class="dropdown-item" onClick={handleClick}>
        <span>{props.label ?? slots.default?.()}</span>
      </div>
    );
  }
});

const DropdownComponent = defineComponent({
  props: {
    option: {
      type: Object as PropType<IDropdown>,
      default: () => ({})
    }
  },
  setup(props, { expose }) {
    provide("hide", () => (state.isShow = false));
    const state = reactive({
      option: props.option,
      isShow: false,
      top: 0,
      left: 0
    });
    expose({
      showDropdown(option: IDropdown) {
        state.option = option;
        state.isShow = true;
        const { left, top, height } = option.el.getBoundingClientRect();
        state.top = top + height;
        state.left = left;
      }
    });
    const classes = computed(() => [
      "dropdown",
      {
        "dropdown-isShow": state.isShow
      }
    ]);
    const styles = computed(() => ({
      top: state.top + "px",
      left: state.left + "px"
    }));
    const dropdownRef = ref<HTMLDivElement>();
    const handleMousedown = (e: MouseEvent) => {
      // 点击的是元素自身 什么都不做
      if (!dropdownRef.value?.contains(e.target as HTMLElement)) {
        state.isShow = false;
      }
    };
    onMounted(() => {
      // TODO 事件 先捕获后冒泡了
      // 之前为了阻止事件传播已经给每个组件都增加了stopPropagation了
      document.body.addEventListener("mousedown", handleMousedown, {
        passive: true
      });
    });
    onBeforeMount(() => {
      document.body.removeEventListener("mousedown", handleMousedown);
    });
    return () => (
      <div class={classes.value} style={styles.value} ref={dropdownRef}>
        {state.option.content()}
      </div>
    );
  }
});
let vm: VNode;
export const useDropdown = (option: IDropdown) => {
  if (!vm) {
    const el = document.createElement("div");
    vm = createVNode(DropdownComponent, { option });
    render(vm, el);
    document.body.appendChild(el);
  }
  const { showDropdown } = vm.component!.exposed as { showDropdown: (option: IDropdown) => void };
  showDropdown(option);
};

export interface IDropdown {
  el: HTMLElement;
  content: () => JSX.Element;
}
