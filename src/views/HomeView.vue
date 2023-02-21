<script setup lang="ts">
import { computed } from "vue";
import { useItemsStore } from "@/stores/items";
import type { Item } from "@/stores/items";
import { storeToRefs } from "pinia";
import TableHeaders from "@/components/TableHeaders.vue";
import TableRows from "@/components/TableRows.vue";
import Filters from "@/components/FiltersSection.vue";

const { store } = fetchItems();

function fetchItems() {
  const store = useItemsStore();
  store.fetchItems();

  return { store };
}

const {
  listItems: items,
  sortBy,
  filterDishType,
  filterStatusType,
  sortingOptions,
} = storeToRefs(store);

const anyFilterActive = computed(
  () => filterDishType.value.length || filterStatusType.value.length
);
const onlyDishType = computed(
  () => filterDishType.value.length && !filterStatusType.value.length
);
const onlyStatusType = computed(
  () => !filterDishType.value.length && filterStatusType.value.length
);

const filteredByBothStatuses = computed(() => {
  if (!anyFilterActive.value) {
    return items.value;
  }

  // Filter creates a copy - no need to worry about immutability
  if (onlyDishType.value) {
    return items.value.filter(store.filterByDishCb);
  }

  if (onlyStatusType.value) {
    return items.value.filter(store.filterByStatusCb);
  }

  return items.value.filter(
    (item: Item) => store.filterByDishCb(item) && store.filterByStatusCb(item)
  );
});

const sortedBySelection = computed(() => {
  const isNumberSort = ["count", "id"].includes(sortBy.value.sortKey);
  const isDateSort = ["created"].includes(sortBy.value.sortKey);
  const isDescending = sortBy.value.sortOrder === "descending";

  // Sort mutates the original array - need to copy the values to not mess up the original data
  if (isDateSort) {
    return isDescending
      ? [...filteredByBothStatuses.value].sort(sortingOptions.value.date)
      : [...filteredByBothStatuses.value]
          .sort(sortingOptions.value.date)
          .reverse();
  }

  if (isNumberSort) {
    return isDescending
      ? [...filteredByBothStatuses.value].sort(sortingOptions.value.number)
      : [...filteredByBothStatuses.value]
          .sort(sortingOptions.value.number)
          .reverse();
  }

  return isDescending
    ? [...filteredByBothStatuses.value].sort(sortingOptions.value.string)
    : [...filteredByBothStatuses.value]
        .sort(sortingOptions.value.string)
        .reverse();
});

const filteredItems = computed(() => sortedBySelection.value);
</script>

<template>
  <main>
    <Filters />
    <div class="overflow-x-auto w-full mt-3">
      <table class="table w-full">
        <TableHeaders />
        <TableRows :filteredItems="filteredItems" />
      </table>
    </div>
  </main>
</template>
