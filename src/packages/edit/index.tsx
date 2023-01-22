/**
 * @Author: 毛毛
 * @Date: 2023-01-17 13:51:11
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-22 19:35:00
 */
import { computed, defineComponent, ref } from "vue";
import deepcopy from "deepcopy";
import { ElButton } from "element-plus";
import Configuration from "../configuration";
import Material from "../material";
import EditBlock from "../edit-block";
import { IEditProps, IEditEmits } from "./index.props";
import "./index.style.less";
import Canvas from "../canvas";
import { EditBlocksSchema, EditSchema } from "@/schema/edit/edit.schema";
import { useBlockDragger, useBlockFocus, useCommand } from "../hooks";
import { useDialog } from "../components";
const Editor = defineComponent({
  name: "EditorVue",
  props: {
    ...IEditProps
  },
  emits: {
    ...IEditEmits
  },
  setup(props, { emit }) {
    // TODO 支持预览 预览时不能再拖拽组件 可以点击 输入内容等
    const previewRef = ref(false);
    // 渲染的画布的配置schema 已经渲染的组件blocks
    const configData = computed({
      get: () => props.modelValue,
      set: val => {
        // 深拷贝
        emit("update:modelValue", deepcopy(val!));
      }
    });
    const handleUpdateEditConfigData = (newEditConfigData: EditSchema) =>
      (configData.value = newEditConfigData);

    // 画布的宽高
    const canvasStyle = computed(() => ({
      width: configData.value?.container.width + "px",
      height: configData.value?.container.height + "px"
    }));
    const containerRef = ref<HTMLDivElement>();
    const handleUpdateEditBlock = (block: EditBlocksSchema, index: number) => {
      configData.value!.blocks[index] = block;
    };

    // 2. 实现获取焦点 选中后可能就直接进行拖拽了
    const [
      handleBlockMouseDown,
      handleContainerMousedown,
      computedFocusOrUnfocusComponents,
      lastSelectedBlock,
      clearBlocksFocus
    ] = useBlockFocus(configData, previewRef, (e: MouseEvent) => {
      // 焦点获取后进行拖拽
      handleDraggerMousedown(e);
    });
    const [handleDraggerMousedown, markline] = useBlockDragger(
      computedFocusOrUnfocusComponents,
      lastSelectedBlock,
      configData
    );

    // 3. 实现拖拽多个元素的功能

    // TODO 菜单栏按钮 后续抽离 icon
    const { commands } = useCommand(configData, computedFocusOrUnfocusComponents);
    const btns = [
      { label: "撤销", handler: () => commands.get("undo")!() },
      { label: "重做", handler: () => commands.get("redo")!() },
      {
        label: "导入",
        handler: () => {
          useDialog({
            title: "导入json schema",
            content: "",
            footer: true,
            confirm(content) {
              // configData.value = JSON.parse(content);
              // 支持更新容器
              commands.get("updateContainer")!(JSON.parse(content));
            }
          });
        }
      },
      {
        label: "导出",
        handler: () => {
          useDialog({
            title: "导出 JSON schema",
            content: JSON.stringify(configData.value, null, 2) // TODO  后续修复
          });
        }
      },
      {
        label: "置顶",
        handler: () => {
          commands.get("placeTop")?.();
        }
      },
      {
        label: "置底",
        handler: () => {
          commands.get("placeBottom")?.();
        }
      },
      {
        label: "选中删除", // ctrl + d
        handler: () => {
          commands.get("delete")?.();
        }
      },
      {
        label: () => (previewRef.value ? "预览" : "编辑"),
        handler: () => {
          previewRef.value = !previewRef.value;
          clearBlocksFocus();
        }
      }
    ];

    return () => {
      return (
        <div>
          {/* 菜单 */}
          <div
            style={{
              height: "50px",
              display: "flex",
              justifyContent: "center"
            }}>
            {btns.map((btn, index) => {
              return (
                <div style={{ marginLeft: "10px" }}>
                  <ElButton onClick={btn.handler}>
                    {typeof btn.label === "function" ? btn.label() : btn.label}
                  </ElButton>
                </div>
              );
            })}
          </div>
          <div class="edit-container-div">
            <div class="material-container">
              <Material
                editConfigData={configData.value}
                containerRef={containerRef}
                onUpdateEditConfigData={handleUpdateEditConfigData}></Material>
            </div>
            <div class="configuration-container">
              <Configuration />
            </div>
            <div class="editor-container">
              <Canvas
                containerRef={containerRef}
                contentStyle={canvasStyle.value}
                markline={markline}
                conatinerMouseDown={handleContainerMousedown}>
                {configData.value?.blocks.map((block, index) => (
                  // 负责渲染
                  <EditBlock
                    block={block}
                    preview={previewRef.value}
                    onMouseDown={e => handleBlockMouseDown(e, block, index)}
                    onUpdateEditBlock={block => handleUpdateEditBlock(block, index)}
                  />
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
