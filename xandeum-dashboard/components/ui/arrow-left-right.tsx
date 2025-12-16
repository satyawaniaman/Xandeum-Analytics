"use client";

import type React from "react";
import type { SVGProps } from "react";

interface ArrowLeftRightIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

export const ArrowLeftRightIcon: React.FC<ArrowLeftRightIconProps> = ({
    size = 24,
    ...props
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m16 3 4 4-4 4" />
            <path d="M20 7H4" />
            <path d="m8 21-4-4 4-4" />
            <path d="M4 17h16" />
        </svg>
    );
};

export { ArrowLeftRightIcon as default };
