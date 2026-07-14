import './assets/style.css';
import { AVPlugin } from "vue-audio-visual";
import {router} from "../router/index.js";
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { createI18n } from 'vue-i18n';
import english from '../local/en.js';
import arabic from '../local/ar.js';

import { createApp } from 'vue';
import App from './App.vue';
const i18n = createI18n({
    legacy:false,
    locale:'ar',
    messages:{
        en:english,
        ar:arabic
     }

});
const app = createApp(App);
app.use(AVPlugin);
app.use(router);
app.use(LoadingPlugin);
app.use(i18n);
app.mount("#app");

