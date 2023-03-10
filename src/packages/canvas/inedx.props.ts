/**
 * @Author: 毛毛
 * @Date: 2023-01-17 14:13:50
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-20 11:42:54
 */
import { CSSProperties, PropType, Ref } from "vue";
export const IEditCanvasProps = {
  contentStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  containerRef: {
    type: Object as PropType<Ref<HTMLDivElement | undefined>>
  },
  conatinerMouseDown: {
    type: Function as PropType<(e: MouseEvent) => void>,
    default: () => () => {}
  },
  markline: {
    type: Object as PropType<{ x: number; y: number }>,
    default: () => ({ x: -1, y: -1 })
  }
};
