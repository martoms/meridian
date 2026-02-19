import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const projectRoot = resolve(import.meta.dirname, '..')
const faviconPath = resolve(projectRoot, 'public/favicon.png')
const nuxtConfigPath = resolve(projectRoot, 'nuxt.config.ts')

describe('Meridian favicon', () => {
  it('ships a non-empty raster mark as the only configured browser icon', () => {
    expect(existsSync(faviconPath)).toBe(true)
    expect(statSync(faviconPath).size).toBeGreaterThan(1024)

    const nuxtConfig = readFileSync(nuxtConfigPath, 'utf8')
    expect(nuxtConfig).toContain("href: '/favicon.png'")
    expect(nuxtConfig).not.toContain("href: '/favicon.ico'")
  })
})
