import * as React from "react";

import { cn } from "@/lib/utils";

export interface HeadingProps
  extends React.InputHTMLAttributes<HTMLHeadingElement> {
  as: "h1" | "h2" | "h3" | "h4";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, ...props }, ref) => {
    const Component = props.as;

    const styles = {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    };

    return (
      <Component
        className={cn(styles[props.as], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Heading.displayName = "Heading";

export { Heading };
