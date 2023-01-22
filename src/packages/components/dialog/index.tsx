/**
 * @Author: 毛毛
 * @Date: 2023-01-21 16:05:12
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-21 17:14:34
 */

import { createVNode, defineComponent, reactive, render, VNode } from "vue";
import { ElButton, ElDialog, ElInput } from "element-plus";
import { IDialogProps, IDialogOption } from "./index.props";

let vm: VNode;

const DialogComponent = defineComponent({
  props: { ...IDialogProps },
  setup(props, { expose }) {
    const state = reactive({
      isShow: false,
      option: props.option
    });
    expose({
      showDialog(option: IDialogOption) {
        state.isShow = true;
        state.option = option;
      }
    });
    const handleCancel = () => {
      state.isShow = false;
    };
    const handleConfirm = () => {
      state.option.confirm?.(state.option.content);
      state.isShow = false;
    };
    const slots = {
      default: () => <ElInput type="textarea" v-model={state.option.content} rows={10} />,
      footer: () =>
        state.option.footer && (
          <div>
            <ElButton onClick={handleCancel}>取消</ElButton>
            <ElButton type="primary" onClick={handleConfirm}>
              确定
            </ElButton>
          </div>
        )
    };
    return () => <ElDialog title={state.option.title} v-model={state.isShow} v-slots={slots} />;
  }
});
/**
 * 手动挂载dialog到页面上
 */
export const useDialog = (option: IDialogOption) => {
  if (!vm) {
    const el = document.createElement("div");
    vm = createVNode(DialogComponent, { option });
    render(vm, el);
    document.body.appendChild(el);
  }
  const { showDialog } = vm.component!.exposed as { showDialog: (option: IDialogOption) => void };
  showDialog(option);
};
