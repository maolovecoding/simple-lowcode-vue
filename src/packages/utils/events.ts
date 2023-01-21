/**
 * @Author: 毛毛
 * @Date: 2023-01-20 14:47:55
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-20 15:03:20
 * @description 发布订阅
 */
import mitt from "mitt";

export const events = mitt<{ DRAGSTART: any; DRAGEND: any }>(); // 导出一个发布订阅对象

export const EVENT_NAMES = {
  DRAGSTART: "DRAGSTART",
  DRAGEND: "DRAGEND"
} as const;
