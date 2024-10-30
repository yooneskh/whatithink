<script setup>

/* page */

definePageMeta({
  name: 'general.panel',
  middleware: 'is-authenticated',
});

useHead({
  title: 'Panel',
});


/* questions */

const { data: yourQuestions } = await useUFetch('/questions/', {
  query: {
    'filter': computed(() => `user:eq:${useUser().value._id}`),
  },
});

</script>


<template>
  <content-container class="py-3">
    
    <div class="flex items-start justify-between">
      <h1 class="text-xl font-bold">
        Your questions
      </h1>
      <nuxt-link :to="{ name: 'poll.new-question' }">
        <u-btn
          label="Create a question"
          class="text-sm"
        />
      </nuxt-link>
    </div>

    <section class="mt-4">

      <template v-if="yourQuestions.length === 0">
        <p class="text-center flex flex-col items-center gap-2 py-8">
          You have not created any questions yet.
          <nuxt-link :to="{ name: 'poll.new-question' }">
            <u-btn
              label="Create a question"
              class="text-sm"
            />
          </nuxt-link>
        </p>
      </template>

      <ol class="list-disc list-inside flex flex-col gap-1">
        <template v-for="question in yourQuestions" :key="question._id">
          <nuxt-link :to="{ name: 'poll.question', params: { questionSlug: question.slug, questionId: question._id } }">
            <li class="hover:underline">
              {{ question.name }}
            </li>
          </nuxt-link>
        </template>
      </ol>
    </section>

  </content-container>
</template>