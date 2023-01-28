/**
 * @Author: 毛毛
 * @Date: 2023-01-28 12:01:11
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-28 12:36:20
 * @description 范围选择器
 */

import { ElInput } from "element-plus";
import { computed, defineComponent } from "vue";
import { IRangeProps, IRangeEmits } from "./index.props";

export default defineComponent({
  name: "RangeVue",
  props: { ...IRangeProps },
  emits: { ...IRangeEmits },
  setup(props, { emit }) {
    const start = computed({
      get: () => props.start,
      set: val => emit("update:start", val!)
    });
    const end = computed({
      get: () => props.end,
      set: val => emit("update:end", val!)
    });
    return () => {
      return (
        <div>
          <ElInput v-model={start.value} style={{ width: "45%" }} />
          <span>~</span>
          <ElInput v-model={end.value} style={{ width: "45%" }} />
        </div>
      );
    };
  }
});
