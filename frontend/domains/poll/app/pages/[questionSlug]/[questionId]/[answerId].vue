<script setup>

/* page */

definePageMeta({
  name: 'general.answer',
});

useHead({
  title: 'Answer',
});

</script>


<template>
  <main>
    <content-container>
      {{ $route.params }}
    </content-container>
  </main>
</template>
