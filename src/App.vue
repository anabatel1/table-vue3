<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="min-h-screen bg-neutral-lighter">
    <div class="container mx-auto">
      <RouterView :key="route.path" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg-neutral-lighter {
  background-color: hsl(61, 9%, 67%);
}
</style>
