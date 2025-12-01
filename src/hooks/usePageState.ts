import { ref, computed } from 'vue';
import { i18n } from '@/main';
export function usePageState() {
    const loadingStatus = ref<'loading' | 'release' | 'no-more'>('release'); // 记录状态，而非直接存文本
    const loadingText = computed(() => {
        switch (loadingStatus.value) {
            case 'loading':
                return i18n.global.t('common.loading');
            case 'release':
                return i18n.global.t('common.release');
            case 'no-more':
                return i18n.global.t('common.no-more');
            default:
                return '';
        }
    });

    return { loadingStatus, loadingText };
}
