import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { writeFileSync, copyFileSync } from 'fs'
import { resolve } from 'path'

// Copy index.html → 404.html after build so GitHub Pages serves the SPA
// for every route instead of returning a real 404.
const spa404Plugin = () => ({
  name: 'spa-404',
  closeBundle() {
    const dist = resolve(__dirname, 'dist')
    try {
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
    } catch (_) { /* ignore during dev */ }
  }
})

// https://vite.dev/config/
export default defineConfig({
  base: '/GADL/',
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
    spa404Plugin(),
  ]
});