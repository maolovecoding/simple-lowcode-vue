/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:52:06
 * @Last Modified by:   毛毛
 * @Last Modified time: 2023-01-17 13:52:06
 */
import { defineComponent, inject, ref } from "vue";
import { Menu as IconMenu } from "@element-plus/icons-vue";
import { ElMenu, ElMenuItem, ElIcon, MenuItemRegistered } from "element-plus";
import { IMaterialData } from "./index.props";
import "./index.style.less";
import { configKey } from "../config";
export default defineComponent({
  setup() {
    const ElMenuItemSlots = (title: string) => ({
      title: () => title,
      default: () => (
        <ElIcon>
          <IconMenu />
        </ElIcon>
      )
    });
    const handleClick = (menuItemRef: MenuItemRegistered) => {
      materialData.value = menuItemRef.index as IMaterialData;
    };
    const materialData = ref<IMaterialData>("elementPlus");
    const config = inject(configKey)!;
    return () => (
      <div class="material-container">
        <div>
          <ElMenu defaultActive={materialData.value} collapse={true}>
            <ElMenuItem index="h5" onClick={handleClick} v-slots={ElMenuItemSlots("h5")} />
            <ElMenuItem
              index="elementPlus"
              onClick={handleClick}
              v-slots={ElMenuItemSlots("elementPlus")}
            />
          </ElMenu>
        </div>
        <div>
          {materialData.value === "h5" ? (
            "h5"
          ) : (
            <div class="material-edit-container">
              {/* 根据注册列表 渲染对应的预览组件 */}
              {config.componentList.map(component => (
                <div class="material-edit-container__preview">
                  <span>{component.label}</span>
                  <div>{component.preview()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
});
