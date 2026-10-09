import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { birthday } from './src/config/birthday'

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: 'birthday-metadata',
    transformIndexHtml: html => html.replace('__BIRTHDAY_TITLE__', escapeHtml(birthday.siteTitle)).replace('__BIRTHDAY_DESCRIPTION__', escapeHtml(birthday.description)),
  }],
})
