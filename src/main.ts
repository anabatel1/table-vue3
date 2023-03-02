import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { plugin, defaultConfig } from "@formkit/vue";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(VueQueryPlugin);
app.use(router);
app.use(Toast);
app.use(plugin, defaultConfig);

app.mount("#app");
