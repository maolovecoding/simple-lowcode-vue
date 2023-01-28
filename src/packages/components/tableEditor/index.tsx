/**
 * @Author: 毛毛
 * @Date: 2023-01-28 14:06:29
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-28 16:29:18
 * @description 属性配置表格
 */

import deepcopy from "deepcopy";
import { ElButton, ElTag } from "element-plus";
import { computed, defineComponent } from "vue";
import { ITableEditorEmits, ITableEditorProps } from "./index.props";
import { useTableDialog } from "./tableDialog";

export default defineComponent({
  props: { ...ITableEditorProps },
  emits: { ...ITableEditorEmits },
  setup(props, { emit }) {
    const data = computed({
      get() {
        return props.modelValue || [];
      },
      set(newVal) {
        emit("update:modelValue", deepcopy(newVal));
      }
    });
    console.log(data);
    const handleAdd = () => {
      useTableDialog({
        config: props.propConfig,
        data: data.value,
        confirm(val) {
          data.value = val; // 更新数据
        }
      });
    };
    return () => {
      return (
        <div>
          {/* 下拉框没有数据 */}
          {(!data.value || data.value.length === 0) && (
            <ElButton type="primary" onClick={handleAdd}>
              添加
            </ElButton>
          )}
          {(data.value || []).map(item => (
            <ElTag onClick={handleAdd}>{item[props.propConfig?.table.key]}</ElTag>
          ))}
        </div>
      );
    };
  }
});
