/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:52
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-21 17:06:26
 */
import { createApp } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import App from "./pages/home";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
// 配置组件对应的映射关系 {preview: xxx, render: xxx}
