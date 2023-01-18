import { defineComponent, ref, provide } from "vue";
import Editor from "@/packages/edit";
import editSchema from "@/schema/edit/edit.schema";
import { registerConfig as config } from "../../packages/utils/editor-config";
import { configKey } from "../../packages/config";
export default defineComponent({
  setup() {
    const data = ref(editSchema); // 编辑配置
    // 物料
    // console.log(registerConfig);
    provide(configKey, config);
    return () => {
      return (
        <div>
          <Editor v-model={data.value}></Editor>
        </div>
      );
    };
  }
});
