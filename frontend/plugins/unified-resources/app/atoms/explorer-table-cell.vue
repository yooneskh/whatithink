<script setup>


/* interface */

const props = defineProps({
  header: Object,
  data: {},
});

const emit = defineEmits([

]);


/* series */

import ExplorerTableDialog from '../dialogs/explorer-table-dialog.vue';

function viewSeriesData() {
  launchDialog({
    component: ExplorerTableDialog,
    props: {
      title: 'Series Data',
      icon: 'i-mdi-table',
      headers: Object.entries(props.header.seriesSchema).map(it => ({ key: it[0], ...it[1] })),
      items: props.data,
    },
    options: {
      containerClasses: 'w-2xl'
    },
  });
}


/* template */

import ExplorerTableCellResource from './explorer-table-cell-resource.vue';

</script>


<template>

  <template v-if="props.header.variants">
    <template v-for="(headerExtra, variant) of props.header.variants" :key="variant">
      <span class="whitespace-nowrap text-sm underline m-1">
        {{ variant }}:
        <explorer-table-cell
          v-if="props.data[variant]"
          :header="{ ...props.header, ...(headerExtra || {}), variants: undefined }"
          :data="props.data[variant]"
        />
      </span>
    </template>
  </template>

  <template v-if="props.header.type === 'series'">
    <span class="whitespace-nowrap text-sm underline text-primary cursor-pointer" @click="viewSeriesData()">
      View Data
    </span>
  </template>

  <template v-else-if="props.header.array">
    <template v-for="(item, index) of data" :key="item?._id || index">
      <explorer-table-cell
        v-if="item"
        :header="{ ...props.header, array: false }"
        :data="item"
        class="m-1"
      />
    </template>
  </template>

  <template v-else-if="props.header.ref">
    <explorer-table-cell-resource
      v-if="data"
      :resource="props.header.ref"
      :resource-id="data"
    />
  </template>

  <template v-else-if="props.header.labelFormat">
    <span class="whitespace-nowrap text-sm">
      {{ !data ? '' : formatDate(data, props.header.labelFormat) }}
    </span>
  </template>

  <template v-else-if="props.header.type === 'boolean'">
    <template v-if="data">
      <u-icon name="i-mdi-check" class="text-sm text-success" />
    </template>
    <template v-else>
      <u-icon name="i-mdi-close" class="text-sm text-danger" />
    </template>
  </template>

  <template v-else-if="props.header.type === 'number'">
    <span class="whitespace-nowrap text-sm text-right">
      {{ props.data?.toLocaleString?.() ?? props.data }}
    </span>
  </template>

  <template v-else-if="props.header.items">
    <span class="whitespace-nowrap text-sm text-right">
      {{ props.header.items.find?.(it => it.value === props.data)?.title ?? props.data }}
    </span>
  </template>

  <template v-else>
    <span class="whitespace-nowrap text-sm">
      {{ props.data }}
    </span>
  </template>

</template>