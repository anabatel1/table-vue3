<script setup lang="ts">
import { computed } from "vue";
import type { Headers } from "@/stores/items";

const props = defineProps<{
  headers: Headers[];
  keyPrefix: string;
  onClickEvent?: Function;
}>();

const headersFormatted = computed(() =>
  props.headers.map((header) => ({
    originalHeader: header,
    formattedHeader: header.split("_").join(" "),
  }))
);
</script>

<template>
  <th
    v-for="({ originalHeader, formattedHeader }, index) in headersFormatted"
    :key="`${keyPrefix}-${index}`"
    :class="['table-header', { 'table-header--clickable': onClickEvent }]"
    @click="() => onClickEvent && onClickEvent(originalHeader)"
  >
    {{ formattedHeader }}
    <slot name="header" v-bind="{ header: originalHeader }" />
  </th>
</template>

<style scoped lang="scss">
.table-header {
  user-select: none;

  &--clickable {
    cursor: pointer;
  }
}
</style>
