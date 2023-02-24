<script setup lang="ts">
import { computed } from "vue";
import { useItemsStore } from "@/stores/items";

defineProps<{
  filteredItemsLength: number;
  itemsLength: number;
}>();

const store = useItemsStore();
const headers = computed(() => store.headers);
</script>

<template>
  <tfoot>
    <tr>
      <th :colspan="headers.length">
        Filtered out of total items: {{ filteredItemsLength }} /
        {{ itemsLength }}
      </th>
    </tr>
  </tfoot>
</template>
