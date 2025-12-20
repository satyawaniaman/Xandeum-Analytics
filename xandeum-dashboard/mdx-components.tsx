import type { MDXComponents } from 'mdx/types'
import { Card, Cards } from "@/components/mdx/card";
import { Callout } from "@/components/mdx/callout";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        Card,
        Cards,
        Callout,
        // Table components with proper styling
        table: (props) => (
            <table className="w-full border-collapse border border-border my-4" {...props} />
        ),
        thead: (props) => (
            <thead className="bg-muted/50" {...props} />
        ),
        tbody: (props) => (
            <tbody {...props} />
        ),
        tr: (props) => (
            <tr className="border-b border-border" {...props} />
        ),
        th: (props) => (
            <th className="border border-border px-4 py-2 text-left font-semibold" {...props} />
        ),
        td: (props) => (
            <td className="border border-border px-4 py-2" {...props} />
        ),
        ...components,
    }
}

