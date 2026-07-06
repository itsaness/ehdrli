import './assets/style.css';
import { AVPlugin } from "vue-audio-visual";
import {router} from "../router/index.js";
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);
app.use(AVPlugin);
app.use(router);
app.use(LoadingPlugin);
app.mount("#app");

