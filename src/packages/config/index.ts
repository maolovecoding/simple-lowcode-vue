import { InjectionKey } from "vue";
import { IRegisterConfig } from "../utils/editor-config";
export const configKey: InjectionKey<IRegisterConfig> = Symbol("config");
