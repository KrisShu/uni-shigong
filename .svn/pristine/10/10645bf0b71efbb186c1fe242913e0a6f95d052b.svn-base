import { ref } from 'vue';

type AsyncFunction = (...args: any[]) => Promise<any>;

/**
 * useLock Hook：防止异步函数重复执行
 *
 * @param asyncFn - 异步函数
 * @returns 包含 loading 和 run 方法的对象
 */
export function useLock<F extends AsyncFunction>(
    asyncFn: F,
): {
    loading: any;
    run: (...args: Parameters<F>) => Promise<ReturnType<F> | undefined>; // ✅ 返回 Promise
} {
    const loading = ref(false);

    const run = async (...args: Parameters<F>): Promise<ReturnType<F> | undefined> => {
        if (loading.value) return;

        loading.value = true;

        try {
            const result = await asyncFn.apply(null, args);
            return result;
        } catch (error) {
            console.error('Error in useLock:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        run,
    };
}
