/**
 * @Author: 毛毛
 * @Date: 2023-01-28 14:10:55
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-28 14:18:49
 */
import { PropType } from "vue";
import { IProps } from "@/packages/utils/editor-config";
export const ITableEditorProps = {
  propConfig: {
    type: Object as PropType<IProps>,
    require: true
  },
  modelValue: {
    type: Array
  }
};
export const ITableEditorEmits = {
  "update:modelValue"(val: any) {
    return val !== null;
  }
};
