<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";
import { useItemsStore, type Item } from "@/stores/items";
import type { Component } from "vue";

defineProps<{
  filteredItems: Item[];
}>();

interface DynamicComponent {
  status: Component;
  remove: Component;
  created: Component;
}

const store = useItemsStore();
const headers = computed(() => store.headers);

const dynamicComponents: DynamicComponent = {
  status: defineAsyncComponent(() => import("../components/FieldStatus.vue")),
  remove: defineAsyncComponent(() => import("../components/FieldRemove.vue")),
  created: defineAsyncComponent(() => import("../components/FieldDate.vue")),
};

function isDynamicComponentKey(key: string): key is keyof DynamicComponent {
  return Object.keys(dynamicComponents).includes(key);
}

function loadComponent(key: string): Component | undefined {
  return isDynamicComponentKey(key) ? dynamicComponents[key] : undefined;
}
</script>

<template>
  <tbody>
    <tr v-for="item in filteredItems" :key="item.id" class="hover">
      <td v-for="(header, index) in headers" :key="`${item.id}-td-${index}`">
        <component
          v-if="loadComponent(header)"
          :is="loadComponent(header)"
          :value="item[header as keyof typeof item] || item"
        />
        <template v-else>
          {{ item[header as keyof typeof item] }}
        </template>
      </td>
    </tr>
  </tbody>
</template>
