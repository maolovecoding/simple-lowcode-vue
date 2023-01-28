/**
 * @Author: 毛毛
 * @Date: 2023-01-19 13:20:30
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-27 20:55:41
 */
import { EditBlocksSchema } from "@/schema/edit/edit.schema";
import { PropType } from "vue";

export const IEditBlockProps = {
  block: {
    type: Object as PropType<EditBlocksSchema>,
    required: true
  },
  preview: {
    type: Boolean,
    default: false
  },
  onContextmenu: {
    type: Function as PropType<(e: MouseEvent) => void>,
    default: () => () => {}
  },
  formData: {
    type: Object,
    default: () => ({})
  }
};
export const IEditBlockEmits = {
  updateEditBlock(block: EditBlocksSchema) {
    return block !== null;
  },
  mouseDown(e: MouseEvent) {
    return e !== null;
  }
};
