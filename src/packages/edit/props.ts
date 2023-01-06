import { EditSchema } from "@/schema/edit/edit.schema";
import { PropType } from "vue";

export const EditProps = {
  data: {
    type: Object as PropType<EditSchema>,
    required: true
  }
};
