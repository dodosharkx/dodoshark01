import 'server-only'

import {readFile} from 'node:fs/promises'
import path from 'node:path'

import {compile} from 'tailwindcss'

import {toImageSrc} from './sanity-utils'
import type {SanityImage} from './types/sanity'

export type SolutionTemplateImageBinding = {
  _key?: string
  key?: string
  image?: SanityImage
}

export type SolutionCodeFieldValue =
  | string
  | {
      _type?: 'code'
      code?: string
      language?: string
    }

export type SolutionHtmlTemplateData = {
  html?: SolutionCodeFieldValue
  customCss?: SolutionCodeFieldValue
  templateImages?: SolutionTemplateImageBinding[]
}

export type PreparedSolutionTemplate = {
  html: string
  issues: string[]
}

const forbiddenHtmlPatterns = [
  /<script\b/i,
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
  /<link\b/i,
  /<style\b/i,
  /\bon[a-z]+\s*=/i,
  /javascript\s*:/i,
]

const forbiddenCssPatterns = [/@import/i, /expression\s*\(/i]
const compilerCache = new Map<string, Promise<string>>()

const baseTemplateCss = `
@import "tailwindcss" source(none);

@theme {
  --font-sans: Inter, "Segoe UI", Arial, sans-serif;
  --font-display: Outfit, Inter, "Segoe UI", Arial, sans-serif;
  --color-brand-300: #fdba74;
  --color-brand-400: #fb923c;
  --color-brand-500: #f97316;
  --color-ink-950: #0f172a;
  --color-ink-900: #1e293b;
  --color-ink-700: #334155;
  --color-ink-500: #64748b;
  --radius-panel: 0.75rem;
  --radius-card: 1rem;
  --shadow-brand-card: 0 20px 40px -12px rgba(15, 23, 42, 0.12);
}

@layer base {
  :root {
    color-scheme: light;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background: #ffffff;
    color: #334155;
    font-family: var(--font-sans);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  img, svg, video, canvas {
    display: block;
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
  }
}
`

function containsForbiddenPattern(source: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(source))
}

function getTemplateSource(value?: SolutionCodeFieldValue) {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (value && typeof value === 'object' && typeof value.code === 'string') {
    return value.code.trim()
  }

  return ''
}

function normalizeTemplateHtml(html: string) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return (bodyMatch?.[1] || html).trim()
}

function extractTailwindCandidates(html: string) {
  const candidates = new Set<string>()
  const classAttributePattern = /class\s*=\s*["']([^"']+)["']/gim

  for (const match of html.matchAll(classAttributePattern)) {
    const tokens = match[1]?.split(/\s+/).filter(Boolean) ?? []
    for (const token of tokens) {
      candidates.add(token)
    }
  }

  return Array.from(candidates)
}

function replaceTemplateAssets(
  source: string,
  assetMap: Map<string, string>,
  issues: string[],
) {
  return source.replace(/\{\{asset:([a-z0-9-]+)\}\}/gi, (_match, rawKey: string) => {
    const key = rawKey.trim().toLowerCase()
    const url = assetMap.get(key)

    if (!url) {
      issues.push(`Missing template image for key "${key}"`)
      return ''
    }

    return url
  })
}

async function loadTailwindStylesheet(id: string, base: string) {
  if (id === 'tailwindcss') {
    const filePath = path.join(process.cwd(), 'node_modules', 'tailwindcss', 'index.css')
    return {
      path: filePath,
      base: path.dirname(filePath),
      content: await readFile(filePath, 'utf8'),
    }
  }

  const filePath = path.resolve(base, id)
  return {
    path: filePath,
    base: path.dirname(filePath),
    content: await readFile(filePath, 'utf8'),
  }
}

async function compileTemplateCss(html: string, customCss: string) {
  const candidates = extractTailwindCandidates(html)
  const cacheKey = `${html}\n/*__CSS__*/\n${customCss}`

  let pending = compilerCache.get(cacheKey)

  if (!pending) {
    pending = compile(`${baseTemplateCss}\n${customCss}`, {
      loadStylesheet: loadTailwindStylesheet,
    }).then((compiler) => compiler.build(candidates))

    compilerCache.set(cacheKey, pending)
  }

  return pending
}

export async function prepareSolutionTemplate(
  template: SolutionHtmlTemplateData | null | undefined,
): Promise<PreparedSolutionTemplate | null> {
  const html = getTemplateSource(template?.html)
  const customCss = getTemplateSource(template?.customCss)

  if (!html) return null

  const issues: string[] = []

  if (containsForbiddenPattern(html, forbiddenHtmlPatterns)) {
    issues.push('Template HTML contains forbidden tags or attributes.')
  }

  if (customCss && containsForbiddenPattern(customCss, forbiddenCssPatterns)) {
    issues.push('Template CSS contains forbidden rules.')
  }

  const assetMap = new Map<string, string>()
  for (const item of template?.templateImages ?? []) {
    const key = item?.key?.trim().toLowerCase()
    const src = toImageSrc(item?.image, 2000, {fit: 'max'})

    if (!key || !src) continue
    assetMap.set(key, src)
  }

  const processedHtml = replaceTemplateAssets(normalizeTemplateHtml(html), assetMap, issues)
  const processedCss = replaceTemplateAssets(customCss, assetMap, issues)

  if (issues.length > 0) {
    return null
  }

  try {
    const compiledCss = await compileTemplateCss(processedHtml, processedCss)

    return {
      html: [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '<meta charset="utf-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1" />',
        '<style>',
        compiledCss,
        '</style>',
        '</head>',
        '<body>',
        processedHtml,
        '</body>',
        '</html>',
      ].join(''),
      issues,
    }
  } catch {
    return null
  }
}
