/**
 * @Author: 毛毛
 * @Date: 2023-01-20 14:21:48
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-21 15:36:55
 * @description 实现撤销 重做等
 */

import deepcopy from "deepcopy";
import { EditBlocksSchema, EditSchema } from "@/schema/edit/edit.schema";
import { onUnmounted, WritableComputedRef } from "vue";
import { events, EVENT_NAMES } from "../utils/events";

export const useCommand = (configData: WritableComputedRef<EditSchema | undefined>) => {
  const state = {
    current: -1, // 前进后退的索引值
    queue: [] as { redo: () => void; undo?: () => void }[], // 用户在画布上的操作
    commands: new Map<string, () => void>(), // 命令和执行功能的映射表
    commandArray: [] as ICommand[], // 存放所有的命令
    destroyArray: [] as (() => void)[] // 销毁的命令
  }; // 状态
  const registry = (command: ICommand) => {
    state.commandArray.push(command);
    // 注册命令对应的执行函数
    state.commands.set(command.name, () => {
      const { redo, undo } = command.execute();
      redo();
      if (!command.pushQueue) return;
      // 需要放到队列里面
      // 干掉撤销过的命令 从队列移除 放置过程中撤销过的命令都扔掉
      if (state.queue.length > 0) state.queue = state.queue.slice(0, state.current + 1);
      state.queue.push({ undo, redo });
      state.current++;
      console.log(state.queue);
    });
  };
  // 重做
  registry({
    name: "redo",
    keybord: "ctrl+y",
    execute() {
      return {
        redo() {
          const cmd = state.queue[state.current + 1]; // 还原操作
          if (cmd) {
            cmd.redo?.();
            state.current++;
          }
        }
      };
    }
  });
  // 撤销
  registry({
    name: "undo",
    keybord: "ctrl+z",
    execute() {
      return {
        redo() {
          if (state.current === -1) return; // 不需要撤销了
          const cmd = state.queue[state.current];
          if (cmd) {
            cmd.undo?.();
            state.current--;
          }
        }
      };
    }
  });
  // 拖拽
  registry({
    name: "drag",
    init() {
      // 一上来就会执行
      // 监控拖拽开始事件 保存状态
      const dragstart = () => (this.before = deepcopy(configData.value?.blocks));
      // 拖拽后需要触发对应的指令
      const dragend = () => state.commands.get("drag")!();
      events.on(EVENT_NAMES.DRAGSTART, dragstart);
      events.on(EVENT_NAMES.DRAGEND, dragend);
      return () => {
        events.off(EVENT_NAMES.DRAGEND);
        events.off(EVENT_NAMES.DRAGSTART);
      };
    },
    pushQueue: true,
    execute() {
      const before = this.before,
        after = configData.value?.blocks; // 操作之后画布的状态
      return {
        redo() {
          configData.value = { ...configData.value!, blocks: after! };
        },
        undo() {
          configData.value = { ...configData.value!, blocks: before! };
        }
      };
    }
  });
  const keyboard = (() => {
    const onKeydown = (e: KeyboardEvent) => {
      const { ctrlKey, key } = e;
      const keyString = [] as string[];
      if (ctrlKey) {
        keyString.push("ctrl");
      }
      keyString.push(key);
      const shortcutKey = keyString.join("+");
      state.commandArray.forEach(({ keybord, name }) => {
        if (!keybord) return; // 没有键盘事件
        console.log(keybord, shortcutKey);
        if (keybord === shortcutKey) {
          state.commands.get(name)!();
          e.preventDefault();
        }
      });
    };
    const init = () => {
      addEventListener("keydown", onKeydown);
      return () => {
        removeEventListener("keydown", onKeydown);
      };
    };
    return () => ({ init });
  })();
  (() => {
    // 注册键盘事件
    state.commandArray.push(keyboard() as ICommand);
    state.commandArray.forEach(command => command.init && state.destroyArray.push(command.init()));
  })();
  onUnmounted(() => {
    // 清空绑定的事件
    state.destroyArray.forEach(fn => fn?.());
  });
  return state;
};

export interface ICommand {
  name: string;
  keybord?: string;
  init?: () => () => void;
  execute: () => { redo: () => void; undo?: () => void };
  pushQueue?: boolean; // 放入queue的操作类型
  before?: EditBlocksSchema[];
}