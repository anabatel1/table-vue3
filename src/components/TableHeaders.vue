<script setup lang="ts">
import { computed } from "vue";
import { useItemsStore } from "@/stores/items";
import type { ItemHeaders } from "@/stores/items";
import { storeToRefs } from "pinia";
import TableHeader from "./TableHeader.vue";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/vue/24/solid";

const store = useItemsStore();

let { sortBy } = storeToRefs(store);

const itemHeaders = computed(() => store.itemHeaders);
const nonSortableHeaders = computed(() => store.nonSortableHeaders);

function sortAlphabetically(header: ItemHeaders) {
  store.setSort({
    sortKey: header,
    sortOrder:
      header === sortBy.value.sortKey && sortBy.value.sortOrder === "ascending"
        ? "descending"
        : "ascending",
  });
}

const arrow = computed(() => sortBy.value.sortOrder === "ascending");
</script>

<template>
  <thead>
    <tr>
      <TableHeader
        :headers="itemHeaders"
        keyPrefix="th"
        :on-click-event="(header: ItemHeaders) => sortAlphabetically(header)"
      >
        <template #header="{ header }">
          <ArrowUpIcon
            v-if="header === sortBy.sortKey && arrow"
            class="text-secondary-content table-header__icon"
          />
          <ArrowDownIcon
            v-else-if="header === sortBy.sortKey && !arrow"
            class="text-secondary-content table-header__icon"
          />
          <ArrowsUpDownIcon v-else class="text-primary table-header__icon" />
        </template>
      </TableHeader>

      <TableHeader :headers="nonSortableHeaders" keyPrefix="ns-th" />
    </tr>
  </thead>
</template>

<style scoped lang="scss">
.table-header {
  &__icon {
    display: inline-block;
    @apply h-3 w-3;
  }
}
</style>
