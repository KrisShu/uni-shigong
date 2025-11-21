import { ref } from 'vue';
import { i18n } from '@/main';
import { useGlobalStore } from '@/stores/index';
import { storeToRefs } from 'pinia';

type Lang = 'zh-Hans' | 'en';
export function useLocale() {
    const globalStore = useGlobalStore();

    const { locale } = storeToRefs(globalStore);

    // 2. 封装修改语言的 Action
    const changeLocale = (lang: Lang) => {
        globalStore.setLocale(lang);

        i18n.global.locale = lang;

        uni.setLocale(lang);
    };

    return { lang, changeLocale };
}
