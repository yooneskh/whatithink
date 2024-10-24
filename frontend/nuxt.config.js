

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  extends: [
    './domains/poll',
    './domains/general',
    './domains/authentication',
    './domains/admin',
    './plugins/unified-app',
  ],
  modules: [
    'nuxt-gtag',
  ],
  gtag: {
    id: 'G-0DRC4NL83S',
  },
});
