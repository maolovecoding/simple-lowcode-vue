/**
 * @Author: 毛毛
 * @Date: 2023-01-27 16:46:17
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-27 21:24:12
 */
export const isNoKeysObject = (o?: Record<keyof any, any>) => !o || Object.keys(o).length === 0;
