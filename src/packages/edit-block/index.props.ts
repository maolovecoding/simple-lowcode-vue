import { EditBlocksSchema } from "@/schema/edit/edit.schema";
import { PropType } from "vue";

export const EditBlockProps = {
  block: {
    type: Object as PropType<EditBlocksSchema>,
    required: true
  }
};
