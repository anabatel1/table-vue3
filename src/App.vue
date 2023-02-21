<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="min-h-screen bg-neutral-lighter">
    <div class="container mx-auto">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg-neutral-lighter {
  background-color: hsl(61, 9%, 67%);
}
</style>
