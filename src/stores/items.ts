import { ref, computed, type Ref } from "vue";
import { defineStore } from "pinia";

import axios from "axios";

// TODO: extract into an environment variable
const dbUrl = "http://localhost:3000";

export interface Item {
  name: string;
  identifier: string;
  id: number;
  created: string;
  count: number;
  dish_type: string;
  status: "available" | "unavailable";
}

export interface ItemForm {
  count: Item["count"];
  dish_type: Item["dish_type"];
  name: Item["name"];
  status: Item["status"];
  id: Item["id"];
}

export interface SortBy {
  sortKey: keyof Item;
  sortOrder: "ascending" | "descending";
}

export type NonSortableHeaders = "remove";

export type ItemHeaders = keyof Item;

export type Headers = ItemHeaders | NonSortableHeaders;

const formatFilters = (items: string[]) =>
  [...new Set(items)].sort((a, b) => a.localeCompare(b));

/**
 * Define store for items
 * ref()s become state properties
 * computed()s become getters
 * function()s become actions
 *
 * https://pinia.vuejs.org/core-concepts/#setup-stores
 */
export const useItemsStore = defineStore("items", () => {
  // State
  const list: Ref<Item[]> = ref([]);
  const currentItem: Ref<Item> = ref({} as Item);
  const sortBy: Ref<SortBy> = ref<SortBy>({
    sortKey: "name",
    sortOrder: "ascending",
  });
  const filterDishType = ref<Item["dish_type"][]>([]);
  const filterStatusType = ref<Item["status"][]>([]);
  const sortingOptions = ref({
    date: (a: Item, b: Item) =>
      new Date(b.created).getTime() - new Date(a.created).getTime(),
    number: (a: Item, b: Item) =>
      Number(b[sortBy.value.sortKey]) - Number(a[sortBy.value.sortKey]),
    string: (a: Item, b: Item) =>
      String(b[sortBy.value.sortKey]).localeCompare(
        String(a[sortBy.value.sortKey])
      ),
  });

  // Getters
  const listItems = computed(() => list.value);
  const itemHeaders = computed(
    () => Object.keys(listItems.value[0] || {}) as ItemHeaders[]
  );

  const nonSortableHeaders = computed<NonSortableHeaders[]>(() => ["remove"]);

  const headers = computed<Headers[]>(() => [
    ...itemHeaders.value,
    ...nonSortableHeaders.value,
  ]);

  const dishTypes = computed(() => {
    const extractedDishTypes = list.value.map((el) => el.dish_type);

    return formatFilters(extractedDishTypes);
  });

  const statuses = computed(() => {
    const extractedStatuses = list.value.map((el) => el.status);

    return formatFilters(extractedStatuses);
  });

  const filterByDishCb = (item: Item) =>
    filterDishType.value.includes(item.dish_type);
  const filterByStatusCb = (item: Item) =>
    filterStatusType.value.includes(item.status);

  // Actions
  function setSort(sortPreference: SortBy) {
    sortBy.value = sortPreference;
  }

  async function fetchItems(): Promise<Item[]> {
    try {
      const response = await axios.get<Item[]>(`${dbUrl}/items`);

      list.value = response.data || [];
      return list.value;
    } catch (err) {
      list.value = [];
      throw new Error(err as string);
    }
  }

  async function fetchItem(id: Item["id"]): Promise<Item> {
    try {
      const response = await axios.get<Item>(`${dbUrl}/items/${id}`);

      currentItem.value = response.data || {};
      return currentItem.value;
    } catch (err) {
      currentItem.value = {} as Item;
      throw new Error(err as string);
    }
  }

  async function removeItem(id: number): Promise<{ type: string }> {
    const result = await axios
      .delete(`${dbUrl}/items/${id}`)
      .then(() => {
        fetchItems();

        return {
          type: "success",
        };
      })
      .catch((err) => {
        console.warn(err);
        return {
          type: "error",
        };
      });

    return result;
  }

  async function updateItem(item: ItemForm): Promise<Item> {
    const formattedItem = {
      ...item,
      identifier: `${item.dish_type.substring(0, 3).toUpperCase()}_${item.id}`,
    };

    try {
      const result = await axios.put<Item>(
        `${dbUrl}/items/${item.id}`,
        formattedItem
      );

      currentItem.value = result.data || {};
      return currentItem.value;
    } catch (err) {
      currentItem.value = {} as Item;
      throw new Error(err as string);
    }
  }

  return {
    dishTypes,
    statuses,
    listItems,
    fetchItems,
    headers,
    setSort,
    sortBy,
    filterDishType,
    filterStatusType,
    sortingOptions,
    filterByDishCb,
    filterByStatusCb,
    itemHeaders,
    nonSortableHeaders,
    removeItem,
    fetchItem,
    currentItem,
    updateItem,
  };
});
