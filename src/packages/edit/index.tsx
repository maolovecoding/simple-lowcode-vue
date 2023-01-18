/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:11
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-17 14:22:43
 */
import { computed, defineComponent } from "vue";
import Configuration from "../configuration";
import Material from "../material";
import EditBlock from "../edit-block";
import { EditProps } from "./index.props";
import "./index.style.less";
import Canvas from "../canvas";
const Editor = defineComponent({
  name: "EditorVue",
  props: {
    ...EditProps
  },
  emits: ["onUpdate:modelValue"],
  setup(props) {
    const configData = computed({
      get: () => props.modelValue,
      set: val => {
        console.log(val);
      }
    });
    const canvasStyle = computed(() => ({
      width: configData.value?.container.width + "px",
      height: configData.value?.container.height + "px"
    }));
    return () => {
      return (
        <div>
          <div style={{ height: "50px" }}>菜单栏</div>
          <div class="edit-container-div">
            <div class="material-container">
              <Material></Material>
            </div>
            <div class="configuration-container">
              <Configuration />
            </div>
            <div class="editor-container">
              <Canvas contentStyle={canvasStyle.value}>
                {configData.value?.blocks.map(block => (
                  // 负责渲染
                  <EditBlock block={block} />
                ))}
              </Canvas>
            </div>
          </div>
        </div>
      );
    };
  }
});
export default Editor;
