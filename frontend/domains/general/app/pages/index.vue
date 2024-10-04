<script setup>

/* page */

definePageMeta({
  name: 'general.home',
});

useHead({
  title: '',
});

</script>


<template>
  <main>
    <content-container class=":uno: flex flex-col items-center justify-center gap-3 py-8 md:py-50">

      <div class="w-full max-w-4xl text-center">
        <h1 class="text-4xl font-bold mb-2">Welcome to Rasa</h1>
        <p class="text-xl mb-8">Find your matches!</p>
        <div class="flex justify-center space-x-4">
          <u-btn class="primary shadow-xl shadow-primary/40">
            Ask your questions (soon)
          </u-btn>
        </div>
      </div>
      <div class="mt-16 w-full">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-center">
              Ask a question
            </h2>
          </div>
          <div class="border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-center">
              Give your answers
            </h2>
          </div>
          <div class="border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-center">
              Share for others
            </h2>
          </div>
        </div>
      </div>

    </content-container>
  </main>
</template>
