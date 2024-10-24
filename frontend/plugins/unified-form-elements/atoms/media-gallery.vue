<script setup>

const user = useUser();


/* interface */

const props = defineProps({

});

const emit = defineEmits([
  'resolve',
]);


/* media */

const { pending, data: mediaList, refresh } = useUFetch(`/media/`, {
  query: {
    filter: computed(() => `owner:eq:${user.value._id}`),
    sort: 'createdAt:-1',
  },
});

const allExtensions = computed(() =>
  [...new Set( mediaList.value?.map(it => it.extension) )]
);


const query = ref('');
const selectedExtension = ref(undefined);

const queriedMediaList = computed(() =>
  mediaList.value.filter(it =>
    ([it.name, it.extension].join(' ').toLowerCase().includes(query.value.toLowerCase())) &&
    (!selectedExtension.value || (it.extension === selectedExtension.value))
  )
);


/* upload */

const elFile = ref();
const loading = ref(false);
const progress = ref(0);
const allFilesToUpload = ref(0);
const currentUploadingFileIndex = ref(0);


async function handleFilesSelected(files) {

  if (!files?.length) return;

  loading.value = true;
  allFilesToUpload.value = files.length;

  for (const file of files) {
    try {
      currentUploadingFileIndex.value++;
      await uploadSingleFile(file);
      confettiOnPageSides(500);
    }
    catch (error) {

      loading.value = false;
      console.error(error);

      toastDanger({
        title: 'Upload failed. Please try again. ' + error.message,
      });

      return;

    }
  }

  loading.value = false;

  toastSuccess({
    title: 'All files were uploaded successfully.',
  });

}

async function uploadSingleFile(file) {
  return new Promise((resolve, reject) => {

    const payload = new FormData();
    payload.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', useAppConfig().http.apiUrl + '/media/upload', true);
    xhr.setRequestHeader('Authorization', useToken().value);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        progress.value = (event.loaded / event.total) * 100;
      }
    };

    xhr.onload = () => {
      refresh();
      resolve();
    };

    xhr.onerror = () => {
      reject();
    };

    progress.value = 0;
    xhr.send(payload);

  });
}

async function deleteFile(media) {
  launchButtonPickerDialog({
    title: 'Delete Media',
    text: 'Are you sure you want to delete this media?',
    startButtons: [
      {
        label: 'Delete Media',
        classes: 'danger',
        handler: async () => {

          await ufetch(`/media/${media._id}`, {
            method: 'delete',
          });
        
          refresh();

        },
      },
    ],
    endButtons: [
      {
        label: 'No, Do not delete',
      },
    ],
  });
}

async function deleteAllCurrentMediaList() {
  launchButtonPickerDialog({
    title: 'Delete All Current Media List',
    text: 'Are you sure you want to delete all media in current media list? Only those media that are visible in the media gallery right now will be deleted.',
    options: {
      containerClasses: 'max-w-md',
    },
    startButtons: [
      {
        label: 'Delete All Current Media List',
        classes: 'danger',
        handler: async () => {
          for (const item of queriedMediaList.value) {

            await ufetch(`/media/${item._id}`, {
              method: 'delete',
            });

            refresh();

          }
        },
      },
    ],
    endButtons: [
      {
        label: 'No, Do not delete',
      },
    ],
  });
}

</script>


<template>
  <u-card
    icon="i-mdi-view-gallery-outline"
    title="Media Gallery"
    subtitle="Select media from gallery"
    class="w-5xl max-w-full">

    <template #append>
      <div class="flex items-center gap-1">

        <template v-if="loading">
          <span class="text-xs font-mono opacity-50 mt-2.5">
            <span class="me-2">{{ currentUploadingFileIndex }}/{{ allFilesToUpload }}</span>
            <span class="whitespace-pre">%{{ progress?.toFixed(0).padEnd(3) }}</span>
          </span>
        </template>
  
        <u-btn
          icon="i-mdi-upload"
          label="Upload New Media"
          class="primary text-sm"
          :loading="loading || pending"
          @click="elFile.click()"
        />
  
        <u-btn
          icon="i-mdi-dots-vertical"
          class="soft">
          <u-dropdown>
            <u-card class="fill neutral p-2">
              <p class="text-sm mb-1">
                Hazardous Actions
              </p>
              <u-btn
                icon="i-mdi-trash-can"
                label="Delete All Current Media List"
                class="soft danger text-sm"
                :click-handler="deleteAllCurrentMediaList"
              />
            </u-card>
          </u-dropdown>
        </u-btn>
      </div>

      <input
        ref="elFile"
        :key="loading"
        type="file"
        multiple
        class="hidden"
        @change="handleFilesSelected($event?.target.files)"
      />

    </template>

    <div class="my-3 flex items-start gap-4">
      <div>
        <u-input
          placeholder="Search"
          v-model="query"
        />
      </div>
      <div>
        <u-select
          placeholder="Filter File Type"
          :items="[
            { title: 'None', value: '' },
            ...allExtensions.map(it => ({ title: it, value: it })),
          ]"
          v-model="selectedExtension"
        />
      </div>
    </div>

    <div v-if="pending && !(mediaList?.length > 0)" class="p-6 text-center">
      <u-spinner
        class="w-[24px]"
      />
    </div>
    <div v-else-if="!pending && mediaList.length === 0" class="text-sm text-center p-3">
      You have not uploaded any media yet.
    </div>

    <div v-else class="grid grid-cols-3 md:grid-cols-9 gap-1">
      <div
        v-for="item of queriedMediaList" :key="item._id"
        class="relative cursor-pointer interactive"
        @click="emit('resolve', item._id)">

        <img
          :src="item.path"
          class="w-full aspect-square object-cover"
        />

        <p class="absolute bottom-1 left-1 right-1 bg-black p-1 text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis">
          {{ item.name }}.{{ item.extension }}
        </p>

        <u-tooltip class="text-sm">
          <p>
            {{ item.name }}.{{ item.extension }}
          </p>
          <p>
            {{ (item.size / 1024 / 1024).toFixed(2) }} MB
          </p>
          <p>
            {{ formatDate(item.createdAt) }}
          </p>
          <div class="space-x-1 mb-1 mt-2">
            <u-btn
              icon="i-mdi-trash-can"
              class="danger text-xs"
              @click="deleteFile(item)"
            />
          </div>
        </u-tooltip>

      </div>

    </div>

  </u-card>
</template>