/**
 * @Author: 毛毛
 * @Date: 2023-01-28 14:38:07
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-28 16:18:38
 */

import deepcopy from "deepcopy";
import { ElButton, ElDialog, ElInput, ElTable, ElTableColumn } from "element-plus";
import { createVNode, defineComponent, PropType, reactive, render, VNode } from "vue";

const tableDialogComponent = defineComponent({
  props: {
    options: {
      type: Object as PropType<ITableDialogOptions>
    }
  },
  setup(props, { expose }) {
    const state = reactive({
      options: props.options,
      isShow: false,
      editData: [] as any[]
    });
    expose({
      show(options: ITableDialogOptions) {
        state.options = options;
        state.isShow = true;
        state.editData = deepcopy(options.data);
      }
    });
    const handleAdd = () => {
      state.editData.push({});
    };
    const handleReset = () => {};
    const handleCancel = () => {
      state.isShow = false;
    };
    const handleComfirm = () => {
      state.options?.confirm(state.editData);
      handleCancel();
    };
    const slots = {
      default: () => (
        <div>
          <div>
            <ElButton type="primary" onClick={handleAdd}>
              添加
            </ElButton>
            <ElButton type="warning" onClick={handleReset}>
              重置
            </ElButton>
          </div>
          <ElTable
            data={state.editData}
            v-slots={{
              default: () => (
                <>
                  <ElTableColumn type="index" />
                  {state.options?.config.table.options.map((item, index) => (
                    <ElTableColumn
                      label={item.label}
                      v-slots={{
                        default: ({ row }) => <ElInput v-model={row[item.field]} />
                      }}
                    />
                  ))}
                  <ElTableColumn
                    label="操作"
                    v-slots={{
                      default: () => <ElButton type="danger">删除</ElButton>
                    }}
                  />
                </>
              )
            }}
          />
        </div>
      ),
      footer: () => (
        <>
          <ElButton type="warning" onClick={handleCancel}>
            取消
          </ElButton>
          <ElButton type="primary" onClick={handleComfirm}>
            确定
          </ElButton>
        </>
      )
    };
    return () => {
      return (
        <ElDialog v-model={state.isShow} title={state.options?.config.label} v-slots={slots} />
      );
    };
  }
});
let vm: VNode;
export const useTableDialog = (options: ITableDialogOptions) => {
  if (!vm) {
    const el = document.createElement("div");
    vm = createVNode(tableDialogComponent, { options });
    render(vm, el);
    document.body.appendChild(el);
  }
  const { show } = vm.component!.exposed as { show: (options: ITableDialogOptions) => void };
  show(options);
};

export interface ITableDialogOptions {
  config: any;
  data: any;
  confirm: (val: any) => void;
}
