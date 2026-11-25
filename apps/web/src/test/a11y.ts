import axe, { type AxeResults, type Result, type RunOptions } from 'axe-core'
import { expect } from 'vitest'

export const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] as const

/** Formats axe-core violations into a readable diagnostic report. */
export function formatViolations(violations: Result[]): string {
  if (violations.length === 0) {
    return 'No accessibility violations found.'
  }

  return violations
    .map((violation, index) => {
      const nodes = violation.nodes
        .map((node) => {
          const target = node.target.join(', ')
          const summary = node.failureSummary ? `\n      ${node.failureSummary.replace(/\n/g, '\n      ')}` : ''
          return `    - Target: ${target}\n      HTML: ${node.html}${summary}`
        })
        .join('\n')

      return [
        `${index + 1}. [${violation.impact ?? 'unknown'}] ${violation.id}: ${violation.help}`,
        `   Tags: ${violation.tags.join(', ')}`,
        `   Docs: ${violation.helpUrl}`,
        `   Nodes:\n${nodes}`,
      ].join('\n')
    })
    .join('\n\n')
}

/** Runs axe-core against a rendered container targeting WCAG Level A and AA criteria. */
export async function runWcagAudit(
  container: HTMLElement,
  options?: RunOptions,
): Promise<AxeResults> {
  return axe.run(container, {
    runOnly: {
      type: 'tag',
      values: [...WCAG_AA_TAGS],
    },
    ...options,
  })
}

/** Asserts that a rendered container has zero WCAG Level A/AA violations. */
export async function expectNoWcagViolations(
  container: HTMLElement,
  options?: RunOptions,
): Promise<void> {
  const results = await runWcagAudit(container, options)
  expect(results.violations, formatViolations(results.violations)).toEqual([])
}
