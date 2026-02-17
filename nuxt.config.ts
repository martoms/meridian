import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-02-17',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/supabase', 'shadcn-nuxt'],
  vite: {
    plugins: [tailwindcss()]
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/auth/sign-in',
      callback: '/auth/confirm',
      include: ['/dashboard', '/history', '/settings', '/onboarding'],
      saveRedirectToCookie: true
    },
    types: '~/types/database.types.ts'
  },
  shadcn: {
    prefix: '',
    componentDir: '~/components/ui'
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      titleTemplate: '%s | Meridian',
      meta: [
        {
          name: 'description',
          content: 'A private sales KPI scorecard for weekly targets and check-ins.'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        }
      ]
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
