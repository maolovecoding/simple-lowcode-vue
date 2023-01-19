/**
 * @Author: 毛毛
 * @Date: 2023-01-19 16:11:13
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-19 16:11:43
 * @description 配置
 */
import { InjectionKey } from "vue";
import { IRegisterConfig } from "../utils/editor-config";
export const configKey: InjectionKey<IRegisterConfig> = Symbol("config");
