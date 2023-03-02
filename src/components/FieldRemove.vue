<script setup lang="ts">
import { useItemsStore } from "@/stores/items";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { useToast } from "vue-toastification";
import type { Item } from "@/stores/items";

const props = defineProps<{
  value: Item;
}>();

async function removeItem() {
  const store = useItemsStore();
  const result = await store.removeItem(props.value.id);

  const toast = useToast();
  if (result.type === "success") {
    toast.success(`Successfully deleted "${props.value.name}"`, {
      timeout: 2000,
    });

    return;
  }

  toast.error(`Could not delete "${props.value.name}"`, {
    timeout: 2000,
  });
}
</script>

<template>
  <div class="flex justify-center align-middle">
    <XCircleIcon
      class="h-7 w-7 text-primary hover:text-secondary-content cursor-pointer"
      @click.stop="removeItem"
    />
  </div>
</template>
