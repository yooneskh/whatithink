<script setup>

const config = useAppConfig();


/* seo */

useHead({
  titleTemplate: t => `${t ? `${t} - ` : ''}${config.brand.title}`,
});

useSeoMeta({
  'description': 'Ask questions and see how much your friends are similar to you.',
  'og:image': '/favicon.ico',
  'twitter:card': 'summary',
});

</script>


<template>

  <nuxt-route-announcer />
  
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>

  <unified-dialogs-provider />
  <unified-toasts-provider />

</template>


<style>
  :root {
    color: theme('colors.on-surface');
    background-color: theme('colors.surface');
  }
</style>
