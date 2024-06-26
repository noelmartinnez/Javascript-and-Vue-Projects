import { createApp } from "vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "./plugins/font-awesome";

import App from "./App.vue";
import router from "./router";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
