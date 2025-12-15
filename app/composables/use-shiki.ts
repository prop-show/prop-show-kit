import type { Highlighter } from 'shiki'

import { createHighlighter } from 'shiki'

let highlighter: Highlighter | null = null

export function useShiki() {
    const initHighlighter = async () => {
        if (!highlighter) {
            highlighter = await createHighlighter({
                themes: ['vesper'],
                langs: ['vue', 'ts', 'tsx', 'js', 'json', 'bash'],
            })
        }
        return highlighter
    }

    return {
        initHighlighter,
    }
}
