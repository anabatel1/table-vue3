<script setup lang="ts">
const props = defineProps<{
  value: "available" | "unavailable";
}>();

const badgeType = props.value === "available" ? "badge-success" : "badge-error";
</script>

<template>
  <div :class="['badge', badgeType]">{{ props.value }}</div>
</template>
