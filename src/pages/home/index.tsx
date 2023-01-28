/**
 * @Author: 毛毛
 * @Date: 2023-01-05 21:03:56
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-28 13:34:50
 */
import { defineComponent, ref, provide } from "vue";
import Editor from "@/packages/edit";
import editSchema from "@/schema/edit/edit.schema";
import { registerConfig as config } from "../../packages/utils/editor-config";
import { configKey } from "../../packages/config";

export default defineComponent({
  setup() {
    const data = ref(editSchema); // 编辑配置
    // 物料
    provide(configKey, config);
    const formData = ref({
      username: "zs",
      age: 22,
      start: 1,
      end: 20
    });
    return () => {
      return (
        <div>
          <Editor v-model={data.value} formData={formData.value} />
        </div>
      );
    };
  }
});
