import type { MDXComponents } from 'mdx/types'
import { Card, Cards } from "@/components/mdx/card";
import { Callout } from "@/components/mdx/callout";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        Card,
        Cards,
        Callout,
        ...components,
    }
}
