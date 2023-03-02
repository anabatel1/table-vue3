<script setup lang="ts">
import { useItemsStore } from "@/stores/items";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import type { FormKitNode } from "@formkit/core";

const route = useRoute();
const store = useItemsStore();

const itemId = Number(route.params.id);

const { isLoading, isError } = useQuery({
  queryKey: ["item", itemId],
  queryFn: () => store.fetchItem(itemId),
});

const { isLoading: isLoadingItems, isError: isErrorItems } = useQuery({
  queryKey: ["items"],
  queryFn: store.fetchItems,
});

const { currentItem: item, listItems } = storeToRefs(store);

const allItemNames = computed(() =>
  listItems.value
    .map((el) => el.name.toLowerCase())
    .filter((el) => el !== item.value.name.toLowerCase())
);

function validDishName(node: FormKitNode) {
  // node.value is of type "unknown", but in this instance (dish name) it will always be a string
  const value = node.value as string;
  return !(value && allItemNames.value.includes(value.toLowerCase()));
}

const updateDish = async (formValues) => {
  console.log("formValues", formValues);
  await new Promise((r) => setTimeout(r, 5000));
};

const inputClasses = {
  label: "label-text",
  input: "input input-bordered w-full",
  message: "text-error-content",
  inner: "input-primary",
  help: "formkit-help",
};

const selectClasses = {
  ...inputClasses,
  input: "select select-bordered w-full",
};
</script>

<template>
  <div v-if="isLoading || isLoadingItems">isLoading......</div>
  <div v-else-if="isError || isErrorItems">Something went wrong...</div>
  <main v-else>
    {{ JSON.stringify(item) }}

    <div>
      <h4 class="form-label">
        Edit <i>{{ item.name }}</i>
      </h4>
    </div>

    <FormKit
      type="form"
      :actions="false"
      #default="{ disabled, state: { valid, dirty } }"
      @submit="updateDish"
    >
      <FormKit
        type="text"
        :classes="inputClasses"
        name="name"
        id="name"
        :value="item.name"
        validation="required|(500)validDishName"
        :validation-rules="{ validDishName }"
        validation-visibility="live"
        :validation-messages="{
          validDishName: 'That dish already exists',
        }"
        label="Dish Name"
      />

      <FormKit
        type="text"
        :classes="inputClasses"
        name="dish_type"
        id="dish_type"
        label="Dish Type"
        :value="item.dish_type"
        validation="required"
        validation-visibility="live"
      />

      <FormKit
        type="number"
        :classes="inputClasses"
        name="count"
        id="count"
        validation="required|min:0"
        label="Count"
        min="0"
        :value="item.count"
        help="How many dishes are there?"
      />

      <FormKit
        type="select"
        :classes="selectClasses"
        label="Dish status"
        name="status"
        :value="item.status"
        placeholder="Select a status"
        :options="[
          { label: 'Available', value: 'available' },
          { label: 'Unavailable', value: 'unavailable' },
        ]"
      />
      <FormKit
        type="submit"
        :disabled="disabled || !valid || !dirty"
        :classes="{
          input: 'btn btn-primary formkit-disabled:btn-disabled',
          wrapper: 'my-3',
        }"
      />
    </FormKit>
  </main>
</template>
