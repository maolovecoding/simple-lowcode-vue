import { defineComponent, ref } from "vue";
import Editor from "@/packages/edit";
import editSchema from "@/schema/edit/edit.schema";
export default defineComponent({
  setup() {
    const data = ref(editSchema); // 编辑配置
    return () => {
      return (
        <div>
          <Editor data={data.value}></Editor>
        </div>
      );
    };
  }
});
