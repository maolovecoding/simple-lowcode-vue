import { EditSchema } from "@/schema/edit/edit.schema";
import { PropType } from "vue";

export const IEditProps = {
  modelValue: {
    type: Object as PropType<EditSchema>,
    required: true
  },
  formData: {
    type: Object,
    default: () => ({})
  }
};

export const IEditEmits = {
  "update:modelValue"(newEditConfigData: EditSchema) {
    return newEditConfigData !== null;
  }
};
