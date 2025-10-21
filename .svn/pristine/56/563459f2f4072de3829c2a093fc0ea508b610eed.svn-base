import { createSSRApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import messages from './locale/index';

import * as Pinia from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

let i18nConfig = {
    locale: uni.getLocale(),
    messages,
};

const i18n = createI18n(i18nConfig);
export function createApp() {
    const app = createSSRApp(App);
    app.use(i18n);
    app.use(Pinia.createPinia().use(piniaPluginPersistedstate));
    return {
        app,
        Pinia,
    };
}

export { i18n };
