import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";

export { default as Status } from "./Status.vue";
export { default as StatusBadge } from "./StatusBadge.vue";

export const statusVariants = cva("size-2", {
  variants: {
    rounded: {
      default: "rounded-full",
      xs: "rounded-xs",
    },
    color: {
      green: "bg-green-500",
      red: "bg-rose-500",
      blue: "bg-blue-500",
      orange: "bg-orange-500",
      purple: "bg-purple-500",
      gray: "bg-gray-300",
    },
  },
  defaultVariants: {
    color: "green",
    rounded: "default",
  },
});

export type StatusVariants = VariantProps<typeof statusVariants>;
