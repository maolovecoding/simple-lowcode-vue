/**
 * @Author: 毛毛
 * @Date: 2023-01-19 13:55:40
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-27 17:02:01
 * @description 实现菜单的拖拽
 */
import { EditSchema } from "@/schema/edit/edit.schema";
import { Ref } from "vue";
import { IComponent } from "../utils/editor-config";
import { events, EVENT_NAMES } from "../utils/events";

export const useMenuDragger = <T extends HTMLDivElement | undefined>(
  props: { containerRef: Ref<T>; editConfigData: EditSchema },
  dropHook: (newEditConfigData: EditSchema) => void
) => {
  let currentComponent = null as IComponent | null;

  const dragenter = (e: DragEvent) => {
    e.dataTransfer!.dropEffect = "move";
  };
  const dragover = (e: DragEvent) => {
    e.preventDefault();
  };
  const dragleave = (e: DragEvent) => {
    e.dataTransfer!.dropEffect = "none";
  };
  const drop = (e: DragEvent) => {
    console.log(currentComponent);
    // 画布上已经渲染过的组件
    const blocks = props.editConfigData!.blocks;
    const newEditConfigData: EditSchema = {
      ...props.editConfigData!,
      blocks: [
        ...blocks,
        {
          top: e.offsetY,
          left: e.offsetX,
          zIndex: 1,
          key: currentComponent!.key,
          alignCenter: true,
          props: {}
        }
      ]
    };
    currentComponent = null;
    // emit("updateEditConfigData", newEditConfigData);
    dropHook(newEditConfigData);
  };
  const handleDragstart = (e: DragEvent, component: IComponent) => {
    currentComponent = component;
    // 拖拽过程的移动效果
    // console.log(containerRef?.value);
    // dragenter 进入的时候 添加移动标识
    // dragover 在目标元素经过 必须阻止默认行为 否则不能触发drop
    // dragleave 离开元素的时候 需要增加一个禁用标识
    // drop 松手的时候 根据拖拽的组件 添加一个组件
    props.containerRef?.value?.addEventListener("dragenter", dragenter);
    props.containerRef?.value?.addEventListener("dragover", dragover);
    props.containerRef?.value?.addEventListener("dragleave", dragleave);
    props.containerRef?.value?.addEventListener("drop", drop);
    // TODO 发布 dragstart事件
    events.emit(EVENT_NAMES.DRAGSTART);
  };
  const handleDragend = (e: DragEvent, component: IComponent) => {
    props.containerRef?.value?.removeEventListener("dragenter", dragenter);
    props.containerRef?.value?.removeEventListener("dragover", dragover);
    props.containerRef?.value?.removeEventListener("dragleave", dragleave);
    props.containerRef?.value?.removeEventListener("drop", drop);
    events.emit(EVENT_NAMES.DRAGEND);
  };
  return [handleDragstart, handleDragend] as const;
};
