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
  <div>
    <div class="grid grid-cols-2 gap-4">
      <u-card class="outline neutral text-center interactive" @click="selectEntry(currentEntry)">
        <p class="text-lg md:text-2xl">
          {{ currentEntry?.name }}
        </p>
      </u-card>
      <u-card class="outline neutral text-center interactive" @click="selectEntry(nextEntry)">
        <p class="text-lg md:text-2xl">
          {{ nextEntry?.name }}
        </p>
      </u-card>
    </div>
  </div>
</template>
