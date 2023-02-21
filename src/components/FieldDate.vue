<script setup lang="ts">
defineProps<{
  value: string;
}>();
</script>

<template>
  <div class="flex text-right justify-end">
    {{ new Date(value).toLocaleDateString() }}
  </div>
</template>
