/**
 * @Author: 毛毛
 * @Date: 2023-01-20 14:21:48
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-26 14:55:47
 * @description 实现撤销 重做等
 */

import deepcopy from "deepcopy";
import { EditBlocksSchema, EditSchema } from "@/schema/edit/edit.schema";
import { ComputedRef, onUnmounted, WritableComputedRef } from "vue";
import { events, EVENT_NAMES } from "../utils/events";

export const useCommand = (
  configData: WritableComputedRef<EditSchema | undefined>,
  computedFocusOrUnfocusComponents: ComputedRef<{
    focus: EditBlocksSchema[];
    unfocus: EditBlocksSchema[];
  }>
) => {
  const state = {
    current: -1, // 前进后退的索引值
    queue: [] as { redo: () => void; undo?: () => void }[], // 用户在画布上的操作
    commands: new Map<string, (...args: any[]) => void>(), // 命令和执行功能的映射表
    commandArray: [] as ICommand[], // 存放所有的命令
    destroyArray: [] as (() => void)[] // 销毁的命令
  }; // 状态
  const registry = (command: ICommand) => {
    state.commandArray.push(command);
    // 注册命令对应的执行函数
    state.commands.set(command.name, (...args: any[]) => {
      const { redo, undo } = command.execute(...args);
      redo();
      if (!command.pushQueue) return;
      // 需要放到队列里面
      // 干掉撤销过的命令 从队列移除 放置过程中撤销过的命令都扔掉
      if (state.queue.length > 0) state.queue = state.queue.slice(0, state.current + 1);
      state.queue.push({ undo, redo });
      state.current++;
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
  // 更新整个容器 导入导出
  registry({
    name: "updateContainer",
    pushQueue: true,
    execute(...args: any[]) {
      const state = {
        before: configData.value,
        after: args[0] // 最新值
      };
      return {
        redo() {
          configData.value = state.after;
        },
        undo() {
          configData.value = state.before;
        }
      };
    }
  });
  // 更新某个组件
  registry({
    name: "updateBlock",
    pushQueue: true,
    execute(...args: any[]) {
      const [newBlock, oldBlock] = args;
      const state = {
        before: configData.value!.blocks,
        after: (() => {
          // 一份新的block
          const blocks = deepcopy(configData.value!.blocks);
          const index = configData.value!.blocks.indexOf(oldBlock);
          if (index > -1) {
            blocks.splice(index, 1, newBlock);
          }
          return blocks;
        })()
      };
      return {
        redo() {
          configData.value = { ...configData.value!, blocks: state.after };
        },
        undo() {
          configData.value = { ...configData.value!, blocks: state.before };
        }
      };
    }
  });
  // 置顶
  registry({
    name: "placeTop",
    pushQueue: true,
    execute() {
      const state = {
        before: deepcopy(configData.value!.blocks),
        after: (() => {
          const { focus, unfocus } = computedFocusOrUnfocusComponents.value;
          const maxZIndex = unfocus.reduce(
            (prev, block) => Math.max(prev, block.zIndex!),
            -Infinity
          );
          focus.forEach(block => (block.zIndex = maxZIndex + 1));
          return configData.value!.blocks;
        })()
      };
      // 置顶就是找到所有blocks中zIndex最大的那个值，然后让获取焦点的组件的zIndex比其大一即可
      return {
        undo() {
          configData.value = { ...configData.value!, blocks: state.before };
        },
        redo() {
          configData.value = { ...configData.value!, blocks: state.after };
        }
      };
    }
  });
  registry({
    name: "placeBottom",
    pushQueue: true,
    execute() {
      const state = {
        before: deepcopy(configData.value!.blocks),
        after: (() => {
          const { focus, unfocus } = computedFocusOrUnfocusComponents.value;
          let minZIndex = unfocus.reduce((prev, block) => Math.min(prev, block.zIndex!), Infinity);
          if (minZIndex < 0) {
            minZIndex = 0;
            unfocus.forEach(block => (block.zIndex! += 1));
          }
          focus.forEach(block => (block.zIndex = minZIndex));
          return configData.value!.blocks;
        })()
      };
      // 置顶就是找到所有blocks中zIndex最大的那个值，然后让获取焦点的组件的zIndex比其大一即可
      return {
        undo() {
          configData.value = { ...configData.value!, blocks: state.before };
        },
        redo() {
          configData.value = { ...configData.value!, blocks: state.after };
        }
      };
    }
  });
  // 删除
  registry({
    name: "delete",
    pushQueue: true,
    execute() {
      const state = {
        before: deepcopy(configData.value!.blocks),
        after: computedFocusOrUnfocusComponents.value.unfocus // 未选中
      };
      return {
        redo() {
          configData.value = { ...configData.value!, blocks: state.after };
        },
        undo() {
          configData.value = { ...configData.value!, blocks: state.before };
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
  execute: (...args: any[]) => { redo: () => void; undo?: () => void };
  pushQueue?: boolean; // 放入queue的操作类型
  before?: EditBlocksSchema[];
}
