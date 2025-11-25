// @ts-nocheck
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

function Empty({ className = "", ...props }) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-balance text-gray-700 shadow-sm md:p-12 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200",
        className
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className = "", ...props }) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center text-gray-800 dark:text-gray-100",
        className
      )}
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({ className = "", variant = "default", ...props }) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function EmptyTitle({ className = "", ...props }) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100",
        className
      )}
      {...props}
    />
  );
}

function EmptyDescription({ className = "", ...props }) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed text-gray-500 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary dark:text-gray-400",
        className
      )}
      {...props}
    />
  );
}

function EmptyContent({ className = "", ...props }) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance text-gray-700 dark:text-gray-200",
        className
      )}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
