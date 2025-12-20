"use client";

import * as React from "react";
import { Coins } from "lucide-react";

const CoinsIcon = React.forwardRef<
    SVGSVGElement,
    React.ComponentPropsWithoutRef<typeof Coins>
>(({ className, ...props }, ref) => (
    <Coins ref={ref} className={className} {...props} />
));

CoinsIcon.displayName = "CoinsIcon";

export { CoinsIcon };
