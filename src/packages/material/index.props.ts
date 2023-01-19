/**
 * @Author: 毛毛
 * @Date: 2023-01-19 11:46:52
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-19 11:47:33
 * @description props
 */
import { EditSchema } from "@/schema/edit/edit.schema";
import { PropType, Ref } from "vue";

export type IMaterialData = "h5" | "elementPlus";

export const IMaterialProps = {
  containerRef: {
    type: Object as PropType<Ref<HTMLDivElement | undefined>>
  },
  editConfigData: {
    type: Object as PropType<EditSchema>
  }
};

export const IMaterialEmits = {
  updateEditConfigData(newEditConfigData: EditSchema) {
    return newEditConfigData !== null;
  }
};
