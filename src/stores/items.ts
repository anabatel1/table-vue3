import { ref, computed } from "vue";
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
  status: string;
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
  const list = ref([] as Item[]);
  const sortBy = ref({ sortKey: "name", sortOrder: "ascending" } as SortBy);
  const filterDishType = ref([] as Item["dish_type"][]);
  const filterStatusType = ref([] as Item["status"][]);
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
  const listItems = computed<Item[]>(() => list.value);
  const itemHeaders = computed(
    () => Object.keys(listItems.value[0] || {}) as ItemHeaders[]
  );

  const nonSortableHeaders = computed(() => ["remove"] as NonSortableHeaders[]);

  const headers = computed(
    () => [...itemHeaders.value, ...nonSortableHeaders.value] as Headers[]
  );

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

  async function fetchItems() {
    const response = await axios
      .get(`${dbUrl}/items`)
      .then((res) => res?.data || [])
      .catch((err) => console.warn(err));

    list.value = response;
  }

  async function removeItem(id: number) {
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
  };
});
