import { EditBlocksSchema, EditSchema } from "@/schema/edit/edit.schema";
import { PropType } from "vue";

/**
 * @Author: 毛毛
 * @Date: 2023-01-26 16:38:26
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-26 16:49:03
 */
export const IConfigurationProps = {
  block: {
    type: Object as PropType<EditBlocksSchema>, // 最后选中的组件
    default: () => ({})
  },
  configData: {
    type: Object as PropType<EditSchema>, //当前所有的渲染数据
    default: () => ({})
  }
};
