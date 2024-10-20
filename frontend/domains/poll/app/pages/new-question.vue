<script setup>

/* page */

definePageMeta({
  name: 'poll.new-question',
  middleware: 'is-authenticated',
});

useHead({
  title: 'Create a question',
});


/* question */

import slug from 'slug';

const question = ref({
  name: '',
  entries: [],
});

const isValid = computed(() => {
  return question.value.name && question.value.entries.length >= 3 && question.value.entries.every(entry => entry.name);
});


async function handleSubmit() {

  const resp = await ufetch('/questions/', {
    method: 'post',
    body: {
      user: useUser().value._id,
      name: question.value.name,
      slug: slug(question.value.name),
      entries: question.value.entries,
    },
  });

  toastSuccess({
    title: 'Question created.',
  });

  navigateTo({
    name: 'poll.question',
    params: {
      questionSlug: resp.slug,
      questionId: resp._id,
    },
  });

}

</script>


<template>
  <content-container class="py-3 max-w-xl">

    <h1 class="text-xl font-bold">
      Create a question
    </h1>

    <u-form
      :target="question"
      class="mt-4"
      :fields="[
        {
          key: 'name', identifier: 'text', label: 'Title',
        },
        {
          key: 'entries', identifier: 'series', label: 'Options',
          itemFields: [
            { key: 'name', identifier: 'text', label: 'Label', width: 6 },
            { key: 'image', identifier: 'media', label: 'Image', width: 6 },
          ],
        },
      ]"
    />

    <p v-if="!isValid" class="text-sm text-danger mt-4">
      Please provide the Title and at least 3 options. All options must have a label.
    </p>

    <u-btn
      label="Submit the question"
      class="mt-4"
      :disabled="!isValid"
      :click-handler="handleSubmit"
    />

  </content-container>
</template>