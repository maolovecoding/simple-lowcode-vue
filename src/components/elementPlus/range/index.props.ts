/*
 * @Author: 毛毛
 * @Date: 2023-01-28 12:03:14
 * @Last Modified by: 毛毛
 * @Last Modified time: 2023-01-28 12:05:14
 */
export const IRangeProps = {
  start: {
    type: Number
  },
  end: {
    type: Number
  }
};

export const IRangeEmits = {
  "update:start"(start: number) {
    return start !== null;
  },
  "update:end"(end: number) {
    return end !== null;
  }
};
