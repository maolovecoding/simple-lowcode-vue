import { PropType } from "vue";
/**
 * @Author: 毛毛
 * @Date: 2023-01-21 16:07:31
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-21 17:09:11
 * @description props
 */
export const IDialogProps = {
  option: {
    type: Object as PropType<IDialogOption>,
    default: () => ({})
  }
};

export interface IDialogOption {
  content: string;
  title: string;
  footer?: boolean;
  confirm?: (content: string) => void;
}
