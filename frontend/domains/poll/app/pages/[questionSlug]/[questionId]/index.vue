<script setup>

const route = useRoute();


/* page */

definePageMeta({
  name: 'poll.question',
});


/* question */

const questionId = computed(() =>
  route.params.questionId
);

const { data: question } = await useUFetch(
  computed(() => `/questions/${questionId.value}`)
);


/* seo */

useHead({
  title: computed(() => question.value?.name),
});


/* answers */

const answers = ref([]);

const isFinished = computed(() =>
  answers.value.length === question.value.entries.length - 1
);


/* share */

async function shareOnTwitter() {

  const answersText = answers.value.map((answer, index) => index === answers.value.length - 1 ? `👑 ${answer} 👑` : `${answer}`).join(' -> ');
  const link = `https://rasa.khoshghadam.com/${question.value.slug}/${question.value._id}/${123}`;
  const text = `${question.value.name}\n\nthis is me:${answersText}\n\nDo you think like me? ${link}`;

  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    '_blank'
  );

}

</script>


<template>
  <content-container class="py-2">
    
    <h1 class="text-3xl font-bold text-center mt-10">
      {{ question.name }}
    </h1>

    <template v-if="!isFinished">
      <question-entry-taker
        class="mt-10"
        :question="question"
        v-model="answers"
      />
    </template>

    <template v-else>
      <div class="mt-10 text-center">

        <p class="text-xl font-bold">
          🔥 Got it! This looks good! 🔥
        </p>

        <div class="mt-4 flex flex-col gap-2 items-center">
          <template v-for="(answer, index) in answers" :key="index">
            
            <u-icon
              v-if="index > 0"
              name="i-mdi-arrow-down"
              class="opacity-75"
            />

            <div class="text-lg" :class="{ '!text-2xl font-bold': index === answers.length - 1 }">
              <template v-if="index === answers.length - 1">
                👑
              </template>
              {{ answer }}
              <template v-if="index === answers.length - 1">
                👑
              </template>
            </div>

          </template>
        </div>

        <p class="mt-8 text-lg">
          Share this with your friends to know how much others think like you!
        </p>

        <div class="mt-4">
          <u-btn
            class="primary"
            icon="i-mdi-twitter"
            label="Share on Twitter"
            :click-handler="shareOnTwitter"
          />
        </div>

      </div>
    </template>

  </content-container>
</template>
