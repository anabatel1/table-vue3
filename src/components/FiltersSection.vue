<script setup lang="ts">
import { computed } from "vue";
import FilterDropdown from "@/components/FilterDropdown.vue";
import { useItemsStore } from "@/stores/items";
import type { Item } from "@/stores/items";
import { storeToRefs } from "pinia";
const store = useItemsStore();

const dishTypes = computed(() => store.dishTypes);
const statuses = computed(() => store.statuses);

const { filterDishType, filterStatusType } = storeToRefs(store);

function filterBySelectedFilter(
  selectedFiltersArray: typeof filterDishType | typeof filterStatusType,
  selectedFilter: string
) {
  if (!selectedFilter) {
    selectedFiltersArray.value = [];
    return;
  }

  if (!selectedFiltersArray.value.includes(selectedFilter)) {
    selectedFiltersArray.value.push(selectedFilter);
  } else {
    selectedFiltersArray.value = selectedFiltersArray.value.filter(
      (el) => el !== selectedFilter
    );
  }

  selectedFiltersArray.value.sort((a: string, b: string) => a.localeCompare(b));
}

function filterByDishType(dish: Item["dish_type"]) {
  filterBySelectedFilter(filterDishType, dish);
}

function filterByStatusType(status: Item["status"]) {
  filterBySelectedFilter(filterStatusType, status);
}

function resetFilters() {
  filterDishType.value = [];
  filterStatusType.value = [];
}
</script>

<template>
  <div class="flex justify-end">
    <FilterDropdown
      title="Filter by dish type"
      :selected-filter="filterDishType"
      :dropdownItems="dishTypes"
      @filter-selected="filterByDishType"
    />

    <FilterDropdown
      title="Filter by status"
      :selected-filter="filterStatusType"
      :dropdownItems="statuses"
      @filter-selected="filterByStatusType"
    />

    <button class="btn btn-outline my-1 ml-5 mr-1" @click="resetFilters">
      Reset all filters
    </button>
  </div>
</template>
