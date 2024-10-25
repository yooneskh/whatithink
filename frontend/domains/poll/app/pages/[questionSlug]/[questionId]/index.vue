<script setup>

const route = useRoute();
const user = useUser();


/* page */

definePageMeta({
  name: 'poll.question',
});


/* question */

const questionId = computed(() =>
  route.params.questionId
);

const { data: question } = await useUFetch(computed(() => `/questions/${questionId.value}`), {
  query: {
    'populate': 'entries.image',
  },
});


/* seo */

useHead({
  title: computed(() => question.value?.name),
});


/* answers */

const answers = ref([]);
const submittingAnswer = ref(false);
const answerId = ref('');

const isFinished = computed(() =>
  answers.value.length === question.value.entries.length - 1
);

watch(isFinished, () => {
  if (isFinished.value) {
    confettiPageSides(2000);
    submitAsnwer();
  }
});


async function submitAsnwer() {

  const answer = await ufetch(`/answers/submit`, {
    loading: submittingAnswer,
    method: 'post',
    body: {
      user: user.value?._id,
      question: questionId.value,
      entries: answers.value,
    },
  });

  answerId.value = answer._id;

}


/* share */

const shareText = computed(() => {
  
  const answersText = answers.value.map((answer, index) => index === answers.value.length - 1 ? `👑 ${answer} 👑` : `${answer}`).join(' - ');
  const link = `https://whatithink.khoshghadam.com/${question.value.slug}/${question.value._id}?answer=${answerId.value}`;

  return `${question.value.name}\n\nfor me: ${answersText}\n\nWhat do you think? ${link}`;

});

async function copyToClipboard() {

  await navigator.clipboard.writeText(shareText.value);

  toastSuccess({
    title: 'Copied to clipboard',
  });

}

async function shareOnTwitter() {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.value)}`,
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
          Share this with your friends to know how much they think like you!
        </p>

        <div class="mt-4 space-x-2">
          <u-btn
            class="primary"
            icon="i-mdi-twitter"
            label="Share on Twitter"
            :click-handler="shareOnTwitter"
          />
          <u-btn
            icon="i-mdi-clipboard-text"
            label="Copy share text"
            :click-handler="copyToClipboard"
          />
        </div>

      </div>
    </template>

  </content-container>
</template>
