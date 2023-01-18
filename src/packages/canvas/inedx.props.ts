/**
 * @Author: 毛毛
 * @Date: 2023-01-17 14:13:50
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-17 14:18:38
 */
import { CSSProperties, PropType } from "vue";
export const IEditCanvasProps = {
  contentStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  }
};
