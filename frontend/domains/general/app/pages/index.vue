<script setup>

/* page */

definePageMeta({
  name: 'general.home',
  middleware: defineNuxtRouteMiddleware(() => {
    if (useUser().value) {
      return navigateTo({ name: 'general.panel' });
    }
  })
});

useHead({
  title: '',
});


/* questions */

const { data: allQuestions } = await useUFetch('/questions/');

</script>


<template>
  <main>
    <content-container class=":uno: flex flex-col items-center justify-center gap-3 py-8 md:py-50">

      <div class="w-full max-w-4xl text-center">
        <h1 class="text-4xl font-bold mb-2">Welcome to Rasa</h1>
        <p class="text-xl mb-8">Find out what your friends think!</p>
        <div class="flex justify-center space-x-4">
          <nuxt-link :to="{ name: 'authentication' }">
            <u-btn class="primary shadow-xl text-xl shadow-primary/40">
              Ask your questions
            </u-btn>
          </nuxt-link>
        </div>
      </div>
      <div class="mt-16 w-full">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="border border-gray-300 p-6">
            <h2 class="text-xl font-semibold text-center">
              Ask a question
            </h2>
          </div>
          <div class="border border-gray-300 p-6">
            <h2 class="text-xl font-semibold text-center">
              Give your answers
            </h2>
          </div>
          <div class="border border-gray-300 p-6">
            <h2 class="text-xl font-semibold text-center">
              Share for others
            </h2>
          </div>
        </div>
      </div>

      <h2 class="mt-12 text-2xl font-bold">
        Current Questions
      </h2>

      <nuxt-link
        v-for="question of allQuestions" :key="question._id"
        :to="{ name: 'poll.question', params: { questionSlug: question.slug, questionId: question._id } }">
        <u-card class="soft neutral interactive">
          {{ question.name }}
        </u-card>
      </nuxt-link>

    </content-container>
  </main>
</template>
