<script setup>

/* interface */

const props = defineProps({
  question: Object,
});

const model = defineModel({
  type: Array,
});


/* answers */

onMounted(() => {
  model.value ??= [];
});

const currentEntry = computed(() => {
  
  if (!( model.value?.length > 0 )) {
    return props.question.entries[0];
  }

  return props.question.entries.find(entry => entry.name === model.value.at(-1));

});

const nextEntry = computed(() => {

  if (!( model.value?.length > 0 )) {
    return props.question.entries[1];
  }

  return props.question.entries[model.value.length + 1];

});

function selectEntry(entry) {
  model.value.push(entry.name);
};

</script>


<template>
  <div class="max-w-md mx-auto">
    <div class="grid grid-cols-2 items-start gap-4">
      <u-card :key="currentEntry?.name" class="soft neutral text-center interactive" @click="selectEntry(currentEntry)">
        <p class="text-lg md:text-lg">

          <img
            v-if="currentEntry?.image"
            :src="currentEntry.image.path"
            class="mb-2"
          />

          {{ currentEntry?.name }}

        </p>
      </u-card>
      <u-card :key="nextEntry?.name" class="soft neutral text-center interactive" @click="selectEntry(nextEntry)">
        <p class="text-lg md:text-lg">

          <img
            v-if="nextEntry?.image"
            :src="nextEntry.image.path"
            class="mb-2"
          />

          {{ nextEntry?.name }}

        </p>
      </u-card>
    </div>
  </div>
</template>
