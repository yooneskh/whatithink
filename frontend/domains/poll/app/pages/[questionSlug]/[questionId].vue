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


/* answer */

const previousAnswerId = computed(() =>
  route.query.answer
);

const { data: previousAnswer } = !previousAnswerId.value ? {} : await useUFetch(computed(() => `/answers/${previousAnswerId.value}`));


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

const matchPercentage = computed(() => {

  if (!previousAnswer.value) {
    return 0;
  }

  const matches = answers.value.filter((answer, index) => answer === previousAnswer.value?.entries?.[index]).length;
  return Math.round((matches / answers.value.length) * 100);

});


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
      answer: previousAnswerId.value,
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


const shareTextMatch = computed(() => {
  
  const answersText = answers.value.map((answer, index) => `${answer} ${answer === previousAnswer.value?.entries?.[index] ? '✅' : '❌'} ${previousAnswer.value?.entries?.[index]}`).join('\n');
  const link = `https://whatithink.khoshghadam.com/${question.value.slug}/${question.value._id}/${answerId.value}`;

  return `We were ${matchPercentage.value}% match!\n\n${answersText}\n\nWhat do you think? ${link}`;

});

async function copyToClipboardMatch() {

  await navigator.clipboard.writeText(shareTextMatch.value);

  toastSuccess({
    title: 'Copied to clipboard',
  });

}

async function shareOnTwitterMatch() {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextMatch.value)}`,
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

        <template v-if="!previousAnswerId">
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
        </template>
        <template v-else>
          <table class="mt-4 mx-auto text-center">
            <thead>
              <tr>
                <th>Yours</th>
                <th />
                <th>Theirs</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(answer, index) in answers" :key="index">
                <tr>
                  <td>
                    <template v-if="index === answers.length - 1">
                      👑
                    </template>
                    {{ answer }}
                    <template v-if="index === answers.length - 1">
                      👑
                    </template>
                  </td>
                  <td class="px-2">
                    <u-icon
                      v-if="answer === previousAnswer?.entries[index]"
                      name="i-mdi-equal"
                      class="text-success"
                    />
                    <u-icon
                      v-else
                      name="i-mdi-not-equal"
                      class="text-danger"
                    />
                  </td>
                  <td>
                    <template v-if="index === answers.length - 1">
                      👑
                    </template>
                    {{ previousAnswer?.entries[index] }}
                    <template v-if="index === answers.length - 1">
                      👑
                    </template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <p class="mt-8 text-2xl font-bold">
            You are {{ matchPercentage }}% match! <span v-if="matchPercentage === 69">Nice!</span>
          </p>
        </template>

        <p class="mt-8 text-lg">
          Share this with your friends to know how much you think alike!
        </p>

        <div class="mt-4 space-x-2">
          <u-btn
            class="primary"
            icon="i-mdi-twitter"
            label="Share on Twitter"
            :click-handler="previousAnswerId ? shareOnTwitterMatch : shareOnTwitter"
          />
          <u-btn
            icon="i-mdi-clipboard-text"
            label="Copy share text"
            :click-handler="previousAnswerId ? copyToClipboardMatch : copyToClipboard"
          />
        </div>

        <template v-if="previousAnswerId">

          <hr class="my-4" />

          <p class="text-lg">
            Or share your own answer separately:
          </p>

          <div class="mt-2 space-x-2">
            <u-btn
              icon="i-mdi-twitter"
              label="Share on Twitter"
              class="primary"
              :click-handler="shareOnTwitter"
            />
            <u-btn
              icon="i-mdi-clipboard-text"
              label="Copy share text"
              :click-handler="copyToClipboard"
            />
          </div>

        </template>

      </div>
    </template>

  </content-container>
</template>
