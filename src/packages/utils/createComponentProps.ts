import { IComponentPropOption, IProps } from "./editor-config";

/**
 * @Author: 毛毛
 * @Date: 2023-01-26 16:14:32
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-28 14:10:31
 * @description 创建对象工厂函数
 */
export const createInputProps = (label: string): IProps => ({ type: "input", label });
export const createColorProps = (label: string): IProps => ({ type: "color", label });
export const createSelectProps = (label: string, options: IComponentPropOption[]): IProps => ({
  type: "select",
  label,
  options
});

export const createTableProp = (label: string, table: ICreateTableProp): IProps => ({
  type: "table",
  label,
  table
});

export interface ICreateTableProp {
  options: { label: string; field: string }[];
  key: string;
}
