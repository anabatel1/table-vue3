<script setup lang="ts">
defineProps<{
  title: string;
  dropdownItems: string[];
  selectedFilter: string[];
}>();
</script>

<template>
  <div class="dropdown dropdown-bottom">
    <label
      tabindex="0"
      class="btn m-1 bg-primary-focus hover:bg-secondary-content"
      >{{ title }}</label
    >
    <ul
      tabindex="0"
      class="dropdown-content menu shadow bg-secondary rounded-box w-52"
    >
      <li v-for="item in dropdownItems" :key="item">
        <label class="label cursor-pointer">
          <span class="label-text">{{ item.toUpperCase() }}</span>
          <input
            @click="$emit('filter-selected', item)"
            type="checkbox"
            :checked="selectedFilter.includes(item)"
            class="checkbox"
          />
        </label>
      </li>
      <li @click="$emit('filter-selected', '')">
        <label class="label cursor-pointer">
          <span class="label-text">CLEAR</span>
        </label>
      </li>
    </ul>
  </div>
</template>
